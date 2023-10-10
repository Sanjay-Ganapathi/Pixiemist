"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "@prisma/client";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { cn } from "@/lib/utils";
import { userSettingSchema } from "@/lib/validations/user";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import toast from "react-hot-toast";
import { Button } from "./ui/button";
import { Loader } from "lucide-react";
import axios from "axios";

interface UserSettingsFormProps extends React.HTMLAttributes<HTMLFormElement> {
  user: Pick<User, "id" | "name">;
}

type Input = z.infer<typeof userSettingSchema>;

export function UserSettingsForm({
  user,
  className,
  ...props
}: UserSettingsFormProps) {
  const router = useRouter();

  const form = useForm<Input>({
    resolver: zodResolver(userSettingSchema),
    defaultValues: {
      username: "",
    },
  });

  const { isSubmitting, errors } = form.formState;

  const onSubmit = async (data: Input) => {
    try {
      const dataToSend = {
        username: data.username,
      };
      const resp = await axios.patch(`/api/user/${user.id}`, dataToSend);
      console.log(resp);
      form.reset();
    } catch (error) {
      console.log("[Settings_FRONT_END_ERR]", error);
      return toast.error("Something went wrong.Please try again later");
    } finally {
      toast.success("Profile Updated Successfully");

      router.refresh();
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn("mx-6", className)}
        {...props}
      >
        <Card className="border-2 border-primary">
          <CardHeader>
            <CardTitle>Profile </CardTitle>
            <CardDescription>
              Configure your profile information.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-1">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="John Doe"
                        className="w-[400px]"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              {errors?.username && (
                <p className="px-1 text-xs text-red-600">
                  {errors.username.message}
                </p>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col items-start space-y-2 md:flex-row md:justify-between md:space-x-0">
            <Button
              disabled={isSubmitting}
              variant="outline"
              type="submit"
              className="border-primary font-bold tracking-wider transition-colors hover:bg-primary hover:text-white"
            >
              {isSubmitting && <Loader className="mr-2 h-4 w-4 animate-spin" />}
              Submit
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
