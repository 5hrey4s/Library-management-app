"use client";

import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import Profile from "@/components/profile";

export default function DropdownMenuItemWrapper() {
  const handleSelect = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    console.log("Profile selected");
  };

  return (
    <DropdownMenuItem onClick={handleSelect}>
      <Profile />
    </DropdownMenuItem>
  );
}
