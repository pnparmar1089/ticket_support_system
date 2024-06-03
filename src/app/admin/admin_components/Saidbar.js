"use client";

import React, { useContext } from "react";
import { Headset, Home,  Users,Ticket,Tag } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AuthContext } from "@/app/admin/context/auth-context";


export function Saidbar() {
  const pathname = usePathname();

  const menus = [
    { title: "Home", path: "/admin", icon: Home },
    { title: "Users", path: "/admin/User", icon: Users },
    { title: "Ticket", path: "/admin/ticket", icon: Ticket },
    { title: "Issue", path: "/admin/issue", icon: Tag },
  ];

  return (
    <div className="hidden border-r bg-muted/40 md:block">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <Headset className="h-6 w-6" />
            <span className="">TSM</span>
          </Link>
        </div>
        <div className="flex-1">
          <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
            {menus.map((menu) => {
              const Icon = menu.icon;
              return (
                <Link
                  key={menu.path}
                  href={menu.path}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${
                    pathname === menu.path ? "bg-muted text-primary" : "text-muted-foreground"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {menu.title}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </div>
  );
}
