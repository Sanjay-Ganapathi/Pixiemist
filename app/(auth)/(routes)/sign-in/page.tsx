import { Metadata } from "next";
import Image from "next/image";

import { UserAuthForm } from "@/components/user-auth-form";

export const metadata: Metadata = {
  title: "Login",
  description: "Login to your account",
};

export default function RegisterPage() {
  return (
    <div className="container grid h-screen w-screen items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
        <div className="absolute inset-0 ">
          <Image
            src="/test.gif"
            width={500}
            height={500}
            alt="Landing"
            className="h-full w-auto object-cover"
          />
        </div>
        <div className="relative z-20 flex items-center text-2xl font-medium">
          <div className="relative mr-2 h-10 w-10">
            <Image fill alt="Logo" src="/logo3.png" />
          </div>
          Pixiemist
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg italic">
              &ldquo;These tools have saved me countless hours of work and
              helped me deliver stunning designs to my clients faster than ever
              before.&rdquo;
            </p>
            <footer className="text-sm">Muthuvel Pandian</footer>
          </blockquote>
        </div>
      </div>
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Welcome to Pixiemist
            </h1>
            <p className="text-sm">
              Enter your email below to sign in to your account
            </p>
          </div>
          <UserAuthForm />
        </div>
      </div>
    </div>
  );
}
