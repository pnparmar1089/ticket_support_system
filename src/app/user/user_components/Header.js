"use client";

import React, { useContext } from 'react';
import {
  CircleUser,
  Home,
  Menu,
  Tag,
  Headset,

} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AuthContext } from '@/app/user/context/auth-context';
import { usePathname } from "next/navigation";

function Header(props) {
  const { isAuthenticated, logout } = useContext(AuthContext);
  const pathname = usePathname();

  const menus = [
    { title: "Dashboard", path: "/user", icon: Home },
    { title: "Issue", path: "/user/issue", icon: Tag },
  ];

  return (
    <header className={`flex h-14 items-center gap-4  px-4 lg:h-[60px] lg:px-6   ${isAuthenticated && "border-b bg-muted/40" }`}>
      {isAuthenticated && (
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="shrink-0 md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="flex flex-col">
            <nav className="grid gap-2 text-lg font-medium">
              <Link href="/" className="flex items-center gap-2 text-lg font-semibold">
                <Headset className="h-6 w-6" />
                <span className="">TSM</span>
              </Link>
              {menus.map((menu) => {
                const Icon = menu.icon;
                return (
                  <Link
                    key={menu.path}
                    href={menu.path}
                    className={`mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 transition-all ${
                      pathname === menu.path ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    {menu.title}
                  </Link>
                );
              })}
            </nav>
          </SheetContent>
        </Sheet>
      )}
      <div className="w-full flex-1"></div>
      <ModeToggle />
      {isAuthenticated && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="icon" className="rounded-full">
              <CircleUser className="h-5 w-5" />
              <span className="sr-only">Toggle user menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuLabel>ISP Name : {props.data.ispname}</DropdownMenuLabel>
            <DropdownMenuLabel>Username : {props.data.username}</DropdownMenuLabel>
            <DropdownMenuLabel>E-Mail : {props.data.email}</DropdownMenuLabel>
            <DropdownMenuLabel>Phone Num. : {props.data.phone_num}</DropdownMenuLabel>
            <DropdownMenuItem>
              <Link href="/admin/login" onClick={logout} passHref>
                Log Out
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </header>
  );
}

export default Header;
