"use client";
import React, { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { addBook } from "@/lib/data";
import { IBook, IBookBase } from "@/Models/book-model";

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
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const router = useRouter();

  const validateForm = (formData: FormData): FormErrors => {
    const newErrors: FormErrors = {};
    const title = formData.get("title") as string;
    const author = formData.get("author") as string;
    const publisher = formData.get("publisher") as string;
    const genre = formData.get("genre") as string;
    const isbnNo = formData.get("isbnNo") as string;
    const numOfPages = formData.get("numOfPages") as string;
    const totalNumOfCopies = formData.get("totalNumOfCopies") as string;

    if (!title) {
      newErrors.title = "Title is required";
    }

    if (!author) {
      newErrors.author = "Author is required";
    }

    if (!publisher) {
      newErrors.publisher = "Publisher is required";
    }

    if (!genre) {
      newErrors.genre = "Genre is required";
    }

    if (!isbnNo) {
      newErrors.isbnNo = "ISBN Number is required";
    }

    if (!numOfPages) {
      newErrors.numOfPages = "Number of pages is required";
    } else if (isNaN(Number(numOfPages))) {
      newErrors.numOfPages = "Number of pages must be a number";
    }

    if (!totalNumOfCopies) {
      newErrors.totalNumOfCopies = "Total number of copies is required";
    } else if (isNaN(Number(totalNumOfCopies))) {
      newErrors.totalNumOfCopies = "Total number of copies must be a number";
    }
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
      };

      setIsSubmitting(true);
      try {
        const book: IBook | null = await addBook(data);
        console.log("Book data:", book);
        // setSuccessMessage("Book added successfully!");
        router.push("/home/books"); // Redirect to the books page
      } catch (error) {
        console.error(error);
        setErrors({ global: "An error occurred while adding the book." });
      } finally {
        setIsSubmitting(false);
      }
    } else {
      setErrors(formErrors);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-libraryBackground bg-cover bg-center">
      <div className="w-full max-w-md p-8 bg-[#F5F5F7] shadow-xl rounded-lg border border-gray-200">
        <h2 className="text-3xl font-semibold text-gray-800 text-center mb-6">
          Add a New Book
        </h2>
        {errors.global && (
          <p className="text-red-600 text-center mb-4">{errors.global}</p>
        )}
        {successMessage && (
          <p className="text-green-600 text-center mb-4">{successMessage}</p>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700"
            >
              Title
            </label>
            <Input
              type="text"
              name="title"
              id="title"
              className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none"
              placeholder="Enter the book title"
            />
            {errors.title && (
              <p className="text-red-600 text-sm mt-1">{errors.title}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="author"
              className="block text-sm font-medium text-gray-700"
            >
              Author
            </label>
            <Input
              type="text"
              name="author"
              id="author"
              className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none"
              placeholder="Enter the author's name"
            />
            {errors.author && (
              <p className="text-red-600 text-sm mt-1">{errors.author}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="publisher"
              className="block text-sm font-medium text-gray-700"
            >
              Publisher
            </label>
            <Input
              type="text"
              name="publisher"
              id="publisher"
              className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none"
              placeholder="Enter the publisher's name"
            />
            {errors.publisher && (
              <p className="text-red-600 text-sm mt-1">{errors.publisher}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="genre"
              className="block text-sm font-medium text-gray-700"
            >
              Genre
            </label>
            <Input
              type="text"
              name="genre"
              id="genre"
              className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none"
              placeholder="Enter the genre"
            />
            {errors.genre && (
              <p className="text-red-600 text-sm mt-1">{errors.genre}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="isbnNo"
              className="block text-sm font-medium text-gray-700"
            >
              ISBN Number
            </label>
            <Input
              type="text"
              name="isbnNo"
              id="isbnNo"
              className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none"
              placeholder="Enter the ISBN number"
            />
            {errors.isbnNo && (
              <p className="text-red-600 text-sm mt-1">{errors.isbnNo}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="numOfPages"
              className="block text-sm font-medium text-gray-700"
            >
              Number of Pages
            </label>
            <Input
              type="number"
              name="numOfPages"
              id="numOfPages"
              className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none"
              placeholder="Enter the number of pages"
            />
            {errors.numOfPages && (
              <p className="text-red-600 text-sm mt-1">{errors.numOfPages}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="totalNumOfCopies"
              className="block text-sm font-medium text-gray-700"
            >
              Total Number of Copies
            </label>
            <Input
              type="number"
              name="totalNumOfCopies"
              id="totalNumOfCopies"
              className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none"
              placeholder="Enter the total number of copies"
            />
            {errors.totalNumOfCopies && (
              <p className="text-red-600 text-sm mt-1">
                {errors.totalNumOfCopies}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-[#357960] text-white py-2 px-4 rounded-md"
            disabled={isSubmitting}
            style={{ marginTop: "30px" }}
          >
            {isSubmitting ? "Adding Book..." : "Add Book"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddBook;
