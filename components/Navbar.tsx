"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  BookOpen,
  ChevronDown,
  Menu,
  X,
  User,
  Settings,
  LogOut,
  Book,
  Users,
  FileText,
  Clock,
  Bell,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import LogoutButton from "@/components/handlelogout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface NavbarProps {
  logoText?: string;
  showAllBooks?: boolean;
  showMyBooks?: boolean;
  showMembers?: boolean;
  showTransactions?: boolean;
  showMyTransactions?: boolean;
  showRequests?: boolean;
  active?: string;
  role?: string;
  userAvatar?: string;
  userName?: string;
}

interface NavItemProps {
  /** The URL for the navigation item */
  href: string;
  
  /** The icon to display next to the navigation text */
  icon: React.ReactNode;
  
  /** The text label for the navigation item */
  text: string;
  
  /** Whether this item is the active (highlighted) one */
  isActive: boolean;
}


export default function Navbar({
  logoText = "Library",
  showAllBooks = true,
  showMyBooks = true,
  showMembers = true,
  showTransactions = true,
  showRequests = true,
  showMyTransactions = true,
  active,
  role,
  userAvatar,
  userName = "user",
}: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const NavItem = ({ href, icon, text, isActive }:NavItemProps) => (
    <Link
      href={href}
      className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors duration-200 ${
        isActive
          ? "bg-green-100 text-green-800"
          : "hover:bg-green-50 text-gray-700 hover:text-green-800"
      }`}
    >
      {icon}
      <span className="font-medium">{text}</span>
    </Link>
  );

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled ? "shadow-md bg-white" : "bg-green-50"
      }`}
    >
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link className="flex items-center space-x-2" href="/">
            <BookOpen className="h-8 w-8 text-green-600" />
            <span className="text-xl font-bold text-green-800 dark:text-gray-100">
              {logoText}
            </span>
          </Link>

          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center space-x-4">
            {showAllBooks && (
              <NavItem
                href="/home/books"
                icon={<Book className="h-5 w-5" />}
                text="Books"
                isActive={active === "Books"}
              />
            )}
            {showMyBooks && role === "user" && (
              <NavItem
                href="/home/books/mybooks"
                icon={<Book className="h-5 w-5" />}
                text="My Books"
                isActive={active === "MyBooks"}
              />
            )}
            {showMembers && role === "admin" && (
              <NavItem
                href="/admin/members"
                icon={<Users className="h-5 w-5" />}
                text="Members"
                isActive={active === "Members"}
              />
            )}
            {showTransactions && role === "admin" && (
              <NavItem
                href="/admin/transaction"
                icon={<FileText className="h-5 w-5" />}
                text="Transactions"
                isActive={active === "Transactions"}
              />
            )}
            {showMyTransactions && role === "user" && (
              <NavItem
                href="/home/mytransaction"
                icon={<Clock className="h-5 w-5" />}
                text="My Transactions"
                isActive={active === "MyTransactions"}
              />
            )}
            {showRequests && role === "admin" && (
              <NavItem
                href="/admin/requests"
                icon={<Bell className="h-5 w-5" />}
                text="Requests"
                isActive={active === "Requests"}
              />
            )}
          </nav>

          <div className="flex items-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center gap-2 text-gray-700 hover:text-green-800"
                >
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={userAvatar} alt={userName} />
                    <AvatarFallback>
                      {userName.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-medium hidden sm:inline">
                    {userName.charAt(0).toUpperCase() +
                      userName.slice(1).toLowerCase()}
                  </span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-56 bg-white border border-gray-200 rounded-md shadow-lg"
              >
                <DropdownMenuLabel className="px-4 py-3 text-sm font-semibold text-gray-700 border-b border-gray-200">
                  <div className="flex flex-col">
                    <span>
                      {userName.charAt(0).toUpperCase() +
                        userName.slice(1).toLowerCase()}
                    </span>
                    <span className="text-xs font-normal text-gray-500">
                      {role === "admin" ? "Administrator" : "User"}
                    </span>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuItem asChild>
                  <Link
                    href="/home/books"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-800"
                  >
                    <User className="mr-2 h-4 w-4" />
                    <span>Home</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    href="/profile"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-800"
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                  <Link
                    href="/home/books/mybooks"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-800"
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    <span>My Books</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    href="/admin/transaction"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-800"
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Transaction History</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="my-1 border-t border-gray-200" />
                <DropdownMenuItem asChild>
                  <LogoutButton className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50" />
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile menu button */}
            <button
              className="ml-4 md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6 text-green-600" />
              ) : (
                <Menu className="h-6 w-6 text-green-600" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white shadow-lg w-full">
          <nav className="flex flex-col p-4 space-y-2">
            {showAllBooks && (
              <NavItem
                href="/home/books"
                icon={<Book className="h-5 w-5" />}
                text="Books"
                isActive={active === "Books"}
              />
            )}
            {showMyBooks && role === "user" && (
              <NavItem
                href="/home/mybooks"
                icon={<Book className="h-5 w-5" />}
                text="My Books"
                isActive={active === "MyBooks"}
              />
            )}
            {showMembers && role === "admin" && (
              <NavItem
                href="/admin/members"
                icon={<Users className="h-5 w-5" />}
                text="Members"
                isActive={active === "Members"}
              />
            )}
            {showTransactions && role === "admin" && (
              <NavItem
                href="/admin/transaction"
                icon={<FileText className="h-5 w-5" />}
                text="Transactions"
                isActive={active === "Transactions"}
              />
            )}
            {showMyTransactions && role === "user" && (
              <NavItem
                href="/home/mytransactions"
                icon={<Clock className="h-5 w-5" />}
                text="My Transactions"
                isActive={active === "MyTransactions"}
              />
            )}
            {showRequests && role === "admin" && (
              <NavItem
                href="/admin/requests"
                icon={<Bell className="h-5 w-5" />}
                text="Requests"
                isActive={active === "Requests"}
              />
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
