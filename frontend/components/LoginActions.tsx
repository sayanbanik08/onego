"use client";

import { SignInButton } from "@clerk/nextjs";

export default function LoginActions() {
  return (
    <div className="mt-8 flex w-full max-w-[380px] flex-col gap-4">
      {/* Button 1: Supplied artwork with the sign-in action preserved */}
      <SignInButton mode="modal">
        <button
          type="button"
          aria-label="Login or create account"
          className="relative block h-[clamp(44px,15.8vw,60px)] w-full cursor-pointer border-0 bg-transparent p-0"
          style={{
            backgroundImage: "url('/login-button-bg.png')",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            backgroundSize: "100% auto",
          }}
        />
      </SignInButton>

      {/* Button 2: Supplied guest artwork */}
      <button
        type="button"
        aria-label="Guest"
        className="relative block h-[clamp(44px,15.8vw,60px)] w-full cursor-pointer border-0 bg-transparent p-0"
        style={{
          backgroundImage: "url('/guest-button-bg.png')",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundSize: "100% auto",
        }}
      />
    </div>
  );
}