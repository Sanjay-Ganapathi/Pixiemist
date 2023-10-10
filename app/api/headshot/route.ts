import { NextRequest, NextResponse } from "next/server";
import Replicate from "replicate";

import { getCurrentUser } from "@/lib/session";
import { checkApiLimit } from "@/lib/api-limit";
import { getUserSubscription } from "@/lib/subscription";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN!,
});

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("image") as Blob;
    const gender = formData.get("gender") as string;
    const pose = formData.get("pose") as string;

    if (!file) {
      return new NextResponse("No file found", { status: 400 });
    }

    if (!gender) {
      return new NextResponse("No gender found", { status: 400 });
    }

    if (!pose) {
      return new NextResponse("No pose found", { status: 400 });
    }
    const freeTrial = await checkApiLimit();
    const subscriptionPlan = await getUserSubscription(user.id);
    if (subscriptionPlan instanceof Error) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    if (!freeTrial && !subscriptionPlan.isPro) {
      return new NextResponse("Free Tier Ended", { status: 403 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const dataURI = `data:${file.type};base64,${buffer.toString("base64")}`;

    const modelURL =
      "377cf09e230c0d599c2022aa315a56bbe588e625f8f517fc07086e6f286e62d5";

    const output = await replicate.predictions.create({
      version: modelURL,
      input: {
        image: dataURI,
        gender: gender,
        pose: pose,
        seed: -1,
      },
    });

    const resp_data = {
      generation_id: output.id,
      status: output.status,
    };

    return NextResponse.json(resp_data);
  } catch (err: any) {
    console.log("[HEADSHOT_API_ERROR]");
    console.log(err);
    return new NextResponse(err, { status: 500 });
  }
}
