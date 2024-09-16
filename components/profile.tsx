"use client"

import Link from "next/link";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { User } from "lucide-react";

export default function Profile() {
  return (
    <DropdownMenuItem asChild>
      <Link href="/profile" className="cursor-pointer">
        <User className="mr-2 h-4 w-4" />
        <span>Profile</span>
      </Link>
    </DropdownMenuItem>
  );
}