import React, { useState, useContext, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bell, Menu, Mic, Search, User, Video as VideoIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// This is the only import you need for the dropdown components
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import ChannelDialogue from "./ChannelDialogue";
import { UserContext } from "../../lib/AuthContext";

// ... rest of your Header component
const Header = () => {
  const context = useContext(UserContext);
  const user = context?.user || null;
  const handlegooglesignin = context?.handlegooglesignin;
  const logout = context?.logout;

  const [searchQuery, setSearchQuery] = useState("");
  const [isdialogopen, setisdialogopen] = useState(false);
  const [isMounted, setIsMounted] = useState(false); 
  const router = useRouter();

  const hasChannel = !!(user?.channelname || user?.channelId || user?.hasChannel);
  const userId = user?._id || user?.id;

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) { 
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

 const handleKeypress = (e: React.KeyboardEvent<HTMLInputElement>) => {
  if (e.key === "Enter") {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  }
};

  return (
    <header className="flex items-center justify-between px-4 py-2 bg-white border-b sticky top-0 z-50">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="rounded-full">
          <Menu className="w-6 h-6" />
        </Button>

        <Link href="/" className="flex items-center gap-1">
          <div className="bg-red-600 p-1 rounded">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-4 h-4">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814z" />
              <path d="M9.545 15.568V8.432L15.818 12l-6.273 3.568z" fill="red" />
            </svg>
          </div>
          <span className="text-xl font-medium tracking-tight text-black">YourTube</span>
        </Link>
      </div>

      <form onSubmit={handleSearch} className="flex items-center gap-2 flex-1 max-w-2xl mx-4">
        <div className="flex flex-1">
          <Input
            type="search"
            placeholder="Search"
            value={searchQuery}
         onKeyDown={handleKeypress}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="rounded-l-full border-r-0 focus-visible:ring-0 text-black bg-transparent w-full"
          />
          <Button type="submit" className="rounded-r-full px-6 bg-gray-50 hover:bg-gray-100 text-gray-600 border border-gray-300 h-10 shrink-0">
            <Search className="w-5 h-5" />
          </Button>
        </div>

        <Button type="button" variant="ghost" size="icon" className="rounded-full bg-gray-100 hover:bg-gray-200 shrink-0">
          <Mic className="w-5 h-5 text-black" />
        </Button>
      </form>

      <div className="flex items-center gap-2">
        {isMounted && user ? (
          <>
            
            <Link
  href="/"
  onClick={(e) => {
    if (!hasChannel) {
      e.preventDefault();
      setisdialogopen(true);
    }
  }}
>
  <Button variant="ghost" size="icon" className="rounded-full">
    <VideoIcon className="w-6 h-6 text-black" />
  </Button>
</Link>

            <Button variant="ghost" size="icon" className="rounded-full">
              <Bell className="w-6 h-6 text-black" />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full p-0">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.image || ""} alt={user.name || ""} />
                    <AvatarFallback>{user.name?.[0] || "U"}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent className="w-56 bg-white text-black border shadow-md" align="end" forceMount>
                {hasChannel ? (
                  <DropdownMenuItem asChild className="cursor-pointer hover:bg-gray-100 focus:bg-gray-100">
                    <Link href={`/channel/${userId}`} className="w-full block px-2 py-1.5 text-sm">
                      Your channel
                    </Link>
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem className="p-0 focus:bg-transparent" onSelect={(e) => e.preventDefault()}>
                    <button
                      type="button"
                      onClick={() => setisdialogopen(true)}
                      className="w-full text-left px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50/50 rounded transition-colors"
                    >
                      Create a channel
                    </button>
                  </DropdownMenuItem>
                )}

                <DropdownMenuSeparator className="bg-gray-200" />
                <DropdownMenuItem asChild className="cursor-pointer hover:bg-gray-100"><Link href="/history" className="w-full block px-2 py-1.5">History</Link></DropdownMenuItem>
                <DropdownMenuItem asChild className="cursor-pointer hover:bg-gray-100"><Link href="/liked" className="w-full block px-2 py-1.5">Liked videos</Link></DropdownMenuItem>
                <DropdownMenuItem asChild className="cursor-pointer hover:bg-gray-100"><Link href="/watch-later" className="w-full block px-2 py-1.5">Watch later</Link></DropdownMenuItem>
                <DropdownMenuSeparator className="bg-gray-200" />
                <DropdownMenuItem onClick={logout} className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50 hover:bg-red-50 px-4 py-2 text-sm">
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        ) : (
          <Button
            onClick={handlegooglesignin}
            variant="outline"
            className="flex items-center gap-2 rounded-full border-blue-600 text-blue-600 hover:bg-blue-50 font-medium px-4 h-10"
          >
            <User className="w-4 h-4" />
            Sign in
          </Button>
        )}
      </div>

      <ChannelDialogue isopen={isdialogopen} onclose={() => setisdialogopen(false)} channeldata={null} mode="create" />
    </header>
  );
};

export default Header;