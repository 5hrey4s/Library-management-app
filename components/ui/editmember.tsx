"use client";
import React, { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { updateMember } from "@/lib/data"; // Assume updateMember is a function that updates member data
import { IMember } from "@/Models/member.model";

export interface IMemberBase {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
  refreshToken: string | null;
  accessToken: string | null;
  user_id: string;
  role: string;
}

interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  password?: string;
  global?: string;
}

interface EditMemberProps {
  member: IMember;
}

export const EditMember: React.FC<EditMemberProps> = ({ member }) => {
  const [errors, setErrors] = useState<FormErrors>({});
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const router = useRouter();

  const validateForm = (formData: FormData): FormErrors => {
    const newErrors: FormErrors = {};
    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;
    const email = formData.get("email") as string;
    const phoneNumber = formData.get("phoneNumber") as string;
    const password = formData.get("password") as string;

    if (!firstName) {
      newErrors.firstName = "First name is required";
    }

    if (!lastName) {
      newErrors.lastName = "Last name is required";
    }

    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(email)) {
      newErrors.email = "Invalid email format";
    }

    if (!phoneNumber) {
      newErrors.phoneNumber = "Phone number is required";
    }

    return newErrors;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    console.log("submitted");
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const formErrors = validateForm(formData);
    console.log(formErrors);
    if (Object.keys(formErrors).length === 0) {
      const data: IMemberBase = {
        firstName: formData.get("firstName") as string,
        lastName: formData.get("lastName") as string,
        email: formData.get("email") as string,
        phoneNumber: formData.get("phoneNumber") as string,
        password: formData.get("password") as string,
        refreshToken: member.refreshToken,
        accessToken: member.accessToken,
        user_id: member.user_id,
        role: member.role,
      };
      console.log(formData);
      setIsSubmitting(true);
      try {
        const updatedMember: IMember | null = await updateMember(
          Number(member.user_id),
          data
        );
        setSuccessMessage("Member updated successfully!");
        router.push("/home/books"); // Redirect to the members page
      } catch (error) {
        console.error(error);
        setErrors({ global: "An error occurred while updating the member." });
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
          Edit Member Details
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
              htmlFor="firstName"
              className="block text-sm font-medium text-gray-700"
            >
              First Name
            </label>
            <Input
              type="text"
              name="firstName"
              id="firstName"
              className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none"
              placeholder="Enter first name"
              defaultValue={member.firstName}
            />
            {errors.firstName && (
              <p className="text-red-600 text-sm mt-1">{errors.firstName}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="lastName"
              className="block text-sm font-medium text-gray-700"
            >
              Last Name
            </label>
            <Input
              type="text"
              name="lastName"
              id="lastName"
              className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none"
              placeholder="Enter last name"
              defaultValue={member.lastName}
            />
            {errors.lastName && (
              <p className="text-red-600 text-sm mt-1">{errors.lastName}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <Input
              type="email"
              name="email"
              id="email"
              className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none"
              placeholder="Enter email address"
              defaultValue={member.email}
            />
            {errors.email && (
              <p className="text-red-600 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="phoneNumber"
              className="block text-sm font-medium text-gray-700"
            >
              Phone Number
            </label>
            <Input
              type="text"
              name="phoneNumber"
              id="phoneNumber"
              className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none"
              placeholder="Enter phone number"
              defaultValue={member.phoneNumber}
            />
            {errors.phoneNumber && (
              <p className="text-red-600 text-sm mt-1">{errors.phoneNumber}</p>
            )}
          </div>

          {/* <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <Input
              type="password"
              name="password"
              id="password"
              className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none"
              placeholder="Enter password"
              defaultValue={member.password}
            />
            {errors.password && (
              <p className="text-red-600 text-sm mt-1">{errors.password}</p>
            )}
          </div> */}

          <button
            type="submit"
            className="w-full bg-[#357960] text-white py-2 px-4 rounded-md"
            disabled={isSubmitting}
            style={{ marginTop: "30px" }}
          >
            {isSubmitting ? "Updating Member..." : "Update Member"}
          </button>
        </form>
      </div>
    </div>
  );
};
