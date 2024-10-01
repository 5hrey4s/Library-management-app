"use client";

import { useState, useEffect } from "react";
import {
  BookOpen,
  ChevronDown,
  Menu,
  User,
  Book,
  Users,
  FileText,
  Clock,
  Calendar,
  Heart,
  Activity,
  UserCheck,
  LogOut,
  Settings,
  Sun,
  Moon,
  CreditCard,
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
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import LogoutButton from "@/components/handlelogout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import LocaleSwitcher from "@/components/LocaleSwitcher";
import { useTheme } from "@/components/ThemeContext";

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
  onClick?: () => void;
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
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const t = useTranslations("navbar");
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const NavItem = ({ href, icon, text, isActive, onClick }: NavItemProps) => (
    <Link
      href={href}
      className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-all duration-200 ${
        isActive
          ? theme === "dark"
            ? "bg-green-800 text-green-100 shadow-sm"
            : "bg-green-100 text-green-800 shadow-sm"
          : theme === "dark"
          ? "text-gray-300 hover:bg-green-900 hover:text-green-100 hover:shadow-sm"
          : "text-gray-700 hover:bg-green-50 hover:text-green-800 hover:shadow-sm"
      }`}
      onClick={onClick}
    >
      {icon}
      <span className="font-medium">{text}</span>
    </Link>
  );

  return (
    <div
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled
          ? theme === "dark"
            ? "shadow-md bg-gray-900"
            : "shadow-md bg-white"
          : theme === "dark"
          ? "bg-gray-900 bg-opacity-90 backdrop-blur-sm"
          : "bg-white bg-opacity-90 backdrop-blur-sm"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link className="flex items-center space-x-2" href="/">
            <BookOpen
              className={`h-8 w-8 ${
                theme === "dark" ? "text-green-400" : "text-green-600"
              }`}
            />
            <span
              className={`text-xl font-bold ${
                theme === "dark" ? "text-white" : "text-gray-900"
              }`}
            >
              {t("logoText")}
            </span>
          </Link>

          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center space-x-1">
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
                isActive={active === "Dues"}
              />
            )}
            {role === "user" && (
              <NavItem
                href={`/home/professors`}
                icon={<UserCheck className="h-5 w-5" />}
                text={"Professors"}
                isActive={active === "Professors"}
                onClick={() => setIsMobileMenuOpen(false)}
              />
            )}
            {role === "admin" && (
              <NavItem
                href={`/admin/professors`}
                icon={<UserCheck className="h-5 w-5" />}
                text={"Professors"}
                isActive={active === "Professors"}
                onClick={() => setIsMobileMenuOpen(false)}
              />
            )}
            <div className="flex items-center space-x-2">
              <span
                className={`text-sm font-medium ${
                  theme === "dark" ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Credits: {100}
              </span>
              <Button
                variant="outline"
                size="sm"
                // onClick={handleBuyCredit}
                className={`${
                  theme === "dark"
                    ? "bg-green-700 text-white hover:bg-green-600"
                    : "bg-green-100 text-green-800 hover:bg-green-200"
                }`}
              >
                <CreditCard className="mr-2 h-4 w-4" />
                Buy Credit
              </Button>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className={`ml-2 ${
                theme === "dark"
                  ? "text-yellow-400 hover:text-yellow-300"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
              <span className="sr-only">Toggle theme</span>
            </Button>
          </nav>

          <div className="flex items-center space-x-4">
            <LocaleSwitcher />

            {/* Desktop user dropdown */}
            <div className="hidden md:block">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className={`flex items-center space-x-2 ${
                      theme === "dark"
                        ? "hover:bg-gray-800 focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
                        : "hover:bg-green-50 focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
                    } rounded-full`}
                  >
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={userAvatar} alt={userName} />
                      <AvatarFallback>
                        {userName.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span
                      className={`font-medium ${
                        theme === "dark" ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      {userName.charAt(0).toUpperCase() +
                        userName.slice(1).toLowerCase()}
                    </span>
                    <ChevronDown
                      className={`h-4 w-4 ${
                        theme === "dark" ? "text-gray-400" : "text-gray-500"
                      }`}
                    />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className={`w-56 p-2 ${
                    theme === "dark"
                      ? "bg-gray-800 border-gray-700"
                      : "bg-white border-gray-200"
                  } rounded-lg shadow-lg`}
                >
                  <DropdownMenuLabel
                    className={`px-2 py-1.5 text-sm font-semibold ${
                      theme === "dark" ? "text-gray-100" : "text-gray-900"
                    }`}
                  >
                    <div className="flex flex-col">
                      <span>{userName}</span>
                      <span
                        className={`text-xs font-normal ${
                          theme === "dark" ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        {role === "admin" ? "Administrator" : "User"}
                      </span>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator
                    className={`my-1 ${
                      theme === "dark" ? "border-gray-700" : "border-gray-200"
                    }`}
                  />
                  <DropdownMenuItem asChild>
                    <Link
                      href={`/profile`}
                      className={`flex items-center px-2 py-1.5 text-sm ${
                        theme === "dark"
                          ? "text-gray-300 hover:bg-gray-700 hover:text-gray-100"
                          : "text-gray-700 hover:bg-green-50 hover:text-green-800"
                      } rounded-md transition-colors duration-150`}
                    >
                      <User className="mr-2 h-4 w-4" />
                      <span>{t("profileDropdown.profile")}</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      href={`/profile/activity`}
                      className={`flex items-center px-2 py-1.5 text-sm ${
                        theme === "dark"
                          ? "text-gray-300 hover:bg-gray-700 hover:text-gray-100"
                          : "text-gray-700 hover:bg-green-50 hover:text-green-800"
                      } rounded-md transition-colors duration-150`}
                    >
                      <Activity className="mr-2 h-4 w-4" />
                      <span>{t("profileDropdown.activity")}</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      href={`/profile/wishlist`}
                      className={`flex items-center px-2 py-1.5 text-sm ${
                        theme === "dark"
                          ? "text-gray-300 hover:bg-gray-700 hover:text-gray-100"
                          : "text-gray-700 hover:bg-green-50 hover:text-green-800"
                      } rounded-md transition-colors duration-150`}
                    >
                      <Heart className="mr-2 h-4 w-4" />
                      <span>{t("profileDropdown.wishlist")}</span>
                    </Link>
                  </DropdownMenuItem>
                  {role === "user" && (
                    <DropdownMenuItem asChild>
                      <Link
                        href={`/home/professors`}
                        className={`flex items-center px-2 py-1.5 text-sm ${
                          theme === "dark"
                            ? "text-gray-300 hover:bg-gray-700 hover:text-gray-100"
                            : "text-gray-700 hover:bg-green-50 hover:text-green-800"
                        } rounded-md transition-colors duration-150`}
                      >
                        <Settings className="mr-2 h-4 w-4" />
                        <span>{t("profileDropdown.settings")}</span>
                      </Link>
                    </DropdownMenuItem>
                  )}
                  {role === "admin" && (
                    <DropdownMenuItem asChild>
                      <Link
                        href={`/admin/professors`}
                        className={`flex items-center px-2 py-1.5 text-sm ${
                          theme === "dark"
                            ? "text-gray-300 hover:bg-gray-700 hover:text-gray-100"
                            : "text-gray-700 hover:bg-green-50 hover:text-green-800"
                        } rounded-md transition-colors duration-150`}
                      >
                        <Settings className="mr-2 h-4 w-4" />
                        <span>{t("profileDropdown.settings")}</span>
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator
                    className={`my-1 ${
                      theme === "dark" ? "border-gray-700" : "border-gray-200"
                    }`}
                  />
                  <DropdownMenuItem asChild>
                    <LogoutButton
                      className={`flex items-center w-full px-2 py-1.5 text-sm ${
                        theme === "dark"
                          ? "text-red-400 hover:bg-red-900 hover:text-red-100"
                          : "text-red-600 hover:bg-red-50 hover:text-red-700"
                      } rounded-md transition-colors duration-150`}
                    />
                  </DropdownMenuItem>
                  <DropdownMenuSeparator
                    className={`my-1 ${
                      theme === "dark" ? "border-gray-700" : "border-gray-200"
                    }`}
                  />
                  <DropdownMenuItem>
                    <div
                      className={`flex items-center justify-between w-full ${
                        theme === "dark" ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      <span>Credits:</span>
                      <span>{100}</span>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => null}>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full justify-start"
                    >
                      <CreditCard className="mr-2 h-4 w-4" />
                      Buy Credit
                    </Button>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Mobile menu */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  className="md:hidden"
                  onClick={() => setIsMobileMenuOpen(true)}
                >
                  <Menu
                    className={`h-6 w-6 ${
                      theme === "dark" ? "text-gray-300" : "text-gray-700"
                    }`}
                  />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className={`w-[300px] sm:w-[400px] ${
                  theme === "dark" ? "bg-gray-900" : "bg-white"
                }`}
              >
                <nav className="flex flex-col space-y-4 mt-8">
                  <NavItem
                    href={`/profile`}
                    icon={<User className="h-5 w-5" />}
                    text={t("profileDropdown.profile")}
                    isActive={active === "Profile"}
                    onClick={() => setIsMobileMenuOpen(false)}
                  />
                  {showAllBooks && (
                    <NavItem
                      href={`/home/books`}
                      icon={<Book className="h-5 w-5" />}
                      text={t("menu.allBooks")}
                      isActive={active === "Books"}
                      onClick={() => setIsMobileMenuOpen(false)}
                    />
                  )}
                  {showMyBooks && role === "user" && (
                    <NavItem
                      href={`/home/books/mybooks`}
                      icon={<Book className="h-5 w-5" />}
                      text={t("menu.myBooks")}
                      isActive={active === "MyBooks"}
                      onClick={() => setIsMobileMenuOpen(false)}
                    />
                  )}
                  {showMembers && role === "admin" && (
                    <NavItem
                      href={`/admin/members`}
                      icon={<Users className="h-5 w-5" />}
                      text={t("menu.members")}
                      isActive={active === "Members"}
                      onClick={() => setIsMobileMenuOpen(false)}
                    />
                  )}
                  {showTransactions && role === "admin" && (
                    <NavItem
                      href={`/admin/transaction`}
                      icon={<FileText className="h-5 w-5" />}
                      text={t("menu.transactions")}
                      isActive={active === "Transactions"}
                      onClick={() => setIsMobileMenuOpen(false)}
                    />
                  )}
                  {showMyTransactions && role === "user" && (
                    <NavItem
                      href={`/home/mytransaction`}
                      icon={<Clock className="h-5 w-5" />}
                      text={t("menu.myTransactions")}
                      isActive={active === "MyTransactions"}
                      onClick={() => setIsMobileMenuOpen(false)}
                    />
                  )}
                  <NavItem
                    href={`/profile/wishlist`}
                    icon={<Heart className="h-5 w-5" />}
                    text={t("profileDropdown.wishlist")}
                    isActive={active === "Wishlist"}
                    onClick={() => setIsMobileMenuOpen(false)}
                  />
                  <NavItem
                    href={`/profile/activity`}
                    icon={<Activity className="h-5 w-5" />}
                    text={t("profileDropdown.activity")}
                    isActive={active === "Activity"}
                    onClick={() => setIsMobileMenuOpen(false)}
                  />
                  {role === "user" && (
                    <NavItem
                      href={`/home/professors`}
                      icon={<UserCheck className="h-5 w-5" />}
                      text={"Professors"}
                      isActive={active === "Professors"}
                      onClick={() => setIsMobileMenuOpen(false)}
                    />
                  )}
                  {role === "admin" && (
                    <NavItem
                      href={`/admin/professors`}
                      icon={<UserCheck className="h-5 w-5" />}
                      text={"Professors"}
                      isActive={active === "Professors"}
                      onClick={() => setIsMobileMenuOpen(false)}
                    />
                  )}
                  <div
                    className={`flex items-center justify-between ${
                      theme === "dark" ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    <span>Credits: {100}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => null}
                      className={`${
                        theme === "dark"
                          ? "bg-green-700 text-white hover:bg-green-600"
                          : "bg-green-100 text-green-800 hover:bg-green-200"
                      }`}
                    >
                      <CreditCard className="mr-2 h-4 w-4" />
                      Buy Credit
                    </Button>
                  </div>
                  <Button
                    variant="ghost"
                    onClick={toggleTheme}
                    className={`flex items-center justify-center w-full ${
                      theme === "dark"
                        ? "text-yellow-400 hover:text-yellow-300"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    {theme === "dark" ? (
                      <Sun className="h-5 w-5 mr-2" />
                    ) : (
                      <Moon className="h-5 w-5 mr-2" />
                    )}
                    {theme === "dark" ? "Light Mode" : "Dark Mode"}
                  </Button>

                  <div className="mt-4">
                    <LocaleSwitcher />
                  </div>
                  <LogoutButton
                    className={`flex items-center w-full px-3 py-2 text-sm ${
                      theme === "dark"
                        ? "text-red-400 hover:bg-red-900"
                        : "text-red-600 hover:bg-red-50"
                    } rounded-md mt-4`}
                  />
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </div>
  );
}
