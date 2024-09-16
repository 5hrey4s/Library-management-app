"use client";
import { Plus } from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface RequestsProps {
  isActive?: boolean; // Define the isActive prop with an optional type
}

export default function Requests({ isActive = false }: RequestsProps) {
  return (
    <Link href="/admin/requests">
      <Button
        className={cn(
          "flex items-center gap-1 font-bold tracking-widest bg-inherit hover:bg-inherit",
          isActive ? "text-[#2F8D46]" : "text-black",
          "hover:text-[#2F8D46]"
        )}
      >
        REQUESTS
      </Button>
    </Link>
  );
}
