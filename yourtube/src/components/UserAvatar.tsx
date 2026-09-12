// components/UserAvatar.tsx

import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "./ui/avatar";
import { Crown } from "lucide-react";

interface UserAvatarProps {
  user: {
    name: string;
    image?: string;
  };
  isPremium: boolean;
  city: string;
}

export function UserAvatar({
  user,
  isPremium,
  city,
}: UserAvatarProps) {
  return (
    <div className="flex flex-col items-center gap-1.5">

      {/* Avatar */}
      <div className="relative">
        <Avatar className="w-10 h-10 border-2 border-gray-100">
          <AvatarImage
            src={user.image}
            alt={user.name}
          />

          <AvatarFallback className="bg-gray-100 text-gray-700 font-semibold">
            {user.name?.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>

        {/* Premium badge */}
        {isPremium && (
          <div
            className="
              absolute -bottom-1 -right-1
              w-5 h-5 rounded-full
              bg-yellow-400
              flex items-center justify-center
              border-2 border-white
              shadow-sm
            "
            title="Premium User"
          >
            <Crown className="w-3 h-3 text-yellow-900" />
          </div>
        )}
      </div>

      {/* City */}
      <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
        {city || "Unknown City"}
      </span>

    </div>
  );
}