import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import LoginFooter from "@/components/LoginFooter";
import LoginActions from "@/components/LoginActions";
import LoginSmoothScroll from "@/components/LoginSmoothScroll";
import LoginCursor from "@/components/LoginCursor";
import {
  BriefcaseBusiness,
  Code2,
  FolderOpen,
  GraduationCap,
  Image as ImageIcon,
  PanelsTopLeft,
  Search,
  Settings2,
  ShieldCheck,
  Type,
  UserRound,
} from "lucide-react";

export default async function Home() {
  const { isAuthenticated } = await auth();

  // agar mera user already logged in hain tab dashboard pr bhej dena.
  if (isAuthenticated) {
    redirect("/dashboard"); // dashboard pe bheja ja raha h.
  }

  return (
    <LoginSmoothScroll>
      <>
        <main className="relative mx-auto min-h-screen w-full max-w-[1315px] overflow-x-clip bg-[#722F37] text-[#722F37]">
          {/* The cream panel curves over the burgundy header like the footer. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 z-0 h-9 bg-[#722F37]"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 top-9 z-[1] overflow-hidden rounded-t-[6rem] bg-[#E8DCC6]"
          >
            <svg
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 size-full"
              viewBox="0 0 1200 900"
              preserveAspectRatio="none"
            >
              <g fill="none" stroke="#722F37" strokeLinecap="round" strokeOpacity="0.11" strokeWidth="1.25">
                <path d="M-30 72 C180 67 360 79 585 70 S990 77 1230 68 M-30 170 C190 178 380 160 600 171 S1010 164 1230 176 M-30 269 C180 261 390 278 610 266 S1000 276 1230 263 M-30 369 C210 377 395 357 605 371 S990 361 1230 376 M-30 469 C190 460 380 479 590 465 S1010 478 1230 462 M-30 570 C200 578 400 558 610 572 S1000 560 1230 577 M-30 670 C190 661 390 680 600 667 S990 678 1230 664 M-30 770 C210 779 390 759 605 773 S1000 761 1230 778 M-30 870 C190 861 400 880 610 866 S1000 878 1230 863" />
                <path d="M70 -30 C76 160 62 320 74 470 S65 730 78 930 M170 -30 C161 170 181 320 168 480 S178 730 165 930 M270 -30 C279 170 259 330 274 490 S262 740 278 930 M370 -30 C361 160 380 330 367 480 S378 730 364 930 M470 -30 C481 180 461 330 475 490 S464 730 480 930 M570 -30 C560 170 581 320 567 480 S579 740 564 930 M670 -30 C681 160 660 330 675 490 S663 730 680 930 M770 -30 C759 180 781 330 767 480 S779 740 764 930 M870 -30 C880 160 860 320 875 490 S862 730 879 930 M970 -30 C960 170 981 330 967 480 S979 740 964 930 M1070 -30 C1081 160 1060 330 1075 490 S1063 730 1080 930 M1170 -30 C1160 170 1181 320 1167 480 S1179 740 1164 930" />
              </g>
            </svg>
          </div>
          <div className="pointer-events-none absolute -bottom-64 -right-40 z-[2] h-[34rem] w-[34rem] rounded-full border border-[#B7AB9A]/60" />

          {/* py-1 keeps the header around 36px tall, aligned with the panel inset. */}
          <header className="relative z-10 flex w-full items-center justify-between px-6 py-1 text-[#E8DCC6] sm:px-10 lg:px-14">
            <div aria-hidden="true" className="flex items-center gap-2">
              <span className="size-3 rounded-full border border-black/10 bg-[#FF5F57]" />
              <span className="size-3 rounded-full border border-black/10 bg-[#FEBC2E]" />
              <span className="size-3 rounded-full border border-black/10 bg-[#28C840]" />
            </div>
            <Link href="/" className="flex items-center gap-2.5" aria-label="OneGo home">
              <span className="text-[1.35rem] font-bold tracking-tight">OneGo</span>
            </Link>
          </header>

          <section className="relative sticky top-4 lg:top-8 z-10 mx-auto grid min-h-[calc(100vh-64px)] w-full min-w-0 max-w-7xl items-center gap-12 px-6 pb-12 pt-4 sm:px-10 lg:grid-cols-[1.08fr_0.92fr] lg:gap-16 lg:px-14 lg:pb-16 lg:pt-0">
            {/* ========================================================================= */}
            {/* [ELEMENT 1: DESIGN CANVAS - START] */}
            {/* Yeh left side ka Design Canvas / Visual Showcase hai (id="build" & id="showcase"). */}
            {/* Isme portfolio card mockup, floating icons (Type, Image, Colors) aur security badge hai. */}
            {/* ========================================================================= */}
            <div id="build" className="relative flex min-h-[430px] min-w-0 flex-col justify-center lg:min-h-[590px] lg:translate-y-20">
              <div className="login-art-scroll relative mx-auto mt-8 h-[290px] w-full max-w-[610px] sm:mt-5 sm:h-[390px]" id="showcase">
                <div className="pointer-events-none absolute inset-[-2%_0%_0%_-5%] rotate-[-8deg] rounded-[43%_57%_52%_48%/46%_41%_59%_54%] bg-[#B7AB9A]/30" />
                <div className="pointer-events-none absolute left-[4%] top-[20%] h-[66%] w-[72%] rotate-[13deg] rounded-[48%_52%_58%_42%/55%_39%_61%_45%] bg-[#722F37]/[0.08] blur-xl" />
                <div className="pointer-events-none absolute left-[1%] top-[35%] h-[48%] w-[43%] rotate-[14deg] rounded-[44%_56%_64%_36%/43%_55%_45%_57%] bg-[#B7AB9A]/30" />
                <div className="pointer-events-none absolute left-[40%] top-[5%] h-[57%] w-[48%] rotate-[-18deg] rounded-[55%_45%_38%_62%/44%_59%_41%_56%] bg-[#B7AB9A]/25" />
                <div className="pointer-events-none absolute left-[8%] top-[12%] h-[72%] w-[76%] rotate-[-13deg] rounded-[50%] border border-[#B7AB9A]/40" />
                <div className="pointer-events-none absolute left-[2%] top-[17%] size-1 rounded-full bg-[#722F37]/35 shadow-[14px_10px_0_0_#B7AB9A,28px_1px_0_0_#722F37]" />
                <div className="absolute left-[9%] top-[10%] h-[78%] w-[79%] rotate-[-5deg] rounded-[1.4rem] bg-[#B7AB9A]/30" />
                <div className="absolute left-[7%] top-[8%] h-[78%] w-[79%] rotate-[-5deg] rounded-[1.2rem] border border-[#B7AB9A]/70 bg-[#E8DCC6] p-3 shadow-xl shadow-[#722F37]/10 sm:p-4">
                  <div className="flex h-full overflow-hidden rounded-lg border border-[#B7AB9A]/55 bg-[#E8DCC6]">
                    <aside className="flex w-12 shrink-0 flex-col items-center gap-5 border-r border-[#B7AB9A]/50 py-4 text-[#722F37]/75 sm:w-14 sm:gap-6">
                      <span className="grid size-7 place-items-center rounded-full bg-[#B7AB9A]/50 text-[#722F37]"><UserRound size={15} /></span>
                      <PanelsTopLeft size={15} />
                      <BriefcaseBusiness size={15} />
                      <GraduationCap size={15} />
                      <Code2 size={15} />
                    </aside>
                    <div className="min-w-0 flex-1 p-3 sm:p-5">
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex h-8 min-w-0 flex-1 items-center gap-2 rounded-full bg-[#B7AB9A]/25 px-3 text-[10px] text-[#722F37]/70 sm:max-w-56 sm:text-xs">
                          <Search size={13} /> <span className="truncate">Search by id</span>
                        </div>
                        <Settings2 size={16} />
                      </div>
                      <div className="mt-5 grid grid-cols-[0.9fr_1.1fr] items-center gap-3 sm:mt-7 sm:gap-4">
                        <div className="relative h-20 overflow-hidden rounded-lg bg-[#B7AB9A]/65 sm:h-28">
                          <div className="absolute -bottom-5 left-1 h-16 w-28 rotate-[-15deg] rounded-full bg-[#722F37]/65" />
                          <div className="absolute -bottom-7 right-0 h-20 w-24 rotate-[18deg] rounded-full bg-[#722F37]/35" />
                        </div>
                        <div>
                          <p className="text-[11px] font-bold leading-tight sm:text-sm">Turning ideas<br />into reality</p>
                          <div className="mt-2 space-y-1.5">
                            <div className="h-1.5 w-full rounded-full bg-[#B7AB9A]/55" />
                            <div className="h-1.5 w-4/5 rounded-full bg-[#B7AB9A]/55" />
                            <div className="h-1.5 w-3/5 rounded-full bg-[#B7AB9A]/55" />
                          </div>
                        </div>
                      </div>
                      <div className="mt-5 grid grid-cols-4 gap-2 sm:mt-7 sm:gap-3">
                        {[UserRound, GraduationCap, Code2, FolderOpen].map((Icon, index) => (
                          <div key={index} className="grid aspect-square place-items-center rounded-lg bg-[#B7AB9A]/25 text-[#722F37]/80">
                            <Icon size={17} />
                          </div>
                        ))}
                      </div>
                      <div className="mt-5 space-y-2 sm:mt-6">
                        <div className="h-1.5 w-4/5 rounded-full bg-[#B7AB9A]/55" />
                        <div className="h-1.5 w-full rounded-full bg-[#B7AB9A]/55" />
                        <div className="h-1.5 w-2/3 rounded-full bg-[#B7AB9A]/55" />
                      </div>
                    </div>
                  </div>
                </div>

                <div id="customize" className="absolute left-0 top-[39%] grid size-16 rotate-[-9deg] place-items-center rounded-xl border border-[#B7AB9A]/60 bg-[#E8DCC6] shadow-lg shadow-[#722F37]/10 sm:size-20">
                  <Type size={27} strokeWidth={2.5} />
                </div>
                <div className="absolute right-[3%] top-[1%] grid size-16 rotate-[9deg] place-items-center rounded-xl border border-[#B7AB9A]/60 bg-[#E8DCC6] shadow-lg shadow-[#722F37]/10 sm:right-[5%] sm:size-20">
                  <ImageIcon size={27} strokeWidth={2.2} />
                </div>
                <div className="absolute bottom-[2%] right-[1%] flex rotate-[-4deg] items-center gap-2 rounded-xl border border-[#B7AB9A]/60 bg-[#E8DCC6] px-3 py-3 shadow-lg shadow-[#722F37]/10 sm:bottom-0 sm:right-[4%] sm:px-4">
                  {["#722F37", "#B7AB9A", "#E8DCC6"].map((color) => (
                    <span key={color} className="size-4 rounded-full border border-[#722F37]/35 sm:size-5" style={{ backgroundColor: color }} />
                  ))}
                </div>
              </div>

              <div className="login-badge-scroll mt-10 flex items-center gap-3 pt-4 text-xs sm:mt-12">
                <ShieldCheck size={18} />
                <div>
                  <p className="font-semibold">Secure &amp; Trusted</p>
                  <p className="mt-0.5 text-[#722F37]/65">Your data is safe with us.</p>
                </div>
              </div>
            </div>
            {/* [ELEMENT 1: DESIGN CANVAS - END] */}

            {/* ========================================================================= */}
            {/* [ELEMENT 2: LOGIN MODULE - START] */}
            {/* Yeh right side ka Login Module / Actions section hai (class: login-copy-scroll). */}
            {/* Isme 'Welcome to OneGo' title, tagline aur <LoginActions /> (Clerk login & guest button) hain. */}
            {/* ========================================================================= */}
            <div className="login-copy-scroll flex min-w-0 justify-center lg:justify-end">
              <div className="w-full min-w-0 max-w-[400px] py-10 text-center lg:py-0 lg:text-left">
                <p className="text-xs font-semibold uppercase text-[#722F37]/60">Welcome to</p>
                <h2 className="mt-2 text-6xl font-bold leading-none sm:text-7xl">
                  <span className="inline-block origin-center scale-x-[1.5] scale-y-[1.22] lg:origin-left">OneGo</span>
                </h2>
                <p className="mx-auto mt-5 max-w-sm text-base leading-7 text-[#722F37]/70 sm:text-lg lg:mx-0">
                  Create or log in to continue your journey.
                </p>
                <LoginActions />
              </div>
            </div>
            {/* [ELEMENT 2: LOGIN MODULE - END] */}
          </section>
        </main>
        <LoginFooter />
        <LoginCursor />
      </>
    </LoginSmoothScroll>
  );
}


// app/(auth)/login/page.tsx ← Login/Create Account(login page ka sara code)