"use client";

import React, { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IProfessorBase } from "@/Models/professor.model";
import { addProfessor } from "@/lib/actions";

interface FormErrors {
  name?: string;
  department?: string;
  bio?: string;
  calendlyLink?: string;
  email?: string;
  global?: string;
}

const AddProfessor: React.FC = () => {
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const router = useRouter();
  const { toast } = useToast();

  const validateForm = (formData: FormData): FormErrors => {
    const newErrors: FormErrors = {};
    const fields = ["name", "department", "bio", "calendlyLink", "email"];

    fields.forEach((field) => {
      const value = formData.get(field) as string;
      if (!value) {
        newErrors[field as keyof FormErrors] = `${
          field.charAt(0).toUpperCase() + field.slice(1)
        } is required`;
      } else if (
        field === "email" &&
        !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value)
      ) {
        newErrors[field as keyof FormErrors] = "Invalid email format";
      }
    });

    return newErrors;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const formErrors = validateForm(formData);
    if (Object.keys(formErrors).length === 0) {
      const data: IProfessorBase = {
        name: formData.get("name") as string,
        department: formData.get("department") as string,
        bio: formData.get("bio") as string,
        calendlyLink: formData.get("calendlyLink") as string,
        email: formData.get("email") as string,
        googleMeetEnabled:
          (formData.get("googleMeetEnabled") as string) || "true", // Default to true
      };

      setIsSubmitting(true);
      try {
        await addProfessor(data);
        toast({
          title: "Professor added successfully",
          description: "The new professor has been added.",
          variant: "default",
        });
        router.replace("/home/professors");
      } catch (error: any) {
        console.error(error);
        setErrors({ global: error.message });
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
          <CardTitle className="text-3xl font-semibold text-center">
            Add a New Professor
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {[
              { field: "name", label: "Full Name" },
              { field: "department", label: "Department" },
              { field: "bio", label: "Biography" },
              { field: "calendlyLink", label: "Calendly Link" },
              { field: "email", label: "Email" },
            ].map(({ field, label }) => (
              <div key={field} className="space-y-2">
                <Label
                  htmlFor={field}
                  className="text-sm font-medium text-gray-700"
                >
                  {label}
                </Label>
                <Input
                  type="text"
                  name={field}
                  id={field}
                  className="w-full"
                  placeholder={`Enter the ${label.toLowerCase()}`}
                />
                {errors[field as keyof FormErrors] && (
                  <p className="text-red-600 text-sm">
                    {errors[field as keyof FormErrors]}
                  </p>
                )}
              </div>
            ))}

            <Button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Adding Professor..." : "Add Professor"}
            </Button>

            {errors.global && <p className="text-red-600">{errors.global}</p>}
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddProfessor;
