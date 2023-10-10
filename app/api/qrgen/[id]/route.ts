import { NextRequest, NextResponse } from "next/server";
import Replicate from "replicate";

import { getCurrentUser } from "@/lib/session";
import prismadb from "@/lib/db";
import { uploadMultipleImages } from "@/lib/cloudinary";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN!,
});

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const user = await getCurrentUser();


  if (!user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }
  const prediction = await replicate.predictions.get(params.id);
  if (prediction?.status !== "succeeded" && prediction?.status !== "failed") {
    return NextResponse.json({ status: prediction.status, outputURL: "" });
  } else {
    if (prediction?.status === "succeeded") {
      const cloudinary_resp = await uploadMultipleImages(
        prediction.output as string[],
      );

      await prismadb.creation.createMany({
        data: cloudinary_resp?.map((imageUrl) => ({
          imageUrl,
          domain: "qr-code",
          userId: user.id,
        })),
      });

      return NextResponse.json(
        {
          status: prediction.status,
          outputURL: cloudinary_resp,
        },
        { status: 200 },
      );
    } else
      return NextResponse.json({ status: prediction.status, outputURL: "" });
  }
}
