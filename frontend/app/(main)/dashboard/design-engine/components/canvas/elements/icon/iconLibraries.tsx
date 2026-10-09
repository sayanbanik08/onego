import React from "react";
import type { IconElement } from "../../../../types/icon";

export type SocialIconDef = {
    id: string;
    name: string;
    category: "social" | "dev" | "media" | "chat" | "creative";
    brandColor: string;
    svg: (props: { size?: number; color?: string; className?: string }) => React.JSX.Element;
};

export type AvatarIconDef = {
    id: string;
    name: string;
    category: "coder" | "creatives" | "3d" | "bots" | "minimal";
    svg: (props: { size?: number; color?: string; className?: string }) => React.JSX.Element;
};

// ── 1. SOCIAL MEDIA LIBRARY (Extensive 30+ platforms) ───────────────────────
export const SOCIAL_MEDIA_ICONS: SocialIconDef[] = [
    {
        id: "instagram",
        name: "Instagram",
        category: "social",
        brandColor: "#E4405F",
        svg: ({ size = 24, color, className }) => (
            <svg
                width={size}
                height={size}
                viewBox="0 0 24 24"
                fill="none"
                stroke={color || "currentColor"}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={className}
            >
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
            </svg>
        ),
    },
    {
        id: "linkedin",
        name: "LinkedIn",
        category: "social",
        brandColor: "#0A66C2",
        svg: ({ size = 24, color, className }) => (
            <svg
                width={size}
                height={size}
                viewBox="0 0 24 24"
                fill="none"
                stroke={color || "currentColor"}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={className}
            >
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                <rect width="4" height="12" x="2" y="9" />
                <circle cx="4" cy="4" r="2" />
            </svg>
        ),
    },
    {
        id: "github",
        name: "GitHub",
        category: "dev",
        brandColor: "#24292e",
        svg: ({ size = 24, color, className }) => (
            <svg
                width={size}
                height={size}
                viewBox="0 0 24 24"
                fill="none"
                stroke={color || "currentColor"}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={className}
            >
                <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                <path d="M9 18c-4.51 2-5-2-7-2" />
            </svg>
        ),
    },
    {
        id: "facebook",
        name: "Facebook",
        category: "social",
        brandColor: "#1877F2",
        svg: ({ size = 24, color, className }) => (
            <svg
                width={size}
                height={size}
                viewBox="0 0 24 24"
                fill="none"
                stroke={color || "currentColor"}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={className}
            >
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
            </svg>
        ),
    },
    {
        id: "youtube",
        name: "YouTube",
        category: "media",
        brandColor: "#FF0000",
        svg: ({ size = 24, color, className }) => (
            <svg
                width={size}
                height={size}
                viewBox="0 0 24 24"
                fill="none"
                stroke={color || "currentColor"}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={className}
            >
                <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
                <polygon points="10 15 15 12 10 9 10 15" fill={color || "currentColor"} />
            </svg>
        ),
    },
    {
        id: "x-twitter",
        name: "X (Twitter)",
        category: "social",
        brandColor: "#000000",
        svg: ({ size = 24, color, className }) => (
            <svg
                width={size}
                height={size}
                viewBox="0 0 24 24"
                fill={color || "currentColor"}
                className={className}
            >
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
        ),
    },
    {
        id: "tiktok",
        name: "TikTok",
        category: "media",
        brandColor: "#EE1D52",
        svg: ({ size = 24, color, className }) => (
            <svg
                width={size}
                height={size}
                viewBox="0 0 24 24"
                fill={color || "currentColor"}
                className={className}
            >
                <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.97v7.58c0 2.29-.68 4.54-2.03 6.32-1.64 2.18-4.22 3.51-6.95 3.55-2.73.04-5.36-1.18-7.07-3.29-1.7-2.11-2.38-4.9-1.84-7.55.53-2.65 2.28-4.88 4.7-6 .95-.44 1.98-.67 3.03-.71.18 1.34.18 2.69 0 4.03-.78.07-1.55.33-2.19.78-.96.67-1.57 1.77-1.65 2.94-.09 1.17.34 2.34 1.15 3.19.82.85 1.99 1.34 3.17 1.32 1.54-.03 2.94-.85 3.63-2.23.47-.94.7-1.99.68-3.04V.02h-2.65z" />
            </svg>
        ),
    },
    {
        id: "discord",
        name: "Discord",
        category: "chat",
        brandColor: "#5865F2",
        svg: ({ size = 24, color, className }) => (
            <svg
                width={size}
                height={size}
                viewBox="0 0 24 24"
                fill={color || "currentColor"}
                className={className}
            >
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
            </svg>
        ),
    },
    {
        id: "telegram",
        name: "Telegram",
        category: "chat",
        brandColor: "#229ED9",
        svg: ({ size = 24, color, className }) => (
            <svg
                width={size}
                height={size}
                viewBox="0 0 24 24"
                fill={color || "currentColor"}
                className={className}
            >
                <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
            </svg>
        ),
    },
    {
        id: "whatsapp",
        name: "WhatsApp",
        category: "chat",
        brandColor: "#25D366",
        svg: ({ size = 24, color, className }) => (
            <svg
                width={size}
                height={size}
                viewBox="0 0 24 24"
                fill="none"
                stroke={color || "currentColor"}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={className}
            >
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
            </svg>
        ),
    },
    {
        id: "spotify",
        name: "Spotify",
        category: "media",
        brandColor: "#1DB954",
        svg: ({ size = 24, color, className }) => (
            <svg
                width={size}
                height={size}
                viewBox="0 0 24 24"
                fill={color || "currentColor"}
                className={className}
            >
                <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
            </svg>
        ),
    },
    {
        id: "twitch",
        name: "Twitch",
        category: "media",
        brandColor: "#9146FF",
        svg: ({ size = 24, color, className }) => (
            <svg
                width={size}
                height={size}
                viewBox="0 0 24 24"
                fill="none"
                stroke={color || "currentColor"}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={className}
            >
                <path d="M21 2H3v16h5v4l4-4h5l4-4V2zm-10 9V7m5 4V7" />
            </svg>
        ),
    },
    {
        id: "reddit",
        name: "Reddit",
        category: "social",
        brandColor: "#FF4500",
        svg: ({ size = 24, color, className }) => (
            <svg
                width={size}
                height={size}
                viewBox="0 0 24 24"
                fill={color || "currentColor"}
                className={className}
            >
                <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.703zM9.25 12C8.56 12 8 12.56 8 13.25c0 .688.56 1.25 1.25 1.25.69 0 1.25-.562 1.25-1.25 0-.69-.56-1.25-1.25-1.25zm5.5 0c-.69 0-1.25.56-1.25 1.25 0 .688.56 1.25 1.25 1.25.688 0 1.25-.562 1.25-1.25 0-.69-.562-1.25-1.25-1.25zm-5.465 4.19a.48.48 0 0 0-.083.676c.493.65 1.48 1.104 2.798 1.104 1.32 0 2.305-.454 2.798-1.104a.48.48 0 0 0-.083-.676.48.48 0 0 0-.677.083c-.33.435-1.077.747-2.038.747-.96 0-1.707-.312-2.038-.747a.479.479 0 0 0-.677-.083z" />
            </svg>
        ),
    },
    {
        id: "pinterest",
        name: "Pinterest",
        category: "social",
        brandColor: "#BD081C",
        svg: ({ size = 24, color, className }) => (
            <svg
                width={size}
                height={size}
                viewBox="0 0 24 24"
                fill={color || "currentColor"}
                className={className}
            >
                <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146 1.124.347 2.317.535 3.554.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.39 18.592.026 11.985.026L12.017 0z" />
            </svg>
        ),
    },
    {
        id: "snapchat",
        name: "Snapchat",
        category: "social",
        brandColor: "#FFFC00",
        svg: ({ size = 24, color, className }) => (
            <svg
                width={size}
                height={size}
                viewBox="0 0 24 24"
                fill={color || "currentColor"}
                className={className}
            >
                <path d="M12.299 1.834c-4.225 0-6.19 3.097-6.19 5.372 0 1.096.48 2.368.877 3.037.164.277.218.495.08.735-.157.274-.537.476-.902.585-.436.13-.895.14-1.332.298-.44.159-.655.45-.644.839.012.441.314.735.807.887.97.299 2.02.26 2.98.625.39.148.65.419.673.844.02.378-.204.697-.52.923-1.04.743-2.228 1.192-3.468 1.554-.338.099-.607.305-.674.67-.074.407.098.715.465.867.75.311 1.542.492 2.339.638.647.119 1.302.185 1.954.279.162.023.272.098.31.261.128.552.417.976.906 1.258.62.358 1.314.475 2.016.516.78.046 1.55-.067 2.308-.285.344-.099.69-.126 1.037-.034.423.112.828.271 1.25.385.642.174 1.298.17 1.942.028.59-.13 1.092-.416 1.488-.876.324-.376.545-.811.667-1.289.04-.158.127-.234.281-.256.78-.112 1.56-.226 2.334-.378.718-.141 1.433-.314 2.115-.599.387-.162.569-.472.493-.88-.07-.378-.344-.59-.691-.689-1.229-.35-2.406-.79-3.435-1.523-.33-.235-.55-.563-.53-.95.021-.433.29-.711.685-.862.946-.36 1.98-.328 2.936-.62.502-.153.805-.45.817-.899.012-.395-.205-.688-.65-.847-.433-.155-.89-.164-1.325-.294-.37-.11-.75-.313-.91-.59-.14-.24-.09-.457.08-.733.4-.668.88-1.94.88-3.036 0-2.275-1.965-5.372-6.19-5.372z" />
            </svg>
        ),
    },
    {
        id: "dribbble",
        name: "Dribbble",
        category: "creative",
        brandColor: "#EA4C89",
        svg: ({ size = 24, color, className }) => (
            <svg
                width={size}
                height={size}
                viewBox="0 0 24 24"
                fill="none"
                stroke={color || "currentColor"}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={className}
            >
                <circle cx="12" cy="12" r="10" />
                <path d="M19.13 5.09C15.22 9.14 10 10.44 2.25 10.94" />
                <path d="M21.75 12.84c-6.62-1.41-12.14 1-16.38 6.32" />
                <path d="M8.56 2.75c4.37 6 6 9.42 8 17.72" />
            </svg>
        ),
    },
    {
        id: "behance",
        name: "Behance",
        category: "creative",
        brandColor: "#1769FF",
        svg: ({ size = 24, color, className }) => (
            <svg
                width={size}
                height={size}
                viewBox="0 0 24 24"
                fill={color || "currentColor"}
                className={className}
            >
                <path d="M22 7h-7v-2h7v2zm1.726 10c-.442 1.297-2.029 3-4.971 3-3.447 0-5.755-2.5-5.755-6s2.327-6 5.755-6c3.428 0 5.245 2.404 5.245 5.5h-8c0 1.933 1.344 3.5 3 3.5 1.488 0 2.457-.96 2.726-2h2zm-4.971-5.5c-1.401 0-2.453-.984-2.652-2.5h5.304c-.199 1.516-1.251 2.5-2.652 2.5zm-13.755 7.5h-5v-14h5.5c2.485 0 4.5 1.515 4.5 3.5 0 1.255-.788 2.355-1.939 2.923 1.479.524 2.439 1.763 2.439 3.327 0 2.345-2.015 4.25-5.5 4.25zm-2-6h2.5c1.105 0 2-.895 2-2s-.895-2-2-2h-2.5v4zm0 4h3c1.381 0 2.5-1.119 2.5-2.5s-1.119-2.5-2.5-2.5h-3v5z" />
            </svg>
        ),
    },
    {
        id: "slack",
        name: "Slack",
        category: "chat",
        brandColor: "#4A154B",
        svg: ({ size = 24, color, className }) => (
            <svg
                width={size}
                height={size}
                viewBox="0 0 24 24"
                fill="none"
                stroke={color || "currentColor"}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={className}
            >
                <rect width="3" height="8" x="13" y="2" rx="1.5" />
                <path d="M19 8.5V10h1.5A1.5 1.5 0 1 0 19 8.5" />
                <rect width="3" height="8" x="8" y="14" rx="1.5" />
                <path d="M5 15.5V14H3.5A1.5 1.5 0 1 0 5 15.5" />
                <rect width="8" height="3" x="14" y="13" rx="1.5" />
                <path d="M15.5 19H14v1.5a1.5 1.5 0 1 0 1.5-1.5" />
                <rect width="8" height="3" x="2" y="8" rx="1.5" />
                <path d="M8.5 5H10V3.5A1.5 1.5 0 1 0 8.5 5" />
            </svg>
        ),
    },
    {
        id: "threads",
        name: "Threads",
        category: "social",
        brandColor: "#000000",
        svg: ({ size = 24, color, className }) => (
            <svg
                width={size}
                height={size}
                viewBox="0 0 24 24"
                fill={color || "currentColor"}
                className={className}
            >
                <path d="M12.186 24C5.466 24 0 18.534 0 11.814 0 5.094 5.466 0 12.186 0c6.72 0 12.186 5.094 12.186 11.814 0 1.487-.272 2.923-.787 4.258l-2.029-.785c.399-1.077.608-2.235.608-3.473 0-5.508-4.47-9.978-9.978-9.978-5.508 0-9.978 4.47-9.978 9.978 0 5.508 4.47 9.978 9.978 9.978 2.378 0 4.604-.848 6.368-2.399l1.458 1.579C18.064 22.84 15.248 24 12.186 24zm4.84-9.336c-.452 3.197-2.619 4.887-5.187 4.887-2.88 0-5.066-2.186-5.066-5.066 0-2.88 2.186-5.066 5.066-5.066 2.656 0 4.67 1.776 4.965 4.382l-7.795.772c.158 1.637 1.34 2.804 2.896 2.804 1.411 0 2.502-.916 2.862-2.35l2.259.637zm-2.327-2.738c-.347-1.354-1.396-2.222-2.638-2.222-1.366 0-2.457 1.042-2.628 2.452l5.266-.23z" />
            </svg>
        ),
    },
    {
        id: "gitlab",
        name: "GitLab",
        category: "dev",
        brandColor: "#FC6D26",
        svg: ({ size = 24, color, className }) => (
            <svg
                width={size}
                height={size}
                viewBox="0 0 24 24"
                fill={color || "currentColor"}
                className={className}
            >
                <path d="M23.955 13.587l-1.342-4.135-2.664-8.189c-.135-.423-.73-.423-.867 0L16.418 9.45H7.582L4.918 1.263c-.136-.423-.731-.423-.867 0L1.387 9.452.045 13.587c-.161.493.018 1.04.444 1.348l11.511 8.364 11.512-8.364c.425-.308.604-.855.443-1.348z" />
            </svg>
        ),
    },
    {
        id: "figma",
        name: "Figma",
        category: "creative",
        brandColor: "#F24E1E",
        svg: ({ size = 24, color, className }) => (
            <svg
                width={size}
                height={size}
                viewBox="0 0 24 24"
                fill="none"
                stroke={color || "currentColor"}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={className}
            >
                <path d="M5 5.5A3.5 3.5 0 0 1 8.5 2H12v7H8.5A3.5 3.5 0 0 1 5 5.5z" />
                <path d="M12 2h3.5a3.5 3.5 0 1 1 0 7H12V2z" />
                <path d="M12 12.5a3.5 3.5 0 1 1 7 0 3.5 3.5 0 1 1-7 0z" />
                <path d="M5 19.5A3.5 3.5 0 0 1 8.5 16H12v3.5a3.5 3.5 0 1 1-7 0z" />
                <path d="M5 12.5A3.5 3.5 0 0 1 8.5 9H12v7H8.5A3.5 3.5 0 0 1 5 12.5z" />
            </svg>
        ),
    },
    {
        id: "notion",
        name: "Notion",
        category: "dev",
        brandColor: "#000000",
        svg: ({ size = 24, color, className }) => (
            <svg
                width={size}
                height={size}
                viewBox="0 0 24 24"
                fill={color || "currentColor"}
                className={className}
            >
                <path d="M4.459 4.208c.746.606 1.026.56 2.428.466l13.215-.793c.28 0 .047-.28-.093-.373L17.75 1.597c-.467-.373-1.12-.746-2.24-.653L2.686 2.063c-.466.047-.56.327-.373.513l2.146 1.632zm.84 4.013v13.626c0 .746.42 1.026 1.213.98l14.474-.84c.793-.047 1.027-.56 1.027-1.167V6.915c0-.607-.28-.933-.84-.887l-15.034.887c-.607.047-.84.42-.84.933v.373zm13.122.98c.093.42.093.84-.28.887l-.747.14v8.586c-.466.28-1.026.467-1.54.467-.84 0-1.26-.28-1.913-.98l-4.76-7.373v7.093l1.4.327c.047.42-.14.7-.607.7l-3.36.187c-.093-.374 0-.747.374-.84l1.026-.234V9.622l-1.4-.14c-.047-.42.14-.7.653-.746l3.5-.234 5.04 7.607V9.762l-1.167-.187c-.047-.42.234-.7.747-.746l3.08-.187z" />
            </svg>
        ),
    },
    {
        id: "stackoverflow",
        name: "Stack Overflow",
        category: "dev",
        brandColor: "#F48024",
        svg: ({ size = 24, color, className }) => (
            <svg
                width={size}
                height={size}
                viewBox="0 0 24 24"
                fill={color || "currentColor"}
                className={className}
            >
                <path d="M18.986 21.865v-6.408h2.164v8.572H2.85v-8.572H5.01v6.408h13.976zM7.228 17.653h9.544v-2.07H7.228v2.07zm.423-4.54l9.206 2.068.455-2.02-9.206-2.07-.455 2.022zm1.748-4.326l8.28 4.793.99-1.815-8.28-4.792-.99 1.814zm3.626-4.04l6.634 6.945 1.503-1.436-6.634-6.945-1.503 1.436zm6.155-4.747l-1.854 1.055 5.03 8.188 1.854-1.055-5.03-8.188z" />
            </svg>
        ),
    },
    {
        id: "medium",
        name: "Medium",
        category: "media",
        brandColor: "#000000",
        svg: ({ size = 24, color, className }) => (
            <svg
                width={size}
                height={size}
                viewBox="0 0 24 24"
                fill={color || "currentColor"}
                className={className}
            >
                <path d="M13.54 12a6.8 6.8 0 0 1-6.77 6.82A6.8 6.8 0 0 1 0 12a6.8 6.8 0 0 1 6.77-6.82A6.8 6.8 0 0 1 13.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z" />
            </svg>
        ),
    },
    {
        id: "patreon",
        name: "Patreon",
        category: "creative",
        brandColor: "#FF424D",
        svg: ({ size = 24, color, className }) => (
            <svg
                width={size}
                height={size}
                viewBox="0 0 24 24"
                fill={color || "currentColor"}
                className={className}
            >
                <path d="M15.386.5C10.662.5 6.85 4.316 6.85 9.043c0 4.673 3.812 8.49 8.536 8.49 4.673 0 8.49-3.817 8.49-8.49C23.876 4.316 20.059.5 15.386.5zM0 23.5h4.122V.5H0v23z" />
            </svg>
        ),
    },
    {
        id: "paypal",
        name: "PayPal",
        category: "social",
        brandColor: "#00457C",
        svg: ({ size = 24, color, className }) => (
            <svg
                width={size}
                height={size}
                viewBox="0 0 24 24"
                fill={color || "currentColor"}
                className={className}
            >
                <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.806 1.57 1.173.98 1.636 2.457 1.341 4.275-.544 3.359-2.738 5.155-6.345 5.198h-2.13a.641.641 0 0 0-.633.541l-1.077 6.827-.038.243a.641.641 0 0 1-.633.541h-2.707z" />
            </svg>
        ),
    },
];

