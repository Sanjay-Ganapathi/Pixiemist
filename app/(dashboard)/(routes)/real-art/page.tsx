"use client";

import axios from "axios";
import toast from "react-hot-toast";
import { useRef, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { z } from "zod";

import { Heading } from "@/components/heading";
import { HeadingShell } from "@/components/shell";
import { Loader } from "@/components/loaders";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { formSchema } from "./constants";
import { Button } from "@/components/ui/button";
import { Dropzone } from "@/components/dropzone";
import { PageCard } from "@/components/page-card";
import { FileWithPreview } from "@/types";
import { sleep } from "@/lib/utils";
import { usePromodal } from "@/store/promodal-store";
import { Input } from "@/components/ui/input";

type Input = z.infer<typeof formSchema>;

const RealArtPage = () => {
  const [file, setFile] = useState<FileWithPreview[]>([]);
  const [outputImg, setOutputImg] = useState<string>();

  const proModal = usePromodal();
  const router = useRouter();
  const bottomOfPanelRef = useRef<HTMLDivElement>(null);

  const form = useForm<Input>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  useEffect(() => {
    if (bottomOfPanelRef.current) {
      bottomOfPanelRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [outputImg]);

  const onSubmit = async (data: Input) => {
    console.log("Submitted");
    console.log(data);
    try {
      if (
        !data?.image ||
        !Array.isArray(data.image) ||
        data.image.length <= 0
      ) {
        return toast.error("No Image is Selected");
      }

      setOutputImg("");
      const formData = new FormData();
      formData.append("image", data.image[0]);
      formData.append("prompt", data.prompt);

      let response = await axios.post("/api/real-art", formData);

      let { generation_id, status } = response.data;
      console.log(generation_id, status);

      while (status !== "succeeded" && status !== "failed") {
        await sleep(1000);
        response = await axios.get("api/real-art/" + generation_id);
        status = response.data.status;
        console.log(status);
      }

      if (status === "failed") {
        return toast.error("Server Error.Please try after some time");
      }

      setOutputImg(response.data.outputURL);

      form.reset();
    } catch (err: any) {
      console.log("[CLIENT_ERROR_REAL_ART]");
      if (err?.response?.status === 403) {
        proModal.onOpen();
      } else toast.error("Internal Server Error.");
    } finally {
      router.refresh();
    }
  };

  return (
    <>
      <HeadingShell>
        <Heading
          heading="Artistic Realism"
          subHeading="Bringing Your Art to Life: Realistic Image Generation from Portrait"
        />
      </HeadingShell>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="mx-6">
          <FormItem>
            <FormControl>
              <Dropzone
                name="image"
                maxSize={5 * 1024 * 1024}
                file={file}
                setFile={setFile}
                setValue={form.setValue}
                disabled={isLoading}
                className="mt-10 rounded-md border-2 border-dashed border-primary p-16"
              />
            </FormControl>
          </FormItem>

          <div className="mt-2 grid grid-cols-12 gap-2 ">
            <FormField
              control={form.control}
              name="prompt"
              render={({ field }) => (
                <FormItem className="col-span-12 md:col-span-9">
                  <FormControl className="m-0 p-0">
                    <Input
                      className="rounded-md border-2 border-primary px-2 focus-visible:ring-0 focus-visible:ring-transparent "
                      disabled={isLoading}
                      placeholder="Describe your painting in detail"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <Button
              variant="outline"
              type="submit"
              disabled={isLoading}
              className="col-span-12 border-2 border-primary text-[12px] font-bold uppercase tracking-wider transition-colors hover:bg-primary hover:text-white md:col-span-3 "
            >
              Submit
            </Button>
          </div>
        </form>
      </Form>
      <div className="mt-10 grid grid-cols-1 justify-items-center gap-8 py-4 md:grid-cols-2   ">
        {/* Preview */}
        {file[0]?.preview && (
          <PageCard
            src={file[0].preview}
            alt={file[0].name}
            closeBtn={true}
            // onLoad={() => URL.revokeObjectURL(file[0]?.preview)}
            onClick={() => setFile([])}
          />
        )}
        {isLoading ? (
          <Loader className="h-96 md:h-full" />
        ) : (
          outputImg && (
            <PageCard src={outputImg} alt="Output Image" downloadBtn={true} />
          )
        )}
        <div ref={bottomOfPanelRef}></div>
      </div>
    </>
  );
};

export default RealArtPage;
