"use client";

import axios from "axios";
import Image from "next/image";
import { useState } from "react";

import { usePromodal } from "@/store/promodal-store";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import toast from "react-hot-toast";
import { useTheme } from "next-themes";

export const ProModal = () => {
  const proModal = usePromodal();
  const [loading, setLoading] = useState(false);

  const { resolvedTheme } = useTheme();

  const onSubscribe = async () => {
    try {
      setLoading(true);

      const response = await axios.get("/api/stripe");
      window.location.href = response.data.url;
    } catch (err) {
      toast.error("Pro Subscription Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Dialog open={proModal.isOpen} onOpenChange={proModal.onClose}>
        <DialogContent className="w-full rounded-md bg-white/50 backdrop-blur transition-opacity dark:bg-slate-900/50 md:bg-white/30">
          <h1 className="mb-4 text-center text-2xl font-bold">
            Upgrade to PRO
          </h1>
          {resolvedTheme === "dark" ? (
            <Image
              src="/pro-dark.png"
              alt="pro"
              width={300}
              height={300}
              className="m-auto"
            />
          ) : (
            <Image
              src="/pro.png"
              alt="pro"
              width={200}
              height={200}
              className="m-auto"
            />
          )}
          <p className="mb-4 text-center text-gray-600 dark:text-white">
            Enjoy unlimited creations and unlock the full potential!
          </p>
          <Button onClick={onSubscribe} disabled={loading}>
            Subscribe
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
};
