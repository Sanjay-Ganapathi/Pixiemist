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
    const sourceImage = formData.get("sourceImage") as Blob;
    const targetFace = formData.get("targetFace") as Blob;

    if (!sourceImage) {
      return new NextResponse("No Source Image Found", { status: 400 });
    }

    if (!targetFace) {
      return new NextResponse("No Target Face Found", { status: 400 });
    }

    const freeTrial = await checkApiLimit();
    const subscriptionPlan = await getUserSubscription(user.id);

    if (subscriptionPlan instanceof Error) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!freeTrial && !subscriptionPlan.isPro) {
      return new NextResponse("Free Tier Ended", { status: 403 });
    }

    const sourceImageBytes = await sourceImage.arrayBuffer();
    const sourceImageBuffer = Buffer.from(sourceImageBytes);
    const sourceImageURI = `data:${
      sourceImage.type
    };base64,${sourceImageBuffer.toString("base64")}`;

    const targetFaceBytes = await targetFace.arrayBuffer();
    const targetFaceBuffer = Buffer.from(targetFaceBytes);
    const targetFaceURI = `data:${
      targetFace.type
    };base64,${targetFaceBuffer.toString("base64")}`;

    const modelURL =
      "8c1e100ecabb3151cf1e6c62879b6de7a4b84602de464ed249b6cff0b86211d8";

    const output = await replicate.predictions.create({
      version: modelURL,
      input: {
        target: sourceImageURI,
        source: targetFaceURI,
        enhance_face: true,
      },
    });

    const resp_data = {
      generation_id: output.id,
      status: output.status,
    };

    return NextResponse.json(resp_data);
  } catch (err: any) {
    console.log("[FACE_SWAP_API_ERROR]");
    console.log(err);
    return new NextResponse(err, { status: 500 });
  }
}
