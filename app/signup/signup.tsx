"use client";
import { createMember } from "@/lib/data";
import React, { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import bcrypt from "bcryptjs";
import { Input } from "@/components/ui/input";

interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  password?: string;
  global?: string;
}

const Register: React.FC = () => {
  const [errors, setErrors] = useState<FormErrors>({});
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const router = useRouter(); // Initialize the useRouter hook

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
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email is invalid";
    }

    if (!phoneNumber) {
      newErrors.phoneNumber = "Phone number is required";
    } else if (!/^\d{10}$/.test(phoneNumber)) {
      newErrors.phoneNumber = "Phone number must be 10 digits";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long";
    }

    return newErrors;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const password = formData.get("password") as string; 
    const hashedPwd = await bcrypt.hash(password, 10);

    const formErrors = validateForm(formData);
    if (Object.keys(formErrors).length === 0) {
      const data = {
        firstName: formData.get("firstName") as string,
        lastName: formData.get("lastName") as string,
        email: formData.get("email") as string,
        phoneNumber: formData.get("phoneNumber") as string,
        password: hashedPwd,
        refreshToken: null,
        role: "user",
        accessToken: null,
        user_id: "",
      };

      setIsSubmitting(true);
      try {
        const member = await createMember(data);
        setSuccessMessage("Registration successful!");
        console.log(member);
        router.push("signup/success"); // Redirect to the success page
      } catch (error) {
        console.error(error);
        setErrors({ global: "An error occurred during registration." });
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
          Create Your Library Account
        </h2>
        {errors.global && (
          <p className="text-red-600 text-center mb-4">{errors.global}</p>
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
              className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none "
              placeholder="Enter your first name"
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
              placeholder="Enter your last name"
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
              placeholder="Enter your email"
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
              placeholder="Enter your phone number"
            />
            {errors.phoneNumber && (
              <p className="text-red-600 text-sm mt-1">{errors.phoneNumber}</p>
            )}
          </div>

          <div>
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
              placeholder="Enter your password"
            />
            {errors.password && (
              <p className="text-red-600 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-[#357960] text-white py-2 px-4 rounded-md"
            disabled={isSubmitting}
            style={{ marginTop: "30px" }}
          >
            {isSubmitting ? "Registering..." : "Register"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
