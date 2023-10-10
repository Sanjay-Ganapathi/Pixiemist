"use client";
import axios from "axios";
import toast from "react-hot-toast";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { z } from "zod";

import { FileWithPreview, OutputImgSlider } from "@/types";
import { Heading } from "@/components/heading";
import { HeadingShell } from "@/components/shell";
import { Loader } from "@/components/loaders";
import { Form, FormControl, FormItem } from "@/components/ui/form";
import { dropImageSchema } from "@/lib/validations/dropImage";
import { Button } from "@/components/ui/button";
import { Dropzone } from "@/components/dropzone";
import { PageCard } from "@/components/page-card";
import { ImageCompareSlider } from "@/components/image-compare-slider";
import { sleep } from "@/lib/utils";
import { usePromodal } from "@/store/promodal-store";

type Input = z.infer<typeof dropImageSchema>;

const BackgroundRemovePage = () => {
  const [file, setFile] = useState<FileWithPreview[]>([]);
  const [outputSlider, setOutputSlider] = useState<OutputImgSlider>({
    previewURL: "",
    outputURL: "",
  });

  const proModal = usePromodal();

  const router = useRouter();

  const bottomOfPanelRef = useRef<HTMLDivElement>(null);

  const form = useForm<Input>({
    resolver: zodResolver(dropImageSchema),
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (data: Input) => {
    try {
      if (
        !data?.image ||
        !Array.isArray(data.image) ||
        data.image.length <= 0
      ) {
        return toast.error("No Image is Selected");
      }

      setOutputSlider({ previewURL: "", outputURL: "" });
      const formData = new FormData();
      formData.append("image", data.image[0]);

      let response = await axios.post("/api/bg-remove", formData);

      let { generation_id, status } = response.data;
      console.log(generation_id, status);

      while (status !== "succeeded" && status !== "failed") {
        await sleep(1000);
        response = await axios.get("api/bg-remove/" + generation_id);
        status = response.data.status;
        console.log(status);
      }

      if (status === "failed") {
        return toast.error("Server Error.Please try after some time");
      }

      console.log(response.data);

      setOutputSlider({
        previewURL: file[0]?.preview,
        outputURL: response.data.outputURL,
      });

      form.reset();
    } catch (err: any) {
      console.log("[CLIENT_BGREMOVE_ERROR");
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
        <Heading
          heading="Background Remove"
          subHeading="Remove Background from your Image"
        />
      </HeadingShell>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormItem>
            <FormControl>
              <Dropzone
                name="image"
                maxSize={5 * 1024 * 1024}
                file={file}
                setFile={setFile}
                setValue={form.setValue}
                disabled={isLoading}
                className="mx-6 mt-10 rounded-md border-2 border-dashed border-primary p-16"
              />
            </FormControl>
          </FormItem>

          <div className="mx-6 mt-1 ">
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

      <div className=" mx-6 mt-10 grid grid-cols-1 justify-items-center gap-8 py-4 md:grid-cols-2   ">
        {/* Preview */}
        {file[0]?.preview && (
          <PageCard
            src={file[0]?.preview}
            alt={file[0]?.name}
            closeBtn={true}
            // onLoad={() => URL.revokeObjectURL(file[0]?.preview)}
            onClick={() => setFile([])}
          />
        )}

        {/* Output */}
        {isLoading ? (
          <Loader className="h-96 md:h-full" />
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

export default BackgroundRemovePage;
