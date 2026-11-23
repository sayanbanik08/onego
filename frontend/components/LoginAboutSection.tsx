"use client";

import { useFitHeading } from "./useFitHeading";

export default function LoginAboutSection() {
  const headingRef = useFitHeading();

  return (
    <section
      className="relative isolate flex w-full flex-col overflow-hidden bg-black px-4 pb-0 text-white sm:px-8"
      aria-labelledby="login-about-title"
      style={{ fontFamily: "var(--font-comfortaa)" }}
    >
      <h2
        id="login-about-title"
        className="-mx-4 mt-[2cm] w-[calc(100%+2rem)] whitespace-nowrap text-center font-light leading-[1.05] tracking-normal text-[#E8E1D6] sm:-mx-8 sm:w-[calc(100%+4rem)]"
      >
        <span ref={headingRef} className="inline-block whitespace-nowrap">
          About us
        </span>
      </h2>

      <div className="-mx-4 mt-[2cm] grid w-[calc(100%+2rem)] grid-cols-3 gap-2 text-justify text-[clamp(6px,1.6vw,12px)] leading-[1.35] text-white/45 min-[480px]:gap-5 sm:-mx-8 sm:w-[calc(100%+4rem)] sm:gap-10">
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
      <p className="-mx-4 mt-[2cm] w-[calc(100%+2rem)] text-justify text-[clamp(6px,1.6vw,12px)] leading-[1.35] text-white/45 sm:-mx-8 sm:w-[calc(100%+4rem)]">
        onego makes it easier to create an online portfolio without writing code. 
        Build a space that presents your profile, education, skills, experience, 
        and other details in one place. Choose how your portfolio looks with customizable 
        templates, then arrange, edit, or remove sections to match your goals. Add your 
        own content and shape the layout through the Design Engine, using tools for text, 
        images, buttons, links, icons, cards, tables, timelines, progress displays, and more. 
        Save multiple designs and keep one template active for your public portfolio. 
        Your account gives you one portfolio with a searchable ID. You stay in control of 
        visibility: keep your profile public so visitors can view its details, or make it 
        private when you prefer not to share them. onego brings portfolio creation, design, 
        and profile settings together, helping students, professionals, and creators present 
        their work clearly. Start with the details you have, update them whenever you grow, 
        and build an online presence that feels like yours.
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
