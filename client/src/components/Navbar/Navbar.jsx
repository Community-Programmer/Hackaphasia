import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogOut, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";


const Navbar = () => {

    const [isAuthenticated, setIsAuthenticated] = useState(false)

  return (
    <>
      <div className="flex w-full flex-col ">
        <header className="sticky z-[1] top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6 bg-gradient-to-b from-blue-50 to-transparent dark:from-blue-900">
          <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
            <Link
              to="/"
              className="flex items-center gap-2 text-lg font-semibold md:text-base"
            >
              <img
                src="https://i.pinimg.com/736x/70/2d/58/702d58e8529d740ac7b2d146b7ee4baf.jpg"
                className="h-10 me-3"
                alt="FlowBite Logo"
              />
              <span>Teachers Choice</span>
            </Link>
            <Link
              to="/"
              className="text-foreground transition-colors hover:text-foreground"
            >
              Home
            </Link>
            <Link
              to="/about"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              About
            </Link>

            <Link
              to="/resources"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              Resources
            </Link>

            <Link
              to="/contact"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              Contact us
            </Link>
          </nav>
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="shrink-0 md:hidden"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <nav className="grid gap-6 text-lg font-medium">
                <Link
                  to="/"
                  className="flex items-center gap-2 text-lg font-semibold"
                >
                  <img src="" alt="WN" className="h-6 w-6" />
                  <span>WebsiteName</span>
                </Link>
                <Link to="/" className="hover:text-foreground">
                  Home
                </Link>
                <Link
                  to="/about"
                  className="text-muted-foreground hover:text-foreground"
                >
                  About
                </Link>

                <Link
                  to="/resources"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Resources
                </Link>

                <Link
                  to="/contact"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Contact us
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
          <div className="flex items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
            {!isAuthenticated ? (
              <div className="ml-auto flex-1 sm:flex-initial">
                <div className="flex gap-3 relative">
                  <Link to="/auth/signup">
                    <Button
                      variant="outline"
                      size="sm"
                      className="ml-auto gap-1.5 text-sm"
                    >
                      Sign Up
                    </Button>
                  </Link>
                  <Link to="/auth/login">
                    <Button
                      variant="outline"
                      size="sm"
                      className="ml-auto gap-1.5 text-sm"
                    >
                      Sign In
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="flex gap-1">
                    <Avatar className="rounded-none">
                      <AvatarImage
                        className="rounded-full"
                        src={userDetails?.profileUrl}
                      />
                      <AvatarFallback>CN</AvatarFallback>
                      <span className="top-0 left-7 absolute  w-3.5 h-3.5 bg-green-400 border-2 border-white dark:border-gray-800 rounded-full"></span>
                    </Avatar>

                    <Button variant="secondary">{user}</Button>
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate("/my-profile")}>
                    My Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/edit-profile")}>
                    Edit Profile
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </header>
      </div>
    </>
  );
};

export default Navbar;