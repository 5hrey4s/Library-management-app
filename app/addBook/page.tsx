"use client";

import React, { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { addBook } from "@/lib/data";
import { IBook, IBookBase } from "@/Models/book-model";
import { useToast } from "@/hooks/use-toast";
import { uploadImage } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FaUpload } from "react-icons/fa";

interface FormErrors {
  title?: string;
  author?: string;
  publisher?: string;
  genre?: string;
  isbnNo?: string;
  numOfPages?: string;
  totalNumOfCopies?: string;
  global?: string;
}

const AddBook: React.FC = () => {
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const router = useRouter();
  const { toast } = useToast();
  const [imageURL, setImageURL] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      const result = await uploadImage(file);
      setIsUploading(false);
      
      if (result.imageURL) {
        setImageURL(result.imageURL);
        toast({
          title: "Image uploaded successfully",
          description: "The book cover has been uploaded.",
          variant: "default",
        });
      } else if (result.error) {
        toast({
          title: "Error uploading image",
          description: result.error,
          variant: "destructive",
        });
      }
    }
  };

  const validateForm = (formData: FormData): FormErrors => {
    const newErrors: FormErrors = {};
    const fields = [
      "title",
      "author",
      "publisher",
      "genre",
      "isbnNo",
      "numOfPages",
      "totalNumOfCopies",
    ];

    fields.forEach((field) => {
      const value = formData.get(field) as string;
      if (!value) {
        newErrors[field as keyof FormErrors] = `${
          field.charAt(0).toUpperCase() + field.slice(1)
        } is required`;
      } else if (
        (field === "numOfPages" || field === "totalNumOfCopies") &&
        isNaN(Number(value))
      ) {
        newErrors[field as keyof FormErrors] = `${
          field.charAt(0).toUpperCase() + field.slice(1)
        } must be a number`;
      }
    });

    return newErrors;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const formErrors = validateForm(formData);
    if (Object.keys(formErrors).length === 0) {
      const data: IBookBase = {
        title: formData.get("title") as string,
        author: formData.get("author") as string,
        publisher: formData.get("publisher") as string,
        genre: formData.get("genre") as string,
        isbnNo: formData.get("isbnNo") as string,
        numOfPages: Number(formData.get("numOfPages")),
        totalNumOfCopies: Number(formData.get("totalNumOfCopies")),
        image_url: imageURL,
      };

      setIsSubmitting(true);
      try {
        const book: IBook | null = await addBook(data);
        toast({
          title: "Book added successfully",
          description: "The new book has been added to the library.",
          variant: "default",
        });
        router.replace("/home/books");
      } catch (error) {
        console.error(error);
        toast({
          title: "Error adding book",
          description:
            "An error occurred while adding the book. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsSubmitting(false);
      }
    } else {
      setErrors(formErrors);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#F0FDF4]">
      <Card className="w-full max-w-lg shadow-xl bg-[#F5F5F7]">
        <CardHeader>
          <CardTitle className="text-3xl font-semibold text-center ">
            Add a New Book
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6 ">
            {[
              "title",
              "author",
              "publisher",
              "genre",
              "isbnNo",
              "numOfPages",
              "totalNumOfCopies",
            ].map((field) => (
              <div key={field} className="space-y-2">
                <Label
                  htmlFor={field}
                  className="text-sm font-medium text-gray-700"
                >
                  {field.charAt(0).toUpperCase() +
                    field
                      .slice(1)
                      .replace(/([A-Z])/g, " $1")
                      .trim()}
                </Label>
                <Input
                  type={
                    field === "numOfPages" || field === "totalNumOfCopies"
                      ? "number"
                      : "text"
                  }
                  name={field}
                  id={field}
                  className="w-full"
                  placeholder={`Enter the ${field
                    .replace(/([A-Z])/g, " $1")
                    .toLowerCase()}`}
                />
                {errors[field as keyof FormErrors] && (
                  <p className="text-red-600 text-sm">
                    {errors[field as keyof FormErrors]}
                  </p>
                )}
              </div>
            ))}

            <div className="space-y-2">
              <Label
                htmlFor="image"
                className="text-sm font-medium text-gray-700"
              >
                Book Cover Image
              </Label>
              <div className="flex items-center space-x-2">
                <Input
                  id="image"
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById("image")?.click()}
                  className="w-full"
                >
                  <FaUpload className="mr-2" />
                  {imageURL ? "Change Image" : "Upload Image"}
                </Button>
                {imageURL && (
                  <img
                    src={imageURL}
                    alt="Book cover"
                    className="w-16 h-16 object-cover rounded"
                  />
                )}
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Adding Book..." : "Add Book"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddBook;
