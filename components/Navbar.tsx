"use client";

import { useState, useEffect } from "react";
import {
  BookOpen,
  ChevronDown,
  Menu,
  X,
  User,
  Book,
  Users,
  FileText,
  Clock,
  Bell,
  HomeIcon,
  History,
  ActivityIcon,
  Calendar,
  HeartIcon,
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
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import LocaleSwitcher from "@/components/LocaleSwitcher"; // Import the LocaleSwitcher component

interface NavbarProps {
  logoText?: string;
  showAllBooks?: boolean;
  showMyBooks?: boolean;
  showMembers?: boolean;
  showTransactions?: boolean;
  showMyTransactions?: boolean;
  active?: string;
  role?: string;
  userAvatar?: string;
  userName?: string;
  locale: string;
}

interface NavItemProps {
  href: string;
  icon: React.ReactNode;
  text: string;
  isActive: boolean;
}

export default function Navbar({
  logoText = "Library",
  showAllBooks = true,
  showMyBooks = true,
  showMembers = true,
  showTransactions = true,
  showMyTransactions = true,
  active,
  role,
  userAvatar,
  userName = "user",
  locale,
}: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const t = useTranslations("navbar");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const NavItem = ({ href, icon, text, isActive }: NavItemProps) => (
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
    <div
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled ? "shadow-md bg-[#DBD3D3]" : "bg-[#9FA8A0]"
      }`}
    >
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link className="flex items-center space-x-2" href="/">
            <BookOpen className="h-8 w-8 text-green-600" />
            <span className="text-xl font-bold text-green-800 dark:text-gray-100">
              {t("logoText")}
            </span>
          </Link>

          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center space-x-4">
            {showAllBooks && (
              <NavItem
                href={`/home/books`}
                icon={<Book className="h-5 w-5" />}
                text={t("menu.allBooks")}
                isActive={active === "Books"}
              />
            )}
            {showMyBooks && role === "user" && (
              <NavItem
                href={`/home/books/mybooks`}
                icon={<Book className="h-5 w-5" />}
                text={t("menu.myBooks")}
                isActive={active === "MyBooks"}
              />
            )}
            {showMembers && role === "admin" && (
              <NavItem
                href={`/admin/members`}
                icon={<Users className="h-5 w-5" />}
                text={t("menu.members")}
                isActive={active === "Members"}
              />
            )}
            {showTransactions && role === "admin" && (
              <NavItem
                href={`/admin/transaction`}
                icon={<FileText className="h-5 w-5" />}
                text={t("menu.transactions")}
                isActive={active === "Transactions"}
              />
            )}
            {showMyTransactions && role === "user" && (
              <NavItem
                href={`/home/mytransaction`}
                icon={<Clock className="h-5 w-5" />}
                text={t("menu.myTransactions")}
                isActive={active === "MyTransactions"}
              />
            )}
            {role === "admin" && (
              <NavItem
                href={`/admin/dues`}
                icon={<Calendar className="h-5 w-5" />}
                text={t("menu.todaysDues")}
                isActive={active === "MyTransactions"}
              />
            )}
            {/* LocaleSwitcher Component */}
            <LocaleSwitcher /> {/* Locale switcher added to the desktop navigation */}
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
                    href={`/profile`}
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-800"
                  >
                    <User className="mr-2 h-4 w-4" />
                    <span>{t("profileDropdown.profile")}</span>
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                  <Link
                    href={`/profile/activity`}
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-800"
                  >
                    <ActivityIcon className="mr-2 h-4 w-4" />
                    <span>{t("profileDropdown.activity")}</span>
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                  <Link
                    href={`/profile/wishlist`}
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-800"
                  >
                    <HeartIcon className="mr-2 h-4 w-4" />
                    <span>{t("profileDropdown.wishlist")}</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="my-1 border-t border-gray-200" />
                <DropdownMenuItem asChild>
                  <LogoutButton className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50" />
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* LocaleSwitcher for mobile */}
            <LocaleSwitcher className="ml-4 md:hidden" />

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
                href={`/home/books`}
                icon={<Book className="h-5 w-5" />}
                text={t("menu.allBooks")}
                isActive={active === "Books"}
              />
            )}
            {showMyBooks && role === "user" && (
              <NavItem
                href={`/home/mybooks`}
                icon={<Book className="h-5 w-5" />}
                text={t("menu.myBooks")}
                isActive={active === "MyBooks"}
              />
            )}
            {showMembers && role === "admin" && (
              <NavItem
                href={`/admin/members`}
                icon={<Users className="h-5 w-5" />}
                text={t("menu.members")}
                isActive={active === "Members"}
              />
            )}
            {showTransactions && role === "admin" && (
              <NavItem
                href={`/admin/transaction`}
                icon={<FileText className="h-5 w-5" />}
                text={t("menu.transactions")}
                isActive={active === "Transactions"}
              />
            )}
            {showMyTransactions && role === "user" && (
              <NavItem
                href={`/home/mytransactions`}
                icon={<Clock className="h-5 w-5" />}
                text={t("menu.myTransactions")}
                isActive={active === "MyTransactions"}
              />
            )}
          </nav>
        </div>
      )}
    </div>
  );
}
