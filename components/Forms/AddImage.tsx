import { imageToBase64 } from "@/lib/utils";
import { Plus } from "lucide-react";
import React, { ChangeEvent } from "react";
import {
  UseFormClearErrors,
  UseFormSetError,
  UseFormSetValue,
} from "react-hook-form";

type AddImageProps = {
  image: string | undefined;
  imageId: "avatar" | "backgroundImg";
  error?: string;
  defaultImage: string;
  setValue: UseFormSetValue<{
    avatar: { string: string; blob: File };
    firstname: string;
    lastname: string;
    backgroundImg?: { string: string; blob: File } | undefined;
    bio?: string | undefined;
  }>;
  setError: UseFormSetError<{
    firstname: string;
    lastname: string;
    avatar: { string: string; blob: File };
    backgroundImg: string;
    bio?: string | undefined;
  }>;
  clearErrors: UseFormClearErrors<{
    avatar: { string: string; blob: File };
    backgroundImg: { string: string; blob: File } | undefined;
    firstname: string;
    lastname: string;
    bio?: string | undefined;
  }>;
};

const AddImage = ({
  image,
  defaultImage,
  imageId,
  error,
  setValue,
  setError,
  clearErrors,
}: AddImageProps) => {
  const handleBgImg = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.currentTarget.files?.[0];

    if (!file) {
      setError(imageId, { message: "No file selected" });
      return;
    }

    const strImage = await imageToBase64(file);

    if (strImage.status === "ERROR") {
      setError(imageId, { message: strImage.body });
      return;
    } else {
      setValue(imageId, { string: strImage.body, blob: file });
      if (error) clearErrors(imageId);
    }
  };

  return (
    <>
      <label
        htmlFor={imageId}
        className={`${imageId} flex justify-center items-center relative group`}
      >
        <img
          src={image || defaultImage}
          alt={`user ${imageId}`}
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

      {error && <p className="text-red-500">{error}</p>}
    </>
  );
};

export default AddImage;
