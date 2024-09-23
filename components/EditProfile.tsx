"use client";
import { useActionState, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Edit2 } from "lucide-react";
import { editProfile } from "@/lib/actions";
import { useToast } from "@/hooks/use-toast";
import { useTranslations } from "next-intl"; // Import useTranslations for translations

export default function EditProfile({ user }: { user: any }) {
  const t = useTranslations("EditProfile"); // Initialize translations for the EditProfile component
  const [errorMessage, formAction, isPending] = useActionState(
    editProfile,
    undefined
  );

  const [isOpen, setIsOpen] = useState(false); // Controls the Dialog open state
  const { toast } = useToast(); // For showing success/failure toasts

  // Form submission handler
  const handleFormAction = async (formData: FormData) => {
    const response = await formAction(formData);

    toast({
      title: t("updateSuccess"),
      description: t("profileUpdated"),
      variant: "default",
    });
    setIsOpen(false); // Close the dialog after a successful update
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="bg-[#2f8d46] text-white hover:bg-[#1b5e20]"
        >
          <Edit2 className="mr-2 h-4 w-4" /> {t("editProfile")}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-full sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("editProfile")}</DialogTitle>
          <DialogDescription>{t("editProfileDescription")}</DialogDescription>
        </DialogHeader>
        <form action={handleFormAction}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-4">
              <Label htmlFor="firstName" className="text-left sm:text-right">
                {t("firstName")}
              </Label>
              <Input
                id="firstName"
                name="firstName"
                defaultValue={user.firstName}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-4">
              <Label htmlFor="lastName" className="text-left sm:text-right">
                {t("lastName")}
              </Label>
              <Input
                id="lastName"
                name="lastName"
                defaultValue={user.lastName}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-left sm:text-right">
                {t("email")}
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                defaultValue={user.email}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-4">
              <Label htmlFor="phoneNumber" className="text-left sm:text-right">
                {t("phoneNumber")}
              </Label>
              <Input
                id="phoneNumber"
                name="phoneNumber"
                type="tel"
                defaultValue={user.phoneNumber}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="submit"
              className="bg-[#2f8d46] text-white hover:bg-[#1b5e20]"
              disabled={isPending}
            >
              {isPending ? t("saving") : t("saveChanges")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
