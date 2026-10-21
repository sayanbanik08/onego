"use client";

import { SignInButton } from "@clerk/nextjs";

export default function LoginActions() {
  return (
    <div className="-mt-2 flex w-full flex-col gap-0.3">
      {/* Button 1: Login — image has transparent padding so we expand width to compensate */}
      <SignInButton mode="modal">
        <button
          type="button"
          aria-label="Login or create account"
          className="relative -ml-8 block h-auto w-[calc(100%+55px)] cursor-pointer border-0 bg-transparent p-0"
          style={{
            backgroundImage: "url('/login-button-new.png')",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            backgroundSize: "100% auto",
            aspectRatio: "1024 / 260",
            filter:
              "drop-shadow(2px 1px 1px rgba(16, 16, 16, 0.55)) drop-shadow(0 -1px 1px rgba(24, 24, 24, 0.4)) drop-shadow(3px 5px 2px rgb(1, 1, 1)) drop-shadow(-3px 5px 2px rgb(60, 59, 59))",
          }}
        />
      </SignInButton>

      {/* Button 2: Guest — image content is near edge-to-edge, so we match the VISUAL width of button 1 */}
      {/* Login visual pill ≈ 86% of image width. Guest visual pill ≈ 96% of image width.            */}
      {/* To match: guest element width = login_element_width * (86/96) ≈ same visual pill size       */}
      <button
        type="button"
        aria-label="Guest"
        className="relative -ml-4 block h-auto w-[calc(100%+25px)] cursor-pointer border-0 bg-transparent p-0"
        style={{
          backgroundImage: "url('/guest-button-bg.png')",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundSize: "100% auto",
          aspectRatio: "1024 / 225",
        }}
      />
    </div>
  );
}