"use client";

import Image from "next/image";
import { useState } from "react";

interface ToolItem {
  id: number;
  name: string;
  category: string;
  desc: string;
  glow: string;
  icon: string;
}

const toolsData: ToolItem[] = [
  { id: 1,  name: "Wallet & Pay",  category: "Finance",      desc: "Identity & payment passport", glow: "#8A63F8", icon: "/tools/tool_01.png" },
  { id: 2,  name: "Focus Cat",     category: "Focus",        desc: "Smart timer & session logger", glow: "#3BA4F6", icon: "/tools/tool_02.png" },
  { id: 3,  name: "Busy Bee",      category: "Tasks",        desc: "Automated work queue & ping",  glow: "#F5A623", icon: "/tools/tool_03.png" },
  { id: 4,  name: "Geo Waypoint",  category: "Navigation",   desc: "Global location & spatial pins", glow: "#4A90E2", icon: "/tools/tool_04.png" },
  { id: 5,  name: "Studio 1D",     category: "Canvas",       desc: "Vector graphics & wireframes", glow: "#E0E0E0", icon: "/tools/tool_05.png" },
  { id: 6,  name: "Chrono Alert",  category: "Calendar",     desc: "Timezone & schedule engine",   glow: "#6C79FF", icon: "/tools/tool_06.png" },
  { id: 7,  name: "Sparkle Bot",   category: "Assistant",    desc: "Creative generative copilot", glow: "#FF6492", icon: "/tools/tool_07.png" },
  { id: 8,  name: "Gem Spark",     category: "Assets",       desc: "Component & sticker gallery", glow: "#A57BFF", icon: "/tools/tool_08.png" },
  { id: 9,  name: "Donut Mascot",  category: "Community",    desc: "Reputation & badge rewards",   glow: "#FF8A48", icon: "/tools/tool_09.png" },
  { id: 10, name: "Curio Query",   category: "Search",       desc: "Instant query & deep search",  glow: "#FFFFFF", icon: "/tools/tool_10.png" },
  { id: 11, name: "Path Flow",     category: "Pipelines",    desc: "Action triggers & node links", glow: "#FF6E40", icon: "/tools/tool_11.png" },
  { id: 12, name: "Badger Guard",  category: "Security",     desc: "End-to-end data encryption",   glow: "#78828A", icon: "/tools/tool_12.png" },
  { id: 13, name: "Day Notes",     category: "Notes",        desc: "Markdown daily diary & sync",  glow: "#B8E926", icon: "/tools/tool_13.png" },
  { id: 14, name: "Orbit Cloud",   category: "Storage",      desc: "Decentralized file hosting",   glow: "#2D5BFF", icon: "/tools/tool_14.png" },
  { id: 15, name: "Kaleido Ring",  category: "Design",       desc: "Dynamic color harmony generator", glow: "#34D399", icon: "/tools/tool_15.png" },
  { id: 16, name: "Loop Knot",     category: "Automation",   desc: "Background cron tasks & API", glow: "#A3E635", icon: "/tools/tool_16.png" },
  { id: 17, name: "Store Basket",  category: "Commerce",     desc: "Product catalog & checkout",   glow: "#38BDF8", icon: "/tools/tool_17.png" },
  { id: 18, name: "Badge Verified",category: "Domain",       desc: "Verified profile credential", glow: "#2563EB", icon: "/tools/tool_18.png" },
  { id: 19, name: "Whisper Wing",  category: "Publish",      desc: "Instant one-click deploy",     glow: "#60A5FA", icon: "/tools/tool_19.png" },
  { id: 20, name: "Star Comet",    category: "Insights",     desc: "Realtime traffic & visitor metrics", glow: "#C084FC", icon: "/tools/tool_20.png" },
];