// ── 2. AVATAR ICONS LIBRARY (Diverse vector avatars) ────────────────────────
export const AVATAR_ICONS: AvatarIconDef[] = [
    {
        id: "dev-coder",
        name: "Tech Hacker / Dev",
        category: "coder",
        svg: ({ size = 32, className }) => (
            <svg width={size} height={size} viewBox="0 0 36 36" fill="none" className={className}>
                <rect width="36" height="36" rx="18" fill="#1e1b4b" />
                {/* Hoodie */}
                <path d="M8 36c0-6 4-10 10-10s10 4 10 10" fill="#312e81" />
                {/* Face */}
                <ellipse cx="18" cy="18" rx="7" ry="8" fill="#fbcfe8" />
                {/* Hair */}
                <path d="M11 15c0-4 3-7 7-7s7 3 7 7c-2-2-5-3-7-3s-5 1-7 3z" fill="#0f172a" />
                {/* Glasses */}
                <rect x="13" y="16" width="4" height="3" rx="1" stroke="#38bdf8" strokeWidth="1.2" fill="#0284c7" fillOpacity="0.4" />
                <rect x="19" y="16" width="4" height="3" rx="1" stroke="#38bdf8" strokeWidth="1.2" fill="#0284c7" fillOpacity="0.4" />
                <line x1="17" y1="17.5" x2="19" y2="17.5" stroke="#38bdf8" strokeWidth="1.2" />
                {/* Smile */}
                <path d="M16 22q2 1.5 4 0" stroke="#be185d" strokeWidth="1" strokeLinecap="round" />
            </svg>
        ),
    },
    {
        id: "founder-ceo",
        name: "Startup Founder",
        category: "coder",
        svg: ({ size = 32, className }) => (
            <svg width={size} height={size} viewBox="0 0 36 36" fill="none" className={className}>
                <rect width="36" height="36" rx="18" fill="#0f172a" />
                {/* Suit */}
                <path d="M6 36c0-6 5-9 12-9s12 3 12 9" fill="#1e293b" />
                <polygon points="18,27 15,36 21,36" fill="#38bdf8" />
                {/* Face */}
                <circle cx="18" cy="17" r="7.5" fill="#fed7aa" />
                {/* Stylish Hair */}
                <path d="M10.5 15c0-5 3.5-8 7.5-8s7.5 3 7.5 8c-3-2-6-3-7.5-3s-4.5 1-7.5 3z" fill="#78350f" />
                {/* Eyes */}
                <circle cx="15.5" cy="16.5" r="1" fill="#451a03" />
                <circle cx="20.5" cy="16.5" r="1" fill="#451a03" />
                {/* Smile */}
                <path d="M16 20.5q2 1.5 4 0" stroke="#b45309" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
        ),
    },
    {
        id: "designer-creative",
        name: "Digital Designer",
        category: "creatives",
        svg: ({ size = 32, className }) => (
            <svg width={size} height={size} viewBox="0 0 36 36" fill="none" className={className}>
                <rect width="36" height="36" rx="18" fill="#831843" />
                {/* Sweater */}
                <path d="M6 36c0-7 5-10 12-10s12 3 12 10" fill="#be185d" />
                {/* Face */}
                <circle cx="18" cy="17" r="7" fill="#ffedd5" />
                {/* Beret / Beanie */}
                <path d="M9 14c1-5 5-8 9-8s8 3 9 8z" fill="#f43f5e" />
                <circle cx="18" cy="5.5" r="1.5" fill="#ffe4e6" />
                {/* Glasses / Round */}
                <circle cx="15" cy="17" r="2.2" stroke="#4c0519" strokeWidth="1.2" fill="none" />
                <circle cx="21" cy="17" r="2.2" stroke="#4c0519" strokeWidth="1.2" fill="none" />
                <line x1="17.2" y1="17" x2="18.8" y2="17" stroke="#4c0519" strokeWidth="1.2" />
                {/* Smile */}
                <path d="M16.5 21q1.5 1 3 0" stroke="#9f1239" strokeWidth="1" strokeLinecap="round" />
            </svg>
        ),
    },
    {
        id: "cyber-bot",
        name: "Cyber Neon AI Bot",
        category: "3d",
        svg: ({ size = 32, className }) => (
            <svg width={size} height={size} viewBox="0 0 36 36" fill="none" className={className}>
                <rect width="36" height="36" rx="18" fill="#030712" />
                {/* Bot Head */}
                <rect x="10" y="11" width="16" height="15" rx="5" fill="#1f2937" stroke="#06b6d4" strokeWidth="1.5" />
                {/* Antenna */}
                <line x1="18" y1="6" x2="18" y2="11" stroke="#06b6d4" strokeWidth="1.5" />
                <circle cx="18" cy="5" r="2" fill="#22d3ee" />
                {/* Neon Visor */}
                <rect x="13" y="15" width="10" height="4" rx="2" fill="#06b6d4" />
                <circle cx="15.5" cy="17" r="1" fill="#ffffff" />
                <circle cx="20.5" cy="17" r="1" fill="#ffffff" />
                {/* Cyber mouth grid */}
                <line x1="14" y1="22" x2="22" y2="22" stroke="#22d3ee" strokeWidth="1" strokeDasharray="1.5 1.5" />
            </svg>
        ),
    },
    {
        id: "cyberpunk-girl",
        name: "Cyberpunk Gamer",
        category: "creatives",
        svg: ({ size = 32, className }) => (
            <svg width={size} height={size} viewBox="0 0 36 36" fill="none" className={className}>
                <rect width="36" height="36" rx="18" fill="#2e1065" />
                {/* Jacket */}
                <path d="M7 36c0-6 4-9 11-9s11 3 11 9" fill="#581c87" />
                {/* Face */}
                <circle cx="18" cy="17" r="7" fill="#fce7f3" />
                {/* Neon Hair */}
                <path d="M10 16c0-5 3.5-9 8-9s8 4 8 9c-2-3-5-4-8-4s-6 1-8 4z" fill="#ec4899" />
                {/* Headset */}
                <path d="M9 17a9 9 0 0 1 18 0" stroke="#a855f7" strokeWidth="2.5" fill="none" />
                <rect x="7" y="15" width="3" height="5" rx="1.5" fill="#c084fc" />
                <rect x="26" y="15" width="3" height="5" rx="1.5" fill="#c084fc" />
                {/* Visor / Eye */}
                <circle cx="15.5" cy="17.5" r="1" fill="#831843" />
                <circle cx="20.5" cy="17.5" r="1" fill="#831843" />
            </svg>
        ),
    },
    {
        id: "astronaut",
        name: "Cosmic Astronaut",
        category: "3d",
        svg: ({ size = 32, className }) => (
            <svg width={size} height={size} viewBox="0 0 36 36" fill="none" className={className}>
                <rect width="36" height="36" rx="18" fill="#09090b" />
                {/* Space Suit */}
                <path d="M6 36c0-7 5-10 12-10s12 3 12 10" fill="#e2e8f0" />
                {/* Helmet */}
                <circle cx="18" cy="16" r="9" fill="#f8fafc" stroke="#94a3b8" strokeWidth="1.5" />
                {/* Gold Reflective Visor */}
                <ellipse cx="18" cy="16" rx="6.5" ry="5.5" fill="url(#visorGold)" />
                <defs>
                    <linearGradient id="visorGold" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#f59e0b" />
                        <stop offset="100%" stopColor="#78350f" />
                    </linearGradient>
                </defs>
            </svg>
        ),
    },
    {
        id: "pixel-hero",
        name: "8-Bit Retro Hero",
        category: "minimal",
        svg: ({ size = 32, className }) => (
            <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className={className}>
                <rect width="16" height="16" rx="8" fill="#18181b" />
                <rect x="5" y="3" width="6" height="2" fill="#ef4444" />
                <rect x="4" y="5" width="8" height="6" fill="#fca5a5" />
                <rect x="5" y="6" width="2" height="2" fill="#18181b" />
                <rect x="9" y="6" width="2" height="2" fill="#18181b" />
                <rect x="6" y="9" width="4" height="1" fill="#991b1b" />
                <rect x="4" y="11" width="8" height="5" fill="#3b82f6" />
            </svg>
        ),
    },
    {
        id: "cat-mascot",
        name: "Meow / Mascot Cat",
        category: "minimal",
        svg: ({ size = 32, className }) => (
            <svg width={size} height={size} viewBox="0 0 36 36" fill="none" className={className}>
                <rect width="36" height="36" rx="18" fill="#fef08a" />
                {/* Ears */}
                <polygon points="10,14 13,8 17,14" fill="#f59e0b" />
                <polygon points="26,14 23,8 19,14" fill="#f59e0b" />
                {/* Head */}
                <circle cx="18" cy="19" r="9" fill="#fbbf24" />
                {/* Eyes */}
                <ellipse cx="14.5" cy="18" rx="1.5" ry="2" fill="#1e1b4b" />
                <ellipse cx="21.5" cy="18" rx="1.5" ry="2" fill="#1e1b4b" />
                {/* Nose & whiskers */}
                <polygon points="18,20 17,21.5 19,21.5" fill="#f43f5e" />
                <line x1="11" y1="20" x2="15" y2="21" stroke="#78350f" strokeWidth="1" />
                <line x1="25" y1="20" x2="21" y2="21" stroke="#78350f" strokeWidth="1" />
            </svg>
        ),
    },
    {
        id: "minimal-monoline",
        name: "Monoline Aesthetic",
        category: "minimal",
        svg: ({ size = 32, className }) => (
            <svg width={size} height={size} viewBox="0 0 36 36" fill="none" className={className}>
                <rect width="36" height="36" rx="18" fill="#18181b" stroke="#3f3f46" strokeWidth="1" />
                <circle cx="18" cy="14" r="5" stroke="#e4e4e7" strokeWidth="1.5" />
                <path d="M10 28c0-5 3.5-7 8-7s8 2 8 7" stroke="#e4e4e7" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
        ),
    },
];

