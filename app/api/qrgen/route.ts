import { NextRequest, NextResponse } from "next/server";
import Replicate from "replicate";

import { getCurrentUser } from "@/lib/session";
import { checkApiLimit } from "@/lib/api-limit";
import { getUserSubscription } from "@/lib/subscription";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN!,
});

const QR_CONDITIONAL_SCALE = 1.3;
const GUIDANCE_SCALE = 9;

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const body = await req.json();
    const { prompt, content, model, amount } = body;

    if (!prompt) {
      return new NextResponse("Prompt is required", { status: 400 });
    }

    if (!content) {
      return new NextResponse("Content is required", { status: 400 });
    }

    if (!model) {
      return new NextResponse("Model is required", { status: 400 });
    }
    if (!amount) {
      return new NextResponse("Amount is required", { status: 400 });
    }

    const freeTrial = await checkApiLimit();
    const subscriptionPlan = await getUserSubscription(user.id);
    if (subscriptionPlan instanceof Error) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!freeTrial && !subscriptionPlan.isPro) {
      return new NextResponse("Free Tier Ended", { status: 403 });
    }

    const modelURL =
      model === "1"
        ? "9cdabf8f8a991351960c7ce2105de2909514b40bd27ac202dba57935b07d29d4"
        : "628e604e13cf63d8ec58bd4d238474e8986b054bc5e1326e50995fdbc851c557";

    const req_options =
      model == "1"
        ? {
            qr_code_content: content,
            prompt: prompt,
            batch_size: parseInt(amount, 10),
            controlnet_conditioning_scale: QR_CONDITIONAL_SCALE,
            guidance_scale: GUIDANCE_SCALE,
          }
        : {
            url: content,
            prompt: prompt,
            num_outputs: parseInt(amount, 10),
            qr_conditioning_scale: QR_CONDITIONAL_SCALE,
            guidance_scale: GUIDANCE_SCALE,
          };

    const output = await replicate.predictions.create({
      version: modelURL,
      input: req_options,
    });

    // const replicate_res = string().array().parse(output);

    // const cloudinary_resp = await uploadMultipleImages(replicate_res);

    // await prismadb.creation.createMany({
    //   data: cloudinary_resp?.map((imageUrl) => ({
    //     imageUrl,
    //     domain: "qr-code",
    //     userId: user.id,
    //   })),
    // });

    const resp_data = {
      generation_id: output.id,
      status: output.status,
    };

    return NextResponse.json(resp_data, { status: 200 });
  } catch (err) {
    console.log("[QR_GEN_BACKEND_ERROR]");
    console.log(err);
    return NextResponse.json(err, { status: 500 });
  }
}
