// components/Navbar.js
"use client";

import * as React from "react";
import { useContext } from "react";
import { MoonIcon, SunIcon } from "@radix-ui/react-icons";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import Link from "next/link";
import { AuthContext } from '@/app/user/context/auth-context';

export function UserNavbar() {
  const { setTheme } = useTheme();
  const router = useRouter();
  const { isAuthenticated, logout } = useContext(AuthContext);

  const menus = [
    { title: "Home", path: "/user" },
    { title: "Issue", path: "/user/issue" },
  ] 

  return (
    <nav className="mt-5 m-2 flex justify-center items-center">
      <NavigationMenu>
        <NavigationMenuList>
        {isAuthenticated && (
          menus.map((item, idx) => (
            <NavigationMenuItem key={idx}>
              <Link href={item.path} passHref legacyBehavior>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  {item.title}
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          )))}

          {isAuthenticated && (
            <NavigationMenuItem key="logout">
              <Button variant="link"  onClick={logout} passHref legacyBehavior>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Log Out
                </NavigationMenuLink>
              </Button>
            </NavigationMenuItem>
          )}

          <NavigationMenuItem key="theme-toggle">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <SunIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                  <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                  <span className="sr-only">Toggle theme</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setTheme("light")}>
                  Light
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")}>
                  Dark
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("system")}>
                  System
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </nav>
  );
}
