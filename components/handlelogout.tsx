"use client";

import { authenticateLogout } from "@/lib/actions";
import { LogOut } from "lucide-react";
import { useActionState } from "react";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface LogoutButtonProps {
  className?: string;
}

export default function LogoutButton({ className }: LogoutButtonProps) {
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
        <span>{isPending ? "Logging out..." : "Log out"}</span>
      </button>
    </form>
  );
}
