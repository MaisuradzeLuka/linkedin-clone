"use client";

import { userValidation } from "@/lib/validation";
import { useUser } from "@clerk/nextjs";

import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { useEffect, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { createOrGetUser } from "@/actions/user";
import { redirect } from "next/navigation";

const Onboarding = () => {
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof userValidation>>({
    resolver: zodResolver(userValidation),
    defaultValues: {
      firstname: user?.firstName || "",
      lastname: user?.lastName || "",
      username: "",
      bio: "",
    },
  });

  useEffect(() => {
    if (user) {
      form.reset({
        firstname: user.firstName || "",
        lastname: user.lastName || "",
      });
    }
  }, [user, form]);

  const onSubmit = async (data: z.infer<typeof userValidation>) => {
    setIsLoading(true);
    const res = await createOrGetUser({
      create: {
        firstname: data.firstname,
        lastname: data.lastname,
        username: data.username,
        bio: data.bio,
        avatar: user?.imageUrl || "",
        backgroundImg: "/assets/1616872522462.jpg",
        userId: user?.id!,
      },
    });

    if (res.message) {
      form.setError("username", { message: res.message });
    } else if (res) {
      redirect("/");
    }

    setIsLoading(false);
  };
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="min-w-[360px] w-full max-w-[500px] flex flex-col items-center gap-4 bg-white text-[#25252b] box-shadow rounded-xl py-8 px-10"
      >
        <h2 className="font-bold text-[16px] mb-6">
          Finish setting up you account
        </h2>

        <Image
          src={user?.imageUrl || ""}
          alt="user avatar"
          width={48}
          height={48}
          className="rounded-full"
        />

        <FormField
          name="firstname"
          control={form.control}
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Firstname</FormLabel>

              <FormControl>
                <Input className="w-full !ring-0 border-gray-300" {...field} />
              </FormControl>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />

        <FormField
          name="lastname"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Lastname</FormLabel>

              <FormControl>
                <Input className="w-full !ring-0 border-gray-300" {...field} />
              </FormControl>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />

        <FormField
          name="username"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Username</FormLabel>

              <FormControl>
                <Input className="w-full !ring-0 border-gray-300" {...field} />
              </FormControl>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />

        <FormField
          name="Bio"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Bio</FormLabel>

              <FormControl>
                <Textarea
                  className="w-full !ring-0 border-gray-300 resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full bg-[#3B3C45] text-white cursor-pointer"
          disabled={isLoading}
        >
          {isLoading ? "Loading..." : "Continue"}
        </Button>
      </form>
    </Form>
  );
};

export default Onboarding;
