"use client";

export default function LoginAboutSection() {
  return (
    <section
      className="relative isolate flex w-full flex-col overflow-hidden bg-black px-4 pb-[2cm] text-white sm:px-8"
      aria-labelledby="login-about-title"
      style={{ fontFamily: "var(--font-comfortaa)" }}
    >
      <h2
        id="login-about-title"
        className="-mx-4 mt-[2cm] w-[calc(100%+2rem)] whitespace-nowrap text-center text-[clamp(3rem,24vw,28rem)] font-light leading-[1.05] tracking-[-0.075em] sm:-mx-8 sm:w-[calc(100%+4rem)]"
      >
        About us
      </h2>

      <div className="-mx-4 mt-[2cm] grid w-[calc(100%+2rem)] grid-cols-3 gap-2 text-justify text-[clamp(6px,1.6vw,12px)] leading-[1.35] text-white/90 min-[480px]:gap-5 sm:-mx-8 sm:w-[calc(100%+4rem)] sm:gap-10">
        <p className="w-full max-w-[280px] justify-self-start">
          OneGo brings your work, story, and ambitions together in one place.
          Build a profile that feels like you, and let every detail tell part of your story.
        </p>
        <p className="mt-8 w-full max-w-[280px] justify-self-center min-[480px]:mt-20 sm:mt-16">
          From your first project to your next big move, shape a thoughtful online presence
          that grows with everything you create.
        </p>
        <p className="w-full max-w-[280px] justify-self-end">
          Gather what matters. Share it clearly. Connect with the people who are ready to
          discover your work.
        </p>
      </div>

      {/* Reference video — replaces the CSS carousel */}
      <div className="-mx-16 mt-[2cm] w-[calc(100%+8rem)] sm:-mx-32 sm:w-[calc(100%+16rem)] lg:-mx-[20vw] lg:w-[calc(100%+40vw)]">
        <video
          src="/about-us-reference.mp4"
          autoPlay
          loop
          muted
          playsInline
          aria-label="OneGo creative showcase"
          className="block h-auto w-full object-cover"
        />
      </div>
      <p className="-mx-4 mt-[2cm] w-[calc(100%+2rem)] text-justify text-[clamp(6px,1.6vw,12px)] leading-[1.35] text-white/90 sm:-mx-8 sm:w-[calc(100%+4rem)]">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
        velit esse cillum dolore eu fugiat nulla pariatur. reprehenderit
        reprehenderit.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
        velit esse cillum dolore eu fugiat nulla pariatur. reprehenderit
        reprehenderit.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
        velit esse cillum dolore eu fugiat nulla pariatur. reprehenderit
        reprehenderit.
      </p>

      <div className="-mx-16 mt-[2cm] w-[calc(100%+8rem)] sm:-mx-32 sm:w-[calc(100%+16rem)] lg:-mx-[20vw] lg:w-[calc(100%+40vw)]">
        <video
          src="/about-us-content-02.mp4"
          autoPlay
          loop
          muted
          playsInline
          aria-label="OneGo music showcase"
          className="block h-auto w-full object-cover"
        />
      </div>
    </section>
  );
}
