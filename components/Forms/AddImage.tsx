import { imageToBase64 } from "@/lib/utils";
import { Plus } from "lucide-react";
import { set } from "mongoose";
import React, { ChangeEvent, Dispatch, SetStateAction, useState } from "react";
import { FieldError, UseFormSetValue } from "react-hook-form";

type AddImageProps = {
  image: string;

  styles: "avatar" | "backgroundImg";
  imageId: "avatar" | "backgroundImg";
  defaultImage: string;
  setValue: UseFormSetValue<{
    firstname: string;
    lastname: string;
    avatar: string;
    backgroundImg: string;
    bio?: string | undefined;
  }>;
};

const AddImage = ({
  image,

  styles,
  imageId,
  setValue,
  defaultImage,
}: AddImageProps) => {
  const [backgroundImgError, setBackgroundImgError] = useState("");

  const handleBgImg = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.currentTarget.files?.[0];

    const image2 = await imageToBase64(file);

    if (image2.status === "ERROR") {
      setBackgroundImgError(image2.body);
      return;
    } else {
      //   setImage(image.body);
      setValue(imageId, image2.body);
      if (backgroundImgError) setBackgroundImgError("");
    }
  };

  return (
    <label
      htmlFor={imageId}
      className={`${styles} flex justify-center items-center relative group`}
    >
      <img
        src={image || defaultImage}
        alt="user background"
        className="w-full object-cover "
      />

      <div className="image-hover">
        <button className="text-white hover:text-green-400 transition cursor-pointer">
          <Plus className="w-4 h-4" />
        </button>
      </div>

      <input
        type="file"
        accept="image/*"
        id={imageId}
        className="hidden"
        onChange={(e) => handleBgImg(e)}
      />
    </label>
  );
};

export default AddImage;
