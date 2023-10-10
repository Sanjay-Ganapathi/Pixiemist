"use client";

import { MAX_FREE_COUNT } from "@/constants";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { usePromodal } from "@/store/promodal-store";
import { Button } from "@/components/ui/button";

interface FreeCounterProps {
  creationCount: number;
  isPro: boolean;
}

export const FreeCounter = ({ creationCount, isPro }: FreeCounterProps) => {
  const [mounted, setMounted] = useState(false);
  const proModal = usePromodal();
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return isPro ? (
    <></>
  ) : (
    <div className=" px-8 py-4 md:px-4">
      <Card className=" border-none bg-slate-900 shadow-lg shadow-primary">
        <CardHeader>
          <CardTitle className="text-md text-center font-semibold text-white ">
            {creationCount}/{MAX_FREE_COUNT} Free Creations
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <Progress
            className="h-3 outline-none"
            value={Math.min((creationCount / MAX_FREE_COUNT) * 100, 100)}
          />
          <Button
            onClick={() => proModal.onOpen()}
            className="mt-2 w-full rounded-md border-2 border-primary text-[12px] font-bold uppercase tracking-wider transition-colors hover:bg-primary hover:text-white"
            variant="outline"
          >
            Upgrade
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
