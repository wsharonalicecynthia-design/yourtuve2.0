import React from "react";
import { Button } from "./ui/button";

const categories = [
  "All",
  "Music",
  "Gaming",
  "Movies",
  "News",
  "Sports",
  "Technology",
  "Comedy",
  "Education",
  "Science",
  "Travel",
  "Food",
  "Fashion",
];

interface Props {
  activeCategory: string;
  setActiveCategory: (value: string) => void;
}

export default function CategoryTabs({
  activeCategory,
  setActiveCategory,
}: Props) {
  return (
    <div className="relative mb-6">
      <div
        className="
          flex gap-2 overflow-x-auto pb-2
          scrollbar-hide
          scroll-smooth
        "
      >
        {categories.map((category) => {
          const isActive = activeCategory === category;

          return (
            <Button
              key={category}
              variant="secondary"
              onClick={() => setActiveCategory(category)}
              className={`
                whitespace-nowrap
                rounded-full
                px-5
                py-2
                text-sm
                font-medium
                transition-all
                duration-200
                border
                shrink-0

                ${
                  isActive
                    ? "bg-black text-white border-black shadow-md scale-[1.03] hover:bg-black hover:text-white"
                    : "bg-white text-gray-700 border-gray-200 hover:bg-gray-100 hover:border-gray-300 hover:-translate-y-[1px]"
                }
              `}
            >
              {category}
            </Button>
          );
        })}
      </div>

      {/* Subtle fade on the right for horizontal scrolling */}
      <div className="pointer-events-none absolute right-0 top-0 h-full w-10 bg-gradient-to-l from-white to-transparent" />
    </div>
  );
}