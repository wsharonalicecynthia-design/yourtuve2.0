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
import { Button } from "./ui/button";
import { UserContext } from "@/lib/AuthContext";

const Sidebar = () => {
  const { user }: any = useContext(UserContext);

  return (
    <aside className="w-64 border-r border-gray-100 min-h-[calc(100vh-57px)] p-3">
      <nav className="flex flex-col gap-1">
        <Link href="/">
          <Button
            variant="ghost"
            className="w-full justify-start gap-4 text-sm font-normal rounded-xl hover:bg-gray-100"
          >
            <Home className="w-5 h-5" />
            Home
          </Button>
        </Link>

        <Link href="/explore">
          <Button
            variant="ghost"
            className="w-full justify-start gap-4 text-sm font-normal rounded-xl hover:bg-gray-100"
          >
            <Compass className="w-5 h-5" />
            Explore
          </Button>
        </Link>

        <Link href="/subscriptions">
          <Button
            variant="ghost"
            className="w-full justify-start gap-4 text-sm font-normal rounded-xl hover:bg-gray-100"
          >
            <PlaySquare className="w-5 h-5" />
            Subscriptions
          </Button>
        </Link>

        {user && (
          <div className="border-t border-gray-100 pt-2 mt-2 flex flex-col gap-1">
            <Link href="/history">
              <Button
                variant="ghost"
                className="w-full justify-start gap-4 text-sm font-normal rounded-xl hover:bg-gray-100"
              >
                <History className="w-5 h-5" />
                History
              </Button>
            </Link>

            <Link href="/liked">
              <Button
                variant="ghost"
                className="w-full justify-start gap-4 text-sm font-normal rounded-xl hover:bg-gray-100"
              >
                <ThumbsUp className="w-5 h-5" />
                Liked videos
              </Button>
            </Link>

            <Link href="/watch-later">
              <Button
                variant="ghost"
                className="w-full justify-start gap-4 text-sm font-normal rounded-xl hover:bg-gray-100"
              >
                <Clock className="w-5 h-5" />
                Watch later
              </Button>
            </Link>

            <Link href={`/channel/${user._id}`}>
              <Button
                variant="ghost"
                className="w-full justify-start gap-4 text-sm font-normal rounded-xl hover:bg-gray-100"
              >
                <User className="w-5 h-5" />
                Your channel
              </Button>
            </Link>
          </div>
        )}
      </nav>
    </aside>
  );
};

export default Sidebar;