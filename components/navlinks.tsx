"use client";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, Activity, Heart } from "lucide-react";

export default function NavLinks() {
  const pathname = usePathname();
  const items = [
    { icon: User, label: "Profile", href: "/profile" },
    { icon: Activity, label: "Activity", href: "/profile/activity" },
    { icon: Heart, label: "Wishlist", href: "/profile/wishlist" },

  ];
  return (
    <>
      {items.map((item) => (
        <li key={item.href}>
          <Link
            href={item.href}
            className={cn(
              "flex items-center w-full px-4 py-2 text-left rounded-md transition-colors",
              pathname === item.href
                ? "bg-[#2f8d46] text-white"
                : "hover:bg-[#e8f5e9] text-[#333]"
            )}
          >
            <item.icon className="mr-2 h-5 w-5" />
            {item.label}
          </Link>
        </li>
      ))}
    </>
  );
}
