import React from "react";
import Image from "next/image";
import { ReactCompareSlider } from "react-compare-slider";

import { Card } from "@/components/ui/card";
import { ChevronDownCircle } from "lucide-react";

type ImageCompareSliderProps = {
  imageOne: string;
  imageTwo: string;
  downloadBtn?: boolean;
  downloadImg?: "first" | "second";
};

export const ImageCompareSlider = ({
  imageOne,
  imageTwo,
  downloadBtn = false,
  downloadImg = "second",
}: ImageCompareSliderProps) => {
  return (
    <Card className="relative aspect-auto max-w-[350px] ">
      <ReactCompareSlider
        itemOne={
          <Image src={imageOne} alt="imageOne" width={400} height={400} />
        }
        itemTwo={
          <Image src={imageTwo} alt="imageTwo" width={400} height={400} />
        }
      />

      {downloadBtn && (
        <ChevronDownCircle
          size={26}
          className="absolute -right-2 -top-2 cursor-pointer fill-secondary transition-colors hover:fill-primary"
          onClick={() => {
            if (downloadImg === "first") {
              window.open(imageOne, "_blank");
            } else {
              window.open(imageTwo, "_blank");
            }
          }}
        />
      )}
    </Card>
  );
};