// ── 3. EMOJI PICKER LIBRARY (Grouped rich categories) ────────────────────────
export const EMOJI_CATEGORIES: {
    category: string;
    icon: string;
    emojis: string[];
}[] = [
    {
        category: "Smileys & Emotion",
        icon: "😀",
        emojis: [
            "😀", "😃", "😄", "😁", "😆", "😅", "😂", "🤣", "😊", "😇",
            "🙂", "🙃", "😉", "😌", "😍", "🥰", "😘", "😗", "😙", "😚",
            "😋", "😛", "😝", "😜", "🤪", "🤨", "🧐", "🤓", "😎", "🤩",
            "🥳", "😏", "😒", "😞", "😔", "😟", "😕", "🙁", "☹️", "😣",
            "😖", "😫", "😩", "🥺", "😢", "😭", "😮‍💨", "😤", "😠", "😡",
            "🤬", "🤯", "😳", "🥵", "🥶", "😱", "😨", "😰", "😥", "😓",
            "🤗", "🤔", "🫣", "🤭", "🤫", "🤥", "😶", "😶‍🌫️", "😐", "😑",
            "😬", "🫠", "🙄", "😯", "😦", "😧", "😮", "😲", "🥱", "😴",
            "🤤", "😪", "😵", "😵‍💫", "🤐", "🥴", "🤢", "🤮", "🤧", "😷",
            "🤒", "🤕", "🤑", "🤠", "😈", "👿", "👹", "👺", "🤡", "💩",
            "👻", "💀", "☠️", "👽", "👾", "🤖", "🎃",
        ],
    },
    {
        category: "Hands & Gestures",
        icon: "👍",
        emojis: [
            "👋", "🤚", "🖐️", "✋", "🖖", "🫱", "🫲", "🫳", "🫴", "👌",
            "🤌", "🤏", "✌️", "🤞", "🫰", "🤟", "🤘", "🤙", "👈", "👉",
            "👆", "🖕", "👇", "☝️", "👍", "👎", "✊", "👊", "🤛", "🤜",
            "👏", "🙌", "🫶", "👐", "🤲", "🤝", "🙏", "✍️", "💅", "🤳",
            "💪", "🦾", "🦿", "🦵", "🦶", "👂", "🦻", "👃", "🫀", "🫁",
            "🧠", "🫀", "👀", "👁️", "👅", "👄", "💋", "🩸",
        ],
    },
    {
        category: "Hearts & Sparkles",
        icon: "💖",
        emojis: [
            "❤️", "🧡", "💛", "💚", "💙", "💜", "🖤", "🤍", "🤎", "💔",
            "❤️‍🔥", "❤️‍🩹", "❣️", "💕", "💞", "💓", "💗", "💖", "💘", "💝",
            "💟", "✨", "⭐", "🌟", "💫", "💥", "🔥", "💯", "⚡", "🌈",
        ],
    },
    {
        category: "Animals & Nature",
        icon: "🦊",
        emojis: [
            "🐶", "🐱", "🐭", "🐹", "🐰", "🦊", "🐻", "🐼", "🐻‍❄️", "🐨",
            "🐯", "🦁", "🐮", "🐷", "🐽", "🐸", "🐵", "🙈", "🙉", "🙊",
            "🐒", "🐔", "🐧", "🐦", "🐤", "🐣", "🐥", "🦆", "🦅", "🦉",
            "🦇", "🐺", "🐗", "🐴", "🦄", "🐝", "🪱", "🐛", "🦋", "🐌",
            "🐞", "🐜", "🪰", "🪲", "🪳", "🦟", "🦗", "🕷️", "🦂", "🐢",
            "🐍", "🦎", "🦖", "🦕", "🐙", "🦑", "🦐", "🦞", "🦀", "🐡",
            "🐠", "🐟", "🐬", "🐳", "🐋", "🦈", "🐊", "🐅", "🐆", "🦓",
            "🦍", "🦧", "🦣", "🐘", "🦛", "🦏", "🐪", "🐫", "🦒", "🦘",
            "🦬", "🐃", "🐂", "🐄", "🐎", "🐖", "🐏", "🐑", "🦙", "🐐",
            "🦌", "🐕", "🐩", "🦮", "🐕‍🦺", "🐈", "🐈‍⬛", "🪶", "🐓", "🦃",
            "🦤", "🦚", "🦜", "🦢", "🦩", "🕊️", "🐇", "🦝", "🦨", "🦡",
            "🦫", "🦦", "🦥", "🐁", "🐀", "🐿️", "🦔", "🐉", "🐲",
        ],
    },
    {
        category: "Food & Drinks",
        icon: "☕",
        emojis: [
            "🍏", "🍎", "🍐", "🍊", "🍋", "🍌", "🍉", "🍇", "🍓", "🫐",
            "🍈", "🍒", "🍑", "🥭", "🍍", "🥥", "🥝", "🍅", "🍆", "🥑",
            "🥦", "🥬", "🥒", "🌶️", "🫑", "🌽", "🥕", "🫒", "🧄", "🧅",
            "🥔", "🍠", "🥐", "🥯", "🍞", "🥖", "🥨", "🧀", "🥚", "🍳",
            "🧈", "🥞", "🧇", "🥓", "🥩", "🍗", "🍖", "🦴", "🌭", "🍔",
            "🍟", "🍕", "🫓", "🥪", "🥙", "🧆", "🌮", "🌯", "🫔", "🥗",
            "🥘", "🫕", "🥫", "🍝", "🍜", "🍲", "🍛", "🍣", "🍱", "🥟",
            "🦪", "🍤", "🍙", "🍚", "🍘", "🍢", "🥠", "🥮", "🍧", "🍨",
            "🍦", "🥧", "🧁", "🍰", "🎂", "🍮", "🍭", "🍬", "🍫", "🍿",
            "🍩", "🍪", "🌰", "🥜", "🍯", "🥛", "🍼", "🫖", "☕", "🧃",
            "🥤", "🧋", "🍶", "🍺", "🍻", "🥂", "🍷", "🥃", "🍸", "🍹",
            "🧉", "🍾", "🧊",
        ],
    },
    {
        category: "Activities & Objects",
        icon: "🚀",
        emojis: [
            "⚽", "🏀", "🏈", "⚾", "🥎", "🎾", "🏐", "🏉", "🥏", "🎱",
            "🪀", "🏓", "🏸", "🏒", "🏑", "🥍", "🏏", "🪃", "🥅", "⛳",
            "🪁", "🏹", "🎣", "🤿", "🥊", "🥋", "🎽", "🛹", "🛼", "🛷",
            "⛸️", "🥌", "🎿", "⛷️", "🏂", "🪂", "🏋️", "🤼", "🤸", "🤺",
            "🎯", "🎮", "🕹️", "🎰", "🎲", "🧩", "♟️", "🎭", "🎨", "🎬",
            "🎤", "🎧", "🎼", "🎹", "🥁", "🎷", "🎺", "🎸", "🪕", "🎻",
            "💻", "🖥️", "🖨️", "⌨️", "🖱️", "📱", "📲", "☎️", "📟", "📠",
            "🔋", "🔌", "💡", "🔦", "🕯️", "🧯", "🛢️", "💸", "💵", "💴",
            "💶", "💷", "🪙", "💰", "💳", "💎", "⚖️", "🪜", "🧰", "🪛",
            "🔧", "🔨", "⚒️", "🛠️", "⛏️", "🪚", "🔩", "⚙️", "🪤", "🧱",
            "⛓️", "🧲", "🔫", "💣", "🧨", "🪓", "🔪", "🗡️", "⚔️", "🛡️",
            "🚬", "⚰️", "🪦", "⚱️", "🏺", "🔮", "📿", "🧿", "💈", "⚗️",
            "🔭", "🔬", "🕳️", "🩹", "🩺", "💊", "💉", "🩸", "🧬", "🦠",
            "🧫", "🧪", "🌡️", "🧹", "🪠", "🧺", "🧻", "🚽", "🚰", "🚿",
            "🛁", "🛀", "🧼", "🪥", "🪒", "🧽", "🪣", "🧴", "🛎️", "🔑",
            "🗝️", "🚪", "🪑", "🛋️", "🛏️", "🛌", "🧸", "🪆", "🖼️", "🪞",
            "🪟", "🎒", "🧳", "⏱️", "⏲️", "⏰", "🕰️", "⌛", "⏳", "📡",
            "🔋", "🔌", "💡", "🚀", "🛸", "🚁", "⛵", "🚢", "🏎️", "🏍️",
        ],
    },
];

