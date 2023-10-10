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
    const scale = formData.get("scale") as string;

    if (!file) {
      return new NextResponse("No file found", { status: 400 });
    }

    if (!scale) {
      return new NextResponse("No scale found", { status: 400 });
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
      "499940604f95b416c3939423df5c64a5c95cfd32b464d755dacfe2192a2de7ef";

    const output = await replicate.predictions.create({
      version: modelURL,
      input: {
        image: dataURI,
        scale: parseInt(scale, 10),
      },
    });

    const resp_data = {
      generation_id: output.id,
      status: output.status,
    };

    return NextResponse.json(resp_data);
  } catch (err: any) {
    console.log("[UPSCALE_API_ERROR]");
    console.log(err);
    return new NextResponse(err, { status: 500 });
  }
}
