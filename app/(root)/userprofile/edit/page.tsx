"use client";

import { createOrGetUser } from "@/actions/user";
import AddImage from "@/components/Forms/AddImage";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { imageToBase64 } from "@/lib/utils";
import { editUserValidation } from "@/lib/validation";
import { SafeUser } from "@/types";
import { useAuth } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";

import { ChangeEvent, use, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const page = () => {
  const { userId } = useAuth();

  const [existingUser, setExistingUser] = useState<SafeUser | null>(null);

  const [backgroundImg, setBackgroundImg] = useState("");
  const [userAvatar, setUserAvatar] = useState("");

  const form = useForm<z.infer<typeof editUserValidation>>({
    // resolver: zodResolver(editUserValidation),
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
        backgroundImg: user.backgroundImage,
      });
    };

    getUser();
  }, [userId]);

  const onSubmit = (values: z.infer<typeof editUserValidation>) => {
    console.log(values);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col items-center mt-10 md:w-[700px] mx-auto"
      >
        <AddImage
          defaultImage="/assets/1616872522462.jpg"
          image={form.getValues("backgroundImg")}
          styles="backgroundImg"
          imageId="backgroundImg"
          setValue={form.setValue}
        />

        <AddImage
          defaultImage="/assets/default-avatar.png"
          image={form.getValues("avatar")}
          styles="avatar"
          imageId="avatar"
          setValue={form.setValue}
        />

        <Button type="submit">Subtmi</Button>
      </form>
    </Form>
  );
};

export default page;
