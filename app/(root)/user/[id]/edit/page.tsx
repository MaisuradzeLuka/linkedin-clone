"use client";

import { createOrGetUser } from "@/actions/user";
import AddImage from "@/components/Forms/AddImage";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { imageToBase64 } from "@/lib/utils";
import { editUserValidation } from "@/lib/validation";
import { SafeUser } from "@/types";
import { useAuth } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { redirect } from "next/navigation";

import { ChangeEvent, use, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const page = () => {
  const { userId } = useAuth();

  const [existingUser, setExistingUser] = useState<SafeUser | null>(null);

  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof editUserValidation>>({
    resolver: zodResolver(editUserValidation),
    defaultValues: {
      firstname: "",
      lastname: "",
      bio: "",
      avatar: "",
      backgroundImg: "",
    },
  });

  useEffect(() => {
    const getUser = async () => {
      const user: SafeUser = await createOrGetUser({
        get: { userId: userId || "" },
      });

      setExistingUser(user);

      form.reset({
        firstname: user.firstname!,
        lastname: user.lastname!,
        bio: user.bio || "",
        avatar: user.avatar,
        backgroundImg: user.backgroundImg,
      });
    };

    getUser();
  }, [userId]);

  const onSubmit = async (values: z.infer<typeof editUserValidation>) => {
    setIsLoading(true);
    const updatedUser = await createOrGetUser({
      update: {
        ...values,
        username: existingUser?.username || "",
        userId: userId || "",
      },
    });

    if (updatedUser.status === "SUCCESS") {
      redirect(`/user/${userId}`);
    } else {
      toast.error("Couldn't update user", {
        description: "Please try again later.",
        className: " !text-red-500",
        duration: 3000,
      });
    }

    setIsLoading(false);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col items-center gap-4 mt-10 md:w-[700px] mx-auto"
      >
        <AddImage
          defaultImage="/assets/1616872522462.jpg"
          image={form.watch("backgroundImg")}
          error={form.getFieldState("backgroundImg").error?.message}
          imageId="backgroundImg"
          setValue={form.setValue}
          setError={form.setError}
          clearErrors={form.clearErrors}
        />

        <AddImage
          defaultImage="/assets/default-avatar.jpg"
          image={form.watch("avatar")}
          error={form.getFieldState("avatar").error?.message}
          imageId="avatar"
          setValue={form.setValue}
          setError={form.setError}
          clearErrors={form.clearErrors}
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
          name="bio"
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

        <div className="flex items-center gap-4 self-end">
          <Link href={`/user/${userId}`} className="text-red-500 font-medium">
            Cancel
          </Link>
          <Button
            disabled={isLoading}
            type="submit"
            className="bg-blue-500 text-md font-medium text-white cursor-pointer"
          >
            {isLoading ? "Loading..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default page;
