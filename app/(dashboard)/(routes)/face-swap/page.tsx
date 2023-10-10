"use client";

import axios from "axios";
import toast from "react-hot-toast";
import { useEffect, useRef, useState } from "react";
import { set, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { z } from "zod";

import { Heading } from "@/components/heading";
import { HeadingShell } from "@/components/shell";
import { Loader } from "@/components/loaders";
import { Form, FormControl, FormItem, FormLabel } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Dropzone } from "@/components/dropzone";
import { FileWithPreview, OutputImgSlider } from "@/types";
import { sleep } from "@/lib/utils";
import { usePromodal } from "@/store/promodal-store";
import { formSchema } from "./constants";
import { ChevronsLeft, ChevronsUp } from "lucide-react";
import { ImageCompareSlider } from "@/components/image-compare-slider";

type Input = z.infer<typeof formSchema>;

const FaceSwapPage = () => {
  const [sourceImage, setSourceImage] = useState<FileWithPreview[]>([]);
  const [targetFace, setTargetFace] = useState<FileWithPreview[]>([]);

  const [outputSlider, setOutputSlider] = useState<OutputImgSlider>({
    previewURL: "",
    outputURL: "",
  });

  const proModal = usePromodal();

  const router = useRouter();

  const bottomOfPanelRef = useRef<HTMLDivElement>(null);

  const form = useForm<Input>({
    resolver: zodResolver(formSchema),
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (data: Input) => {
    try {
      console.log(data);

      if (
        !data?.sourceImage ||
        !Array.isArray(data.sourceImage) ||
        data.sourceImage.length <= 0
      ) {
        return toast.error("No Source Image is Selected");
      }

      if (
        !data?.targetFace ||
        !Array.isArray(data.targetFace) ||
        data.targetFace.length <= 0
      ) {
        return toast.error("No Target Face Image is Selected");
      }

      setOutputSlider({ previewURL: "", outputURL: "" });
      const formData = new FormData();
      formData.append("sourceImage", data.sourceImage[0]);
      formData.append("targetFace", data.targetFace[0]);

      let response = await axios.post("api/face-swap", formData);

      let { generation_id, status } = response.data;
      console.log(generation_id, status);

      while (status !== "succeeded" && status !== "failed") {
        await sleep(1000);
        response = await axios.get("api/face-swap/" + generation_id);
        status = response.data.status;
        console.log(status);
      }

      if (status === "failed") {
        if (response.data.outputURL == "No Face Found") {
          return toast.error(
            "No face found. Please try again with a different image",
          );
        }

        return toast.error("Server Error.Please try after some time");
      }

      console.log(response.data);

      if (response.data.outputURL == "No Face Found") {
        return toast.error(
          "No face found. Please try again with a different image",
        );
      } else {
        setOutputSlider({
          previewURL: sourceImage[0]?.preview,
          outputURL: response.data.outputURL,
        });

        setSourceImage([]);
        setTargetFace([]);

        form.reset();
      }
    } catch (err: any) {
      console.log(err);
      if (err?.response?.status === 403) {
        proModal.onOpen();
      } else toast.error("Internal Server Error.");
    } finally {
      router.refresh();
    }
  };

  useEffect(() => {
    if (bottomOfPanelRef.current) {
      bottomOfPanelRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [outputSlider]);

  return (
    <>
      <HeadingShell>
        <Heading heading="Face Swap" subHeading="Your Face, Their Body " />
      </HeadingShell>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="mx-6 mt-10 flex w-auto flex-col items-center justify-evenly gap-4 overflow-hidden rounded-md border-2 border-dashed border-primary p-4 md:flex-row md:p-20">
            <FormItem className="text-center ">
              <FormLabel>Reference Image</FormLabel>
              <FormControl>
                <Dropzone
                  name="sourceImage"
                  maxSize={5 * 1024 * 1024}
                  file={sourceImage}
                  setFile={setSourceImage}
                  setValue={form.setValue}
                  disabled={isLoading}
                  icon={true}
                  caption="Drop Here or Click to Select Image"
                  className=" rounded-sm border-2 border-dotted border-primary px-4 py-16 md:px-6 md:py-24 lg:px-8 lg:py-32"
                  ifAlwaysVisible={false}
                />
              </FormControl>
            </FormItem>

            <ChevronsUp size={36} strokeWidth={2.5} className="md:hidden" />
            <ChevronsLeft
              size={48}
              strokeWidth={2.5}
              className="hidden md:block"
            />

            <FormItem className="mb-4 text-center md:mb-0">
              <FormLabel>Your Face Image</FormLabel>
              <FormControl>
                <Dropzone
                  name="targetFace"
                  maxSize={5 * 1024 * 1024}
                  file={targetFace}
                  setFile={setTargetFace}
                  setValue={form.setValue}
                  disabled={isLoading}
                  icon={true}
                  caption="Drop Here or Click to Select Image"
                  className=" rounded-sm border-2 border-dotted border-primary px-4 py-16 md:px-6 md:py-24 lg:px-8 lg:py-32"
                  ifAlwaysVisible={false}
                />
              </FormControl>
            </FormItem>
          </div>
          <div className="mx-6 mt-2">
            <Button
              variant="outline"
              type="submit"
              disabled={isLoading}
              className="w-full rounded-md border-2 border-primary text-[12px] font-bold uppercase tracking-wider transition-colors hover:bg-primary hover:text-white"
            >
              Submit
            </Button>
          </div>
        </form>
      </Form>

      <div className="mx-6 mt-10 grid justify-items-center p-4">
        {isLoading ? (
          <Loader className="h-96 " />
        ) : (
          outputSlider.outputURL && (
            <ImageCompareSlider
              imageOne={outputSlider.previewURL}
              imageTwo={outputSlider.outputURL}
              downloadBtn={true}
            />
          )
        )}
        <div ref={bottomOfPanelRef}></div>
      </div>
    </>
  );
};

export default FaceSwapPage;
