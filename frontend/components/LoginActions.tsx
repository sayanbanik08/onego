"use client";

import { SignInButton } from "@clerk/nextjs";
import { useState } from "react";
import { ArrowRight, UserRound } from "lucide-react";

export default function LoginActions() {
  const [activeAction, setActiveAction] = useState<"login" | "guest">("login");

  return (
    <div className="relative isolate mx-auto mt-8 flex w-full max-w-[360px] flex-col gap-2 lg:mx-0">
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute inset-x-0 top-0 -z-10 h-14 bg-[#722F37] transition-transform duration-500 ease-out motion-reduce:transition-none ${activeAction === "guest" ? "translate-y-16" : ""}`}
      />
      <SignInButton mode="modal">
        <button
          type="button"
          aria-pressed={activeAction === "login"}
          onClick={() => setActiveAction("login")}
          className={`flex h-14 w-full items-center gap-4 px-6 text-sm font-semibold transition-[color,background-color,transform] duration-300 active:scale-[0.98] sm:text-base ${activeAction === "login" ? "text-[#E8DCC6]" : "text-[#722F37] hover:bg-white/20"}`}
        >
          <UserRound size={19} />
          <span>Login or create account</span>
          <ArrowRight size={19} className="ml-auto" />
        </button>
      </SignInButton>
      <button
        type="button"
        aria-pressed={activeAction === "guest"}
        onClick={() => setActiveAction("guest")}
        className={`flex h-14 w-full items-center gap-4 px-6 text-sm font-semibold transition-[color,background-color,transform] duration-300 active:scale-[0.98] sm:text-base ${activeAction === "guest" ? "text-[#E8DCC6]" : "text-[#722F37] hover:bg-white/20"}`}
      >
        <UserRound size={18} />
        <span>Guest</span>
        <ArrowRight size={19} className="ml-auto" />
      </button>
    </div>
  );
}