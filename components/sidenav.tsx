import React from "react";
import { Separator } from "@/components/ui/separator";
import { LucideIcon } from "lucide-react";
import LogoutButton from "./handlelogout";
import NavLinks from "./navlinks";

// Define the shape of the navigation items
interface NavItem {
  icon: LucideIcon;
  label: string;
  href: string;
}

interface SideNavProps {    
  items: NavItem[]; // Array of navigation items
  activeItem: string; // Current active tab
  title?: string; // Optional title for the sidebar
  className?: string; // Optional CSS class
  footerContent?: React.ReactNode; // Optional footer content
}

export function SideNav({
  items,
  activeItem,
  title = "Dashboard",
  className,
  footerContent,
}: SideNavProps) {

  return (
    <aside className={`w-64 bg-white shadow-md ${className}`}>
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-4 text-[#2f8d46]">{title}</h2>
        <nav>
          <ul className="space-y-2">
            {/* Pass the items array to the NavLinks component */}
            <NavLinks/>
          </ul>
        </nav>
      </div>
      <Separator className="bg-[#e0e0e0]" />
      <div className="p-4">
        {footerContent ? footerContent : <LogoutButton />}
      </div>
    </aside>
  );
}
