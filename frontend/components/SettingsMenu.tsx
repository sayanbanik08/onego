"use client";

import { useState } from "react";
import {
    Settings,
    X,
    ChevronDown,
    ChevronUp,
    Trash2,
    Pencil
} from "lucide-react";
import ProfileVisibilityToggle from "@/components/ProfileVisibilityToggle";
import { useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

type AccountResult = {
    search_by_id: number;
    email_id: string;
    full_name: string;
    photo: string | null;
};

type SettingsMenuProps = {
    accountResult: AccountResult;
};

export default function SettingsMenu({ accountResult }: SettingsMenuProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isAccountOpen, setIsAccountOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isDashboardOpen, setIsDashboardOpen] = useState(false);
    const { signOut } = useClerk();
    const router = useRouter();

    return (
        <>
            {/* Settings Icon */}
            <button
                type="button"
                aria-label="Dashboard Settings"
                onClick={() => setIsOpen(true)}
                className="p-2 rounded-full hover:bg-gray-100 transition"
            >
                <Settings size={22} />
            </button>

            {/* Side Menu */}
            {isOpen && (
                <div className="fixed inset-0 z-50">

                    {/* Background overlay */}
                    <div
                        className="absolute inset-0 bg-black/20"
                        onClick={() => setIsOpen(false)}
                    />

                    {/* Right Side Menu */}
                    <div className="absolute top-0 right-0 h-full w-1/2 overflow-y-auto bg-white shadow-xl text-black">

                        {/* Header */}
                        <div className="flex items-center justify-between p-5 border-b">
                            <h2 className="text-lg font-semibold">
                                Settings
                            </h2>

                            <button
                                type="button"
                                aria-label="Close"
                                onClick={() => setIsOpen(false)}
                                className="p-2 rounded-full hover:bg-gray-100 transition"
                            >
                                <X size={22} />
                            </button>
                        </div>

                        {/* Menu Content */}
                        <div className="p-5">

                            {/* ACCOUNT SETTING */}
                            <button
                                type="button"
                                onClick={() => {
                                    setIsAccountOpen(!isAccountOpen);
                                    setIsProfileOpen(false);
                                    setIsDashboardOpen(false);
                                }}
                                className="flex items-center justify-between w-full 
                                text-left p-3 rounded-lg hover:bg-gray-100 transition"
                            >
                                <span>Account Setting</span>

                                {isAccountOpen ? (
                                    <ChevronUp size={20} />
                                ) : (
                                    <ChevronDown size={20} />
                                )}
                            </button>

                            {/* ACCOUNT DETAILS */}
                            {isAccountOpen && (
                                <div className="mt-4 ml-2 mr-2 space-y-4">

                                    {/* Profile Card */}
                                    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">

                                        <div className="flex items-center gap-4">

                                            {/* Profile Photo */}
                                            <div className="relative shrink-0">
                                                {accountResult.photo ? (
                                                    <img
                                                        src={accountResult.photo}
                                                        alt="Profile photo"
                                                        className="h-16 w-16 rounded-full border border-gray-200 object-cover"
                                                    />
                                                ) : (
                                                    <div className="flex h-16 w-16 items-center justify-center 
                                                    rounded-full bg-gray-100 text-lg font-semibold text-gray-500">
                                                        {accountResult.full_name?.charAt(0)?.toUpperCase() || "U"}
                                                    </div>
                                                )}

                                                {/* Fake Edit Button */}
                                                <button
                                                    type="button"
                                                    aria-label="Edit profile photo"
                                                    className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full border 
                                                    border-gray-200 bg-white shadow-sm transition hover:bg-gray-50"
                                                >
                                                    <Pencil size={13} />
                                                </button>
                                            </div>

                                            {/* Name & Email */}
                                            {/* Name & Email */}
                                            <div className="flex min-w-0 flex-1 items-center justify-between gap-4">

                                                {/* Name & Email */}
                                                <div className="min-w-0">
                                                    <div className="flex items-center gap-2">
                                                        <h3 className="truncate text-base font-semibold text-gray-900">
                                                            {accountResult.full_name}
                                                        </h3>

                                                        <button
                                                            type="button"
                                                            aria-label="Edit full name"
                                                            className="shrink-0 rounded-full p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
                                                        >
                                                            <Pencil size={14} />
                                                        </button>
                                                    </div>

                                                    <p className="mt-1 truncate text-sm text-gray-500">
                                                        {accountResult.email_id}
                                                    </p>
                                                </div>

                                                {/* Log out */}
                                                <button
                                                    type="button"
                                                    onClick={() => signOut({ redirectUrl: "/login" })}
                                                    className="shrink-0 bg-black px-4 py-2 text-sm font-medium text-white transition 
                                                    hover:bg-white hover:text-black hover:border hover:border-black"
                                                >
                                                    Log out
                                                </button>

                                            </div>

                                        </div>

                                        {/* Search ID */}
                                        <div className="mt-5 border-t border-gray-100 pt-4">
                                            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                                                Search By ID
                                            </p>

                                            <div className="mt-2 rounded-xl bg-gray-50 px-4 py-3">
                                                <p className="text-sm font-semibold tracking-wide text-gray-900">
                                                    {accountResult.search_by_id}
                                                </p>
                                            </div>
                                        </div>

                                    </div>


                                    {/* Profile Visibility */}
                                    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">

                                        <div className="flex items-center justify-between gap-4">

                                            <div className="min-w-0">
                                                <h3 className="text-sm font-semibold text-gray-900">
                                                    Profile Visibility
                                                </h3>

                                                <p className="mt-1 text-xs leading-5 text-gray-500">
                                                    Control whether your OneGo profile is visible publicly.
                                                </p>
                                            </div>

                                            <div className="shrink-0">
                                                <ProfileVisibilityToggle />
                                            </div>

                                        </div>

                                    </div>
                                    {/* DANGER ZONE */}
                                    <div className="rounded-2xl border border-red-200 bg-red-50/30 p-5 shadow-sm">

                                        <div>
                                            <h3 className="text-sm font-semibold text-red-600">
                                                Danger Zone
                                            </h3>

                                            <p className="mt-1 text-xs leading-5 text-gray-500">
                                                Permanently delete your OneGo account and all associated data.
                                            </p>
                                        </div>

                                        <div className="mt-4 border-t border-red-100 pt-4">
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    // TODO: Delete Account API
                                                }}
                                                className="flex w-full items-center justify-center gap-2 rounded-none 
                                                border border-red-300 bg-white px-4 py-3 text-sm font-semibold 
                                                text-red-600 transition hover:bg-red-600 hover:text-white"
                                            >
                                                <Trash2 size={17} />
                                                Delete Account
                                            </button>
                                        </div>

                                    </div>

                                </div>
                            )}

                            {/* PROFILE SETTING */}
                            {!isAccountOpen && (
                                <div>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setIsProfileOpen(!isProfileOpen)
                                        }
                                        className="flex items-center justify-between w-full 
                                        text-left p-3 rounded-lg hover:bg-gray-100 transition"
                                    >
                                        <span>Profile Setting</span>

                                        {isProfileOpen ? (
                                            <ChevronUp size={20} />
                                        ) : (
                                            <ChevronDown size={20} />
                                        )}
                                    </button>

                                    {isProfileOpen && (
                                        <div className="ml-4">

                                            {/* DASHBOARD SETTING */}
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setIsDashboardOpen(
                                                        !isDashboardOpen
                                                    )
                                                }
                                                className="flex items-center justify-between 
                                                w-full text-left p-3 rounded-lg hover:bg-gray-100 transition"
                                            >
                                                <span>
                                                    Dashboard Setting
                                                </span>

                                                {isDashboardOpen ? (
                                                    <ChevronUp size={20} />
                                                ) : (
                                                    <ChevronDown size={20} />
                                                )}
                                            </button>

                                            {isDashboardOpen && (
                                                <div className="ml-4">
                                                    <button className="block w-full text-left p-3 rounded-lg hover:bg-gray-100 transition">
                                                        Default Template
                                                    </button>

                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setIsOpen(false);
                                                            router.push("/dashboard/custom-template");
                                                        }}
                                                        className="block w-full text-left p-3 rounded-lg hover:bg-gray-100 transition"
                                                    >
                                                        Custom Template
                                                    </button>
                                                </div>
                                            )}

                                            {/* SECTION SETTING */}
                                            <button className="block w-full text-left p-3 rounded-lg hover:bg-gray-100 transition">
                                                Section Setting
                                            </button>

                                        </div>
                                    )}
                                </div>
                            )}

                        </div>
                    </div>
                </div>
            )}
        </>
    );
}