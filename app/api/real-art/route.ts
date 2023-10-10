import { NextRequest, NextResponse } from "next/server";
import Replicate from "replicate";

import { getCurrentUser } from "@/lib/session";
import { checkApiLimit } from "@/lib/api-limit";
import { getUserSubscription } from "@/lib/subscription";

const NEGATIVE_PROMPT =
  "(deformed iris, deformed pupils, semi-realistic, cgi, 3d, render, sketch, cartoon, drawing, anime, mutated hands and fingers:1.4), (deformed, distorted, disfigured:1.3), poorly drawn, bad anatomy, wrong anatomy, extra limb, missing limb, floating limbs, disconnected limbs, mutation, mutated, ugly, disgusting, amputation, human anatomy";
const STRENGTH = 0.71;

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
    const prompt = formData.get("prompt") as string;

    if (!file) {
      return new NextResponse("No file found", { status: 400 });
    }

    if (!prompt) {
      return new NextResponse("No prompt found", { status: 400 });
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
      "82bbb4595458d6be142450fc6d8c4d79c936b92bd184dd2d6dd71d0796159819";

    const output = await replicate.predictions.create({
      version: modelURL,
      input: {
        image: dataURI,
        prompt: prompt,
        negative_prompt: NEGATIVE_PROMPT,
        strength: STRENGTH,
      },
    });

    const resp_data = {
      generation_id: output.id,
      status: output.status,
    };

    return NextResponse.json(resp_data);
  } catch (err: any) {
    console.log("[REAL_ART_API_ERROR]");
    console.log(err);
    return new NextResponse(err, { status: 500 });
  }
}
