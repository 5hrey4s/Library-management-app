"use client";

import { authenticateLogout } from "@/lib/actions";
import { LogOut } from "lucide-react";
import { useActionState } from "react";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl"; // Import the useTranslations hook

interface LogoutButtonProps {
  className?: string;
}

export default function LogoutButton({ className }: LogoutButtonProps) {
  const t = useTranslations("navbar.profileDropdown"); // Fetch translations from profileDropdown section
  const [errorMessage, formAction, isPending] = useActionState(
    authenticateLogout,
    undefined
  );

  return (
    <form action={formAction}>
      <button
        type="submit"
        className={cn(
          "flex items-center w-full text-left cursor-pointer px-2",
          className
        )}
        disabled={isPending}
      >
        <LogOut className="mr-2 h-4 w-4" />
        {/* Fetch translated text depending on logout state */}
        <span>{isPending ? t("loggingOut") : t("logout")}</span>
      </button>
    </form>
  );
}
