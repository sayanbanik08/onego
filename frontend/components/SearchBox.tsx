"use client";

import Image from "next/image";
import { Search } from "lucide-react";

type SearchBoxProps = {
    profilePhoto: string | null;
};

export default function SearchBox({ profilePhoto }: SearchBoxProps) {
    return (
        <div className="flex items-center gap-3">

            {/* User Profile Photo */}
            {profilePhoto ? (
                <Image
                    src={profilePhoto}
                    alt="Profile photo"
                    width={40}
                    height={40}
                    className="h-10 w-10 rounded-full border border-gray-200 object-cover"
                />
            ) : (
                <div className="h-10 w-10 rounded-full border border-gray-200 bg-gray-100" />
            )}

            {/* Search Box */}
            <div className="flex h-10 w-80 items-center rounded-full border border-gray-300 bg-white px-4 shadow-sm transition focus-within:border-gray-500 focus-within:shadow-md">

                <Search
                    size={18}
                    className="mr-3 shrink-0 text-gray-400"
                />

                <input
                    type="text"
                    placeholder="Search by ID"
                    className="w-full bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-400"
                />

            </div>

        </div>
    );
}