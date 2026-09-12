"use client";

import {
  Home,
  Compass,
  PlaySquare,
  History,
  ThumbsUp,
  Clock,
  User,
} from "lucide-react";

import Link from "next/link";
import React, { useContext } from "react";
import { usePathname } from "next/navigation";

import { Button } from "./ui/button";
import { UserContext } from "@/lib/AuthContext";

const Sidebar = () => {
  const context = useContext(UserContext);
  const user = context?.user;

  // Always convert pathname to a guaranteed string.
  const currentPath = String(usePathname() ?? "");

  const menuItems = [
    {
      name: "Home",
      icon: Home,
      href: "/",
    },
    {
      name: "Explore",
      icon: Compass,
      href: "/explore",
    },
    {
      name: "Subscriptions",
      icon: PlaySquare,
      href: "/subscriptions",
    },
  ];

  const userItems = [
    {
      name: "History",
      icon: History,
      href: "/history",
    },
    {
      name: "Liked videos",
      icon: ThumbsUp,
      href: "/liked",
    },
    {
      name: "Watch later",
      icon: Clock,
      href: "/watch-later",
    },
    {
      name: "Your channel",
      icon: User,
      href: user?._id ? `/channel/${user._id}` : "/",
    },
  ];

  const renderItem = (
    item: {
      name: string;
      icon: React.ElementType;
      href: string;
    }
  ) => {
    const Icon = item.icon;

    let isActive = false;

    if (item.href === "/") {
      isActive = currentPath === "/";
    } else {
      isActive =
        currentPath === item.href ||
        currentPath.startsWith(`${item.href}/`);
    }

    return (
      <Link
        key={item.name}
        href={item.href}
        className="block"
      >
        <Button
          type="button"
          variant="ghost"
          className={`
            w-full
            justify-start
            gap-4
            rounded-full
            px-4
            py-2.5
            text-left
            font-normal
            transition-all
            duration-200
            ${
              isActive
                ? "bg-gray-100 text-black hover:bg-gray-200"
                : "text-gray-700 hover:bg-gray-100 hover:text-black"
            }
          `}
        >
          <Icon
            className={`
              h-5
              w-5
              flex-shrink-0
              transition-all
              duration-200
              ${
                isActive
                  ? "scale-105 text-black"
                  : "text-gray-600"
              }
            `}
          />

          <span>{item.name}</span>
        </Button>
      </Link>
    );
  };

  return (
    <aside
      className="
        w-64
        flex-shrink-0
        border-r
        border-gray-100
        bg-white
        min-h-[calc(100vh-57px)]
        p-3
      "
    >
      <nav className="space-y-1">

        {/* MAIN MENU */}
        {menuItems.map(renderItem)}

        {/* USER MENU */}
        {user && (
          <>
            <div className="my-4 border-t border-gray-100" />

            {userItems.map(renderItem)}
          </>
        )}

      </nav>
    </aside>
  );
};

export default Sidebar;