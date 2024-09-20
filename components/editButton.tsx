"use client";
import { Edit, Plus } from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface EditMemberButtonProps {
  id?: number; // Define the isActive prop with an optional type
}

export default function EditMemberButton({ id }: EditMemberButtonProps) {
  return (
    <Link href={`/admin/members/${id}/edit`}>
      <Button variant="ghost" size="sm" type="submit">
        <Edit className="h-4 w-4 mr-2" />
        Edit
      </Button>
    </Link>
  );
}
