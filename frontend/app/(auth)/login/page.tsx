import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Image from "next/image";
import LoginFooter from "@/components/LoginFooter";
import LoginHeader3D from "@/components/LoginHeader3D";
import LoginActions from "@/components/LoginActions";
import OneGo3DLogo from "@/components/OneGo3DLogo";
import LoginSmoothScroll from "@/components/LoginSmoothScroll";
import LoginCursor from "@/components/LoginCursor";
export default async function Home() {
  const { isAuthenticated } = await auth();

  // agar mera user already logged in hain tab dashboard pr bhej dena.
  if (isAuthenticated) {
    redirect("/dashboard"); // dashboard pe bheja ja raha h.
  }

  return (
    <LoginSmoothScroll>
      <>
        {/* 3D Realistic Header Shelf */}
        <LoginHeader3D />

        <main className="relative -mt-9 mx-auto min-h-screen w-full overflow-x-clip bg-[#722F37] text-[#722F37]">
          {/* Cream background panel spanning the card with subtle grid lines */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-0 overflow-hidden bg-[#E8DCC6]"
          >
            <svg
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 size-full"
              viewBox="0 0 1200 900"
              preserveAspectRatio="none"
            >
              <g fill="none" stroke="#722F37" strokeLinecap="round" strokeOpacity="0.07" strokeWidth="1.25">
                <path d="M-30 72 C180 67 360 79 585 70 S990 77 1230 68 M-30 170 C190 178 380 160 600 171 S1010 164 1230 176 M-30 269 C180 261 390 278 610 266 S1000 276 1230 263 M-30 369 C210 377 395 357 605 371 S990 361 1230 376 M-30 469 C190 460 380 479 590 465 S1010 478 1230 462 M-30 570 C200 578 400 558 610 572 S1000 560 1230 577 M-30 670 C190 661 390 680 600 667 S990 678 1230 664 M-30 770 C210 779 390 759 605 773 S1000 761 1230 778 M-30 870 C190 861 400 880 610 866 S1000 878 1230 863" />
                <path d="M70 -30 C76 160 62 320 74 470 S65 730 78 930 M170 -30 C161 170 181 320 168 480 S178 730 165 930 M270 -30 C279 170 259 330 274 490 S262 740 278 930 M370 -30 C361 160 380 330 367 480 S378 730 364 930 M470 -30 C481 180 461 330 475 490 S464 730 480 930 M570 -30 C560 170 581 320 567 480 S579 740 564 930 M670 -30 C681 160 660 330 675 490 S663 730 680 930 M770 -30 C759 180 781 330 767 480 S779 740 764 930 M870 -30 C880 160 860 320 875 490 S862 730 879 930 M970 -30 C960 170 981 330 967 480 S979 740 964 930 M1070 -30 C1081 160 1060 330 1075 490 S1063 730 1080 930 M1170 -30 C1160 170 1181 320 1167 480 S1179 740 1164 930" />
              </g>
            </svg>
          </div>
          <div
            id="login-section-top-blur"
            aria-hidden="true"
            className="login-section-top-blur pointer-events-none fixed inset-x-0 top-9 z-[11] h-16 bg-gradient-to-b from-[#E8DCC6]/15 to-transparent opacity-0 backdrop-blur-[10px] transition-opacity duration-200"
          />
          <div className="pointer-events-none absolute -bottom-64 -right-40 z-[2] h-[34rem] w-[34rem] rounded-full border border-[#B7AB9A]/60" />

          <section className="relative lg:sticky lg:top-9 z-10 mx-auto min-h-[calc(100vh-64px)] w-full min-w-0 max-w-7xl items-center px-6 pb-28 sm:pb-36 lg:pb-24 pt-20 sm:pt-32 lg:pt-0 sm:px-10 lg:px-14">
            <div className="login-unified-scroll relative grid w-full min-w-0 items-center gap-10 sm:gap-32 lg:grid-cols-[1.08fr_0.92fr] lg:gap-16">
              {/* ========================================================================= */}
              {/* [ELEMENT 1: ELLIPSE BACKGROUND - START] */}
              {/* Abstract ellipse shapes behind the login module. */}
              {/* ========================================================================= */}
              <div id="build" className="relative flex min-h-0 min-w-0 flex-col justify-center lg:min-h-[590px] lg:translate-y-10">
                <div className="relative mx-auto mt-1 h-[240px] w-full max-w-[610px] sm:mt-3 sm:h-[390px] lg:mt-5" id="showcase">
                  <div className="pointer-events-none absolute inset-[8%_11%_15%_6.5%] rotate-[-8deg] rounded-[43%_57%_52%_48%/46%_41%_59%_54%] bg-gradient-to-b from-[#D8BCA2]/35 via-[#D8BCA2]/20 to-[#E8DCC6] lg:translate-x-[clamp(-77px,_calc(268.5px_-_27vw),_-8px)] lg:translate-y-4 lg:scale-[1.03]" />
                  <div className="pointer-events-none absolute left-[13%] top-[30%] h-[46%] w-[52%] rotate-[13deg] rounded-[48%_52%_58%_42%/55%_39%_61%_45%] bg-gradient-to-b from-[#D8BCA2]/20 to-[#E8DCC6] blur-xl lg:translate-x-[clamp(-77px,_calc(268.5px_-_27vw),_-8px)] lg:translate-y-4 lg:scale-[1.03]" />
                  <svg aria-hidden="true" className="pointer-events-none absolute size-0">
                    <filter
                      id="design-pad-shadow"
                      x="-30%"
                      y="-30%"
                      width="160%"
                      height="160%"
                      primitiveUnits="userSpaceOnUse"
                    >
                      <feMorphology in="SourceAlpha" operator="dilate"  result="spread" />
                      <feGaussianBlur in="spread" stdDeviation="20" result="blur" />
                      <feOffset in="blur" dx="-10" dy="20" result="offset-blur" />
                      <feFlood floodColor="#361a00" floodOpacity="0.28" result="shadow-color" />
                      <feComposite in="#E8DCC6" in2="offset-blur" operator="in" result="shadow" />
                      <feMerge>
                        <feMergeNode in="shadow" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                  </svg>
                  <Image
                    src="/login-design-pad-v2.png"
                    alt="3D portfolio design pad preview"
                    width={960}
                    height={720}
                    className="pointer-events-none absolute left-1/2 top-[calc(50%+16px)] z-10 h-auto w-[97%] max-w-[540px] -translate-x-1/2 -translate-y-1/2 lg:left-[calc(50%+clamp(-77px,_268.5px_-_27vw,_-8px))] lg:origin-right lg:scale-x-[0.95] lg:scale-y-[1.03]"
                    style={{ filter: "url(#design-pad-shadow)" }}
                    priority
                  />
                </div>
              </div>
              {/* [ELEMENT 1: ELLIPSE BACKGROUND - END] */}

              <div id="login-paintbrush" className="pointer-events-none relative z-20 mx-auto flex h-[28vw] max-h-[260px] w-full max-lg:translate-y-8 items-center justify-center lg:fixed lg:left-1/2 lg:top-[calc(50%+75px)] lg:h-auto lg:w-[360px] lg:-translate-x-1/2 lg:-translate-y-1/2">
                <Image
                  src="/login-paintbrush.png"
                  alt="Colorful paintbrush"
                  width={768}
                  height={1024}
                  className="h-auto w-[75vw] max-w-[720px] rotate-90 lg:h-[540px] lg:w-auto lg:rotate-0 lg:scale-x-[1.4]"
                  style={{
                    filter: "drop-shadow(-12px 8px 6px #361a00)",
                  }}
                  priority
                />
              </div>

              {/* ========================================================================= */}
              {/* [ELEMENT 2: LOGIN MODULE - START] */}
              {/* Yeh right side ka Login Module / Actions section hai. */}
              {/* Isme 'Welcome to OneGo' title, tagline aur <LoginActions /> (Clerk login & guest button) hain. */}
              {/* ========================================================================= */}
              <div id="login-module-content" className="login-module-content mt-20 flex min-w-0 -translate-y-14 justify-center sm:-translate-y-10 lg:mt-10 lg:translate-x-[-42px] lg:translate-y-6 lg:justify-end origin-bottom">
                <div className="w-full min-w-0 max-w-[390px] py-4 sm:py-6 text-left lg:py-0">
                  {/* Dynamic 3D Clay Logo - Comfortaa Font (text="onego" ya koi bhi text change kar sakte hain) */}
                  <div className="mx-auto -mt-2 w-full max-w-[490px] sm:mx-0 sm:-ml-15 sm:w-[560px]">
                    <OneGo3DLogo text="onego" className="max-w-[490px]" />
                  </div>
                  <div className="-mt-3 w-full max-w-[380px]">
                    <p className="-ml-0.2 w-[calc(100%+100px)] whitespace-nowrap text-[clamp(12px,4.1vw,18px)] leading-relaxed text-[#76615A] font-normal sm:text-[clamp(10px,2.2vw,17.7px)]" style={{ fontFamily: "var(--font-comfortaa)" }}>
                      Create or log in to continue your journey.
                    </p>
                  </div>
                  <LoginActions />
                </div>
              </div>
              {/* [ELEMENT 2: LOGIN MODULE - END] */}
            </div>
          </section>
        </main>
        <LoginFooter />
        <LoginCursor />
      </>
    </LoginSmoothScroll>
  );
}


// app/(auth)/login/page.tsx ← Login/Create Account(login page ka sara code0