// ── 4. SHADOW RESOLUTION HELPER (EXACTLY SAME AS BUTTON) ────────────────────
export function getIconShadow(element: IconElement): string {
    if (element.shadow === "none") return "none";
    if (element.shadow === "sm") return "0 2px 6px rgba(0, 0, 0, 0.25)";
    if (element.shadow === "md") return "0 6px 16px rgba(0, 0, 0, 0.35)";
    if (element.shadow === "lg") return "0 12px 28px rgba(0, 0, 0, 0.45)";
    if (element.shadow === "xl") return "0 20px 48px rgba(0, 0, 0, 0.55)";
    if (element.shadow === "neon") {
        const glow = element.iconColor || element.borderColor || "#3b82f6";
        return `0 0 16px ${glow}aa, 0 0 32px ${glow}55`;
    }
    if (element.shadow === "3d-offset") {
        return "4px 4px 0px rgba(0, 0, 0, 0.85)";
    }
    if (element.shadow === "layered-steps") {
        return [
            "2px 2px 0px rgba(255, 255, 255, 0.9)",
            "4px 4px 0px rgba(255, 255, 255, 0.75)",
            "6px 6px 0px rgba(255, 255, 255, 0.6)",
            "8px 8px 0px rgba(255, 255, 255, 0.45)",
            "10px 10px 0px rgba(255, 255, 255, 0.3)",
            "12px 12px 0px rgba(255, 255, 255, 0.2)",
            "14px 14px 0px rgba(255, 255, 255, 0.1)",
        ].join(", ");
    }
    if (element.shadow === "custom") {
        return `${element.shadowOffsetX ?? 0}px ${element.shadowOffsetY ?? 4}px ${element.shadowBlur ?? 12}px ${element.shadowSpread ?? 0}px ${element.shadowColor ?? "rgba(0,0,0,0.35)"}`;
    }
    return "none";
}

// ── 5. REDIRECT HANDLER ─────────────────────────────────────────────────────
export function handleIconRedirect(link?: string) {
    if (!link) return;
    let url = link.trim();
    if (!url) return;
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
        url = "https://" + url;
    }
    window.open(url, "_blank", "noopener,noreferrer");
}