export default function LoginToolsSection() {
  const [hoveredTool, setHoveredTool] = useState<ToolItem | null>(null);

  return (
    <section
      className="relative isolate flex w-full flex-col overflow-hidden bg-black pt-[2cm] pb-0 text-white"
      aria-labelledby="tools-section-title"
      style={{ fontFamily: "var(--font-comfortaa)" }}
    >
      {/* ── Massive Heading (matches About us & Login) ── */}
      <h2
        id="tools-section-title"
        className="w-full whitespace-nowrap text-center text-[clamp(3rem,24vw,28rem)] font-light leading-[1.05] tracking-[-0.075em]"
      >
        Tools
      </h2>

      {/* ── Subtitle: & shortcuts (from reference) ── */}
      <p className="-mt-2 w-full text-center text-[clamp(1.2rem,3.8vw,2.4rem)] font-normal tracking-tight text-white/80 sm:-mt-4">
        &amp; shortcuts
      </p>

      {/* ═════════════════════════════════════════════════════════════════
          MOBILE VIEW (< 640px):
          Exact 4x5 icon grid touching left and right screen edges!
         ═════════════════════════════════════════════════════════════════ */}
      <div className="mt-10 block w-full px-0 sm:hidden">
        <div className="grid w-full grid-cols-4 gap-1.5">
          {toolsData.map((tool) => (
            <div
              key={tool.id}
              className="group relative flex aspect-square w-full items-center justify-center overflow-hidden border border-white/10 bg-[#121212] shadow-[0_4px_16px_rgba(0,0,0,0.5)] transition-transform duration-200 active:scale-95"
            >
              <Image
                src={tool.icon}
                alt={tool.name}
                fill
                sizes="85px"
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </div>

      {/* ═════════════════════════════════════════════════════════════════
          BIGGER SCREEN VIEW (>= 640px, Tablet & Desktop):
          Expanded grid touching left and right screen edges 100%!
         ═════════════════════════════════════════════════════════════════ */}
      <div className="mt-14 hidden w-full px-0 sm:block">
        <div className="grid w-full grid-cols-2 gap-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-5">
          {toolsData.map((tool) => {
            const isHovered = hoveredTool?.id === tool.id;

            return (
              <div
                key={tool.id}
                onMouseEnter={() => setHoveredTool(tool)}
                onMouseLeave={() => setHoveredTool(null)}
                className="group relative flex flex-col justify-between overflow-hidden border border-white/10 bg-white/[0.03] p-4 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-white/25 hover:bg-white/[0.06] hover:shadow-[0_12px_36px_rgba(0,0,0,0.7)]"
              >
                {/* Subtle colored backlight glow matching icon */}
                <div
                  className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 blur-2xl transition-opacity duration-300"
                  style={{
                    backgroundColor: tool.glow,
                    opacity: isHovered ? 0.35 : 0.08,
                  }}
                />

                {/* Top row: Icon + Serial number badge */}
                <div className="relative z-10 flex items-start justify-between">
                  <div className="relative aspect-square w-16 overflow-hidden border border-white/15 bg-black/60 shadow-[0_6px_20px_rgba(0,0,0,0.45)] transition-transform duration-300 group-hover:scale-110">
                    <Image
                      src={tool.icon}
                      alt={tool.name}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  </div>

                  <span className="border border-white/15 bg-white/5 px-2.5 py-1 font-mono text-[12px] font-semibold tracking-wider text-white/70 transition-colors group-hover:border-white/35 group-hover:text-white">
                    {String(tool.id).padStart(2, "0")}
                  </span>
                </div>

                {/* Bottom row: Tool name + Description */}
                <div className="relative z-10 mt-5">
                  <p className="text-base font-semibold tracking-tight text-white transition-colors group-hover:text-white">
                    {tool.name}
                  </p>
                  <p className="mt-1 line-clamp-1 text-xs leading-relaxed text-white/50">
                    {tool.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Justified content text below the grid (matches About us style) ── */}
      <p className="mt-[2cm] w-full px-0 text-justify text-[clamp(6px,1.6vw,12px)] leading-[1.35] text-white/90">
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

      {/* ── Thin horizontal divider to separate footer ── */}
      <hr className="mt-[2cm] w-full border-0 border-t border-white/20" />
    </section>
  );
}
