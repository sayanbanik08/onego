import { TimelineItem, TimelineTheme } from "../../types/timeline";

export const EDUCATION_TEMPLATE: TimelineItem[] = [
    {
        id: "edu-1",
        title: "B.Tech in Computer Science & Engineering",
        subtitle: "Institute of Technology & Science",
        date: "2020 - 2024",
        description: "Specialized in Distributed Systems and Cloud Computing. Graduated with Honors (CGPA: 8.9/10). Led the Google Developer Student Club.",
        tag: "Bachelor's Degree",
        icon: "graduation",
    },
    {
        id: "edu-2",
        title: "Higher Secondary Certificate (Science)",
        subtitle: "St. Xavier's Senior Secondary School",
        date: "2018 - 2020",
        description: "Majored in Physics, Chemistry, and Advanced Mathematics. Scored 94.6% in Board Examination.",
        tag: "High School",
        icon: "graduation",
    },
    {
        id: "edu-3",
        title: "Cloud & DevOps Professional Certificate",
        subtitle: "AWS & Kubernetes Foundation",
        date: "2023",
        description: "Hands-on certification covering cloud infrastructure, container orchestration, microservices, and CI/CD pipelines.",
        tag: "Certification",
        icon: "code",
    },
];

export const EXPERIENCE_TEMPLATE: TimelineItem[] = [
    {
        id: "exp-1",
        title: "Senior Full-Stack Engineer",
        subtitle: "HyperScale Tech Solutions",
        date: "2023 - Present",
        description: "Architected modern design engine & canvas workspace. Scaled real-time collaboration pipeline reducing latency by 45%.",
        tag: "Full-Time",
        icon: "briefcase",
    },
    {
        id: "exp-2",
        title: "Frontend Developer",
        subtitle: "Nexus Creative Labs",
        date: "2022 - 2023",
        description: "Developed interactive dashboards, responsive user interfaces, and automated design system component libraries using Next.js & Tailwind.",
        tag: "Full-Time",
        icon: "code",
    },
    {
        id: "exp-3",
        title: "Software Engineering Intern",
        subtitle: "CloudCore Systems",
        date: "2021 - 2022",
        description: "Built RESTful APIs and optimized SQL database queries for mission-critical analytics services.",
        tag: "Internship",
        icon: "rocket",
    },
];

export const ACHIEVEMENTS_TEMPLATE: TimelineItem[] = [
    {
        id: "ach-1",
        title: "1st Prize - Global AI & Design Hackathon",
        subtitle: "International Open Innovate Summit",
        date: "Nov 2024",
        description: "Built an autonomous canvas design agent powered by Gemini AI, winning out of 3,500+ global participants.",
        tag: "Grand Champion",
        icon: "trophy",
    },
    {
        id: "ach-2",
        title: "Top Open-Source Contributor Award",
        subtitle: "GitHub Community Stars",
        date: "Aug 2024",
        description: "Authored high-performance canvas rendering utilities adopted by over 20,000 developers worldwide.",
        tag: "Recognition",
        icon: "star",
    },
    {
        id: "ach-3",
        title: "Best Product Innovation of the Year",
        subtitle: "TechNext Annual Showcase",
        date: "Jan 2024",
        description: "Selected as top student innovation project for developing next-generation visual design workflows.",
        tag: "Award",
        icon: "trophy",
    },
];

export const ROADMAP_TEMPLATE: TimelineItem[] = [
    {
        id: "rd-1",
        title: "Phase 1: Architecture & Prototyping",
        subtitle: "Core Engine Setup",
        date: "Q1 2025",
        description: "Establish canvas state management, element tree, vector rendering layers, and eraser masking pipeline.",
        tag: "Completed",
        icon: "check",
    },
    {
        id: "rd-2",
        title: "Phase 2: High-Performance Animations",
        subtitle: "UI & Aesthetics Upgrade",
        date: "Q2 2025",
        description: "Integrate micro-animations, customizable timelines, multi-theme presets, and responsive typography.",
        tag: "In Progress",
        icon: "rocket",
    },
    {
        id: "rd-3",
        title: "Phase 3: Global Production Release",
        subtitle: "Cloud Sync & Export",
        date: "Q3 2025",
        description: "High-resolution SVG/PNG export, real-time collaboration, and template sharing marketplace.",
        tag: "Upcoming",
        icon: "star",
    },
];

export const THEME_DETAILS: Record<
    TimelineTheme,
    {
        name: string;
        desc: string;
        badge: string;
        defaultAccent: string;
    }
> = {
    "modern-vertical": {
        name: "Modern Vertical",
        desc: "Sleek glowing vertical spine with glowing nodes & card badges",
        badge: "Popular",
        defaultAccent: "#3b82f6",
    },
    "alternating-zigzag": {
        name: "Alternating Spine",
        desc: "Dual-sided zig-zag timeline with central connecting branch",
        badge: "Balanced",
        defaultAccent: "#6366f1",
    },
    "horizontal-stepper": {
        name: "Horizontal Stepper",
        desc: "Horizontal roadmaps, milestones, and step-by-step progress flow",
        badge: "Flow",
        defaultAccent: "#06b6d4",
    },
    "neon-cyber": {
        name: "Neon Cyberpunk",
        desc: "Futuristic dark glass cards with electric neon border aura",
        badge: "Futuristic",
        defaultAccent: "#ec4899",
    },
    "glass-cards": {
        name: "Glass Frosted",
        desc: "Ultra-clean translucent cards, soft glass reflection & modern typography",
        badge: "Clean",
        defaultAccent: "#8b5cf6",
    },
    "bullet-compact": {
        name: "Resume Compact",
        desc: "Ultra-minimalist CV / resume timeline with refined pulsing bullet points",
        badge: "Resume",
        defaultAccent: "#10b981",
    },
    "circular-milestones": {
        name: "Circular Milestones",
        desc: "Prominent ring badges with years/icons and clean typography callouts",
        badge: "Editorial",
        defaultAccent: "#f59e0b",
    },
    "gradient-metro": {
        name: "Gradient Metro",
        desc: "Vivid subway line with multi-colored station stops and connectors",
        badge: "Creative",
        defaultAccent: "#14b8a6",
    },
};
