"use client";

import { SignInButton } from "@clerk/nextjs";
import { ArrowRight, UserRound } from "lucide-react";

export default function LoginActions() {
  return (
    <div className="mt-8 flex w-full max-w-[380px] flex-col gap-4">
      {/* Button 1: Raised 3D Burgundy Clay Pill (No blur, no spread, no hover animation) */}
      <SignInButton mode="modal">
        <button
          type="button"
          className="relative flex h-[60px] w-full items-center gap-4 rounded-full px-6 text-[15.5px] font-medium text-[#ECD8CA] cursor-pointer"
          style={{
            background: "linear-gradient(180deg, #6c2332 0%, #5b1a26 55%, #4e1520 100%)",
            boxShadow: `
              inset 0 2px 0 rgba(255, 230, 236, 0.4),
              inset 0 -3px 0 rgba(20, 3, 7, 0.45),
              0 4px 0 rgba(60, 15, 25, 0.35)
            `,
          }}
        >
          <UserRound
            className="size-[21px] shrink-0 text-[#ECD8CA]"
            strokeWidth={2.1}
          />
          <span className="truncate">Login or create account</span>
          <ArrowRight
            className="ml-auto size-[21px] shrink-0 text-[#ECD8CA]"
            strokeWidth={2.1}
          />
        </button>
      </SignInButton>

      {/* Button 2: Sunken Neumorphic Cavity (No blur, no spread, no hover animation) */}
      <button
        type="button"
        className="relative flex h-[60px] w-full items-center gap-4 rounded-full px-6 text-[15.5px] font-medium text-[#5D1C28] cursor-pointer"
        style={{
          backgroundColor: "#E8DCC6",
          boxShadow: `
            inset 0 3px 0 rgba(55, 28, 22, 0.25),
            inset 0 -2px 0 rgba(255, 255, 255, 0.8)
          `,
        }}
      >
        <UserRound
          className="size-[21px] shrink-0 text-[#5D1C28]"
          strokeWidth={2.1}
        />
        <span className="truncate">Guest</span>
        <ArrowRight
          className="ml-auto size-[21px] shrink-0 text-[#5D1C28]"
          strokeWidth={2.1}
        />
      </button>
    </div>
  );
}