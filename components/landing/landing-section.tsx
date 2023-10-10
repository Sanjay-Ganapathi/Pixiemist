import React from "react";
import { QRCodeLanding } from "./qrcode-landing";

export const LandingSection = () => {
  return (
    <main className="p-4 text-center text-slate-900">
      <div className="mt-28">
        <div className=" text-5xl font-semibold md:text-6xl lg:text-7xl">
          <span className="to-sky-blue-600 bg-gradient-to-b from-blue-700 to-sky-500   bg-clip-text  text-transparent">
            Power Up
          </span>{" "}
          With AI!
        </div>
        <p className="mt-4 text-sm lg:text-lg">
          Use AI to simplify your workflow. Save Time and Effort.
        </p>
      </div>
      <div className=" p-8 lg:mt-8 lg:p-16">
        <QRCodeLanding />
      </div>
    </main>
  );
};
