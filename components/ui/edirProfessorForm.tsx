"use client";

import React, { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IProfessor, IProfessorBase } from "@/Models/professor.model";
import { updateProfessor } from "@/lib/actions";

interface FormErrors {
  name?: string;
  department?: string;
  bio?: string;
  calendlyLink?: string;
  email?: string;
  googleMeetEnabled?: string;
  global?: string;
}

interface EditProfessorProps {
  professor: IProfessor;
}

export const EditProfessor: React.FC<EditProfessorProps> = ({ professor }) => {
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
      } else if (field === "email" && !/\S+@\S+\.\S+/.test(value)) {
        newErrors[field as keyof FormErrors] = "Invalid email address";
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
        googleMeetEnabled: formData.get("googleMeetEnabled") as string, // Optional
      };

      setIsSubmitting(true);
      try {
        await updateProfessor(professor.id, data); // Assume this is the update function
        toast({
          title: "Professor updated successfully",
          description: "The professor's details have been updated.",
          variant: "default",
        });
        router.replace("/admin/professors"); // Redirect to professor list
      } catch (error) {
        console.error(error);
        toast({
          title: "Error updating professor",
          description:
            "An error occurred while updating the professor. Please try again.",
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
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-50 to-blue-100 p-4">
      <Card className="w-full max-w-lg shadow-xl">
        <CardHeader>
          <CardTitle className="text-3xl font-semibold text-center">
            Edit Professor Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {["name", "department", "bio", "calendlyLink", "email"].map(
              (field) => (
                <div key={field} className="space-y-2">
                  <Label
                    htmlFor={field}
                    className="text-sm font-medium text-gray-700"
                  >
                    {field.charAt(0).toUpperCase() + field.slice(1)}
                  </Label>
                  <Input
                    type={field === "email" ? "email" : "text"}
                    name={field}
                    id={field}
                    className="w-full"
                    placeholder={`Enter the ${field}`}
                    defaultValue={
                      professor[field as keyof IProfessor] as string
                    }
                  />
                  {errors[field as keyof FormErrors] && (
                    <p className="text-red-600 text-sm">
                      {errors[field as keyof FormErrors]}
                    </p>
                  )}
                </div>
              )
            )}

            <div className="space-y-2">
              <Label
                htmlFor="googleMeetEnabled"
                className="text-sm font-medium text-gray-700"
              >
                Google Meet Enabled
              </Label>
              <select
                name="googleMeetEnabled"
                id="googleMeetEnabled"
                defaultValue={professor.googleMeetEnabled || "true"}
                className="w-full p-2 border rounded"
              >
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            </div>

            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Updating Professor..." : "Update Professor"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
