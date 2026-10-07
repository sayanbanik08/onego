import React from "react";
import type { ClockFaceProps } from "./clockFaceShared";

export function SmartwatchFace({
    clk,
    clockW,
    clockH,
    displayS,
    ampm,
    timeStr,
    dateDisplayStr,
}: ClockFaceProps) {
    const sw = 230; // Increased width as requested
    const sh = 174;
    const sx = (clockW - sw) / 2; // 35
    const sy = (clockH - sh) / 2; // 8
    const screenW = 206;
    const screenH = 152;
    const screenX = sx + 12; // 47
    const screenY = sy + 11; // 19

    return (
        <g>
            {/* Left Action Button (Orange / Tactical Accent) */}
            <rect
                x={sx - 5}
                y={sy + 52}
                width="6"
                height="32"
                rx="2.5"
                fill="#f97316"
                stroke="#9a3412"
                strokeWidth="0.8"
            />

            {/* Right Digital Crown with Ribbed Ridges */}
            <rect
                x={sx + sw - 1}
                y={sy + 36}
                width="8"
                height="38"
                rx="3.5"
                fill="#475569"
                stroke="#1e293b"
                strokeWidth="1"
            />
            <rect
                x={sx + sw + 1}
                y={sy + 40}
                width="2"
                height="30"
                fill={clk.accentColor}
                rx="1"
            />
            {[0, 1, 2, 3, 4, 5].map((r) => (
                <line
                    key={r}
                    x1={sx + sw + 3}
                    y1={sy + 42 + r * 4.5}
                    x2={sx + sw + 6}
                    y2={sy + 42 + r * 4.5}
                    stroke="#0f172a"
                    strokeWidth="1"
                />
            ))}

            {/* Right Mic / Secondary Button */}
            <rect
                x={sx + sw - 1}
                y={sy + 86}
                width="5"
                height="22"
                rx="2"
                fill="#334155"
                stroke="#1e293b"
                strokeWidth="0.8"
            />

            {/* Watch Chassis (Titanium / Luxury Squircle Body) */}
            <rect
                x={sx}
                y={sy}
                width={sw}
                height={sh}
                rx="30"
                fill={`url(#titanium-${clk.id})`}
                stroke={clk.borderColor}
                strokeWidth={Math.max(2, clk.borderWidth)}
            />
            <rect
                x={sx + 2}
                y={sy + 2}
                width={sw - 4}
                height={sh - 4}
                rx="28"
                fill="none"
                stroke="rgba(255,255,255,0.12)"
                strokeWidth="1"
            />

            {/* OLED Glass Screen */}
            <rect
                x={screenX}
                y={screenY}
                width={screenW}
                height={screenH}
                rx="22"
                fill={clk.bgColor}
                stroke="#171b26"
                strokeWidth="1.5"
            />
            {/* Screen Glass Specular Highlight Curve */}
            <path
                d={`M ${screenX + 8} ${screenY + 2} Q ${
                    screenX + screenW / 2
                } ${screenY + 12} ${screenX + screenW - 8} ${screenY + 2}`}
                fill="none"
                stroke="rgba(255,255,255,0.18)"
                strokeWidth="1"
            />

            {/* Status Bar */}
            <circle
                cx={screenX + 16}
                cy={screenY + 16}
                r="3"
                fill="#f97316"
            />
            <text
                x={screenX + 24}
                y={screenY + 19}
                fill="#f97316"
                fontSize="9"
                fontWeight="700"
            >
                ACTIVE
            </text>

            <rect
                x={screenX + screenW - 32}
                y={screenY + 11}
                width="18"
                height="9"
                rx="2.5"
                fill="none"
                stroke="#22c55e"
                strokeWidth="1"
            />
            <rect
                x={screenX + screenW - 30}
                y={screenY + 13}
                width="12"
                height="5"
                rx="1"
                fill="#22c55e"
            />
            <text
                x={screenX + screenW - 36}
                y={screenY + 19}
                textAnchor="end"
                fill="#22c55e"
                fontSize="8"
                fontWeight="700"
            >
                98%
            </text>

            {/* Big WatchOS Digital Time */}
            <text
                x={screenX + screenW / 2}
                y={screenY + 58}
                textAnchor="middle"
                fill={clk.textColor}
                fontSize="38"
                fontWeight="800"
                fontFamily="system-ui, -apple-system, sans-serif"
                letterSpacing="1"
            >
                {timeStr}
            </text>
            {!clk.is24Hour && (
                <text
                    x={screenX + screenW - 14}
                    y={screenY + 44}
                    textAnchor="end"
                    fill={clk.accentColor}
                    fontSize="10"
                    fontWeight="700"
                >
                    {ampm}
                </text>
            )}

            {/* Apple-style 3-Ring Activity Complication (Left Side) */}
            <g
                transform={`translate(${screenX + 32}, ${
                    screenY + 98
                })`}
            >
                {/* Ring 1 - Move Red */}
                <circle
                    cx="0"
                    cy="0"
                    r="17"
                    fill="none"
                    stroke="#f43f5e"
                    strokeWidth="3.5"
                    opacity="0.25"
                />
                <circle
                    cx="0"
                    cy="0"
                    r="17"
                    fill="none"
                    stroke="#f43f5e"
                    strokeWidth="3.5"
                    strokeDasharray="107"
                    strokeDashoffset={107 - 107 * 0.78}
                    strokeLinecap="round"
                    transform="rotate(-90)"
                />

                {/* Ring 2 - Exercise Green */}
                <circle
                    cx="0"
                    cy="0"
                    r="12"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="3.5"
                    opacity="0.25"
                />
                <circle
                    cx="0"
                    cy="0"
                    r="12"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="3.5"
                    strokeDasharray="75"
                    strokeDashoffset={75 - 75 * 0.62}
                    strokeLinecap="round"
                    transform="rotate(-90)"
                />

                {/* Ring 3 - Stand Cyan */}
                <circle
                    cx="0"
                    cy="0"
                    r="7"
                    fill="none"
                    stroke="#06b6d4"
                    strokeWidth="3.5"
                    opacity="0.25"
                />
                <circle
                    cx="0"
                    cy="0"
                    r="7"
                    fill="none"
                    stroke="#06b6d4"
                    strokeWidth="3.5"
                    strokeDasharray="44"
                    strokeDashoffset={44 - 44 * 0.88}
                    strokeLinecap="round"
                    transform="rotate(-90)"
                />
            </g>

            {/* Complication Widgets (Right Side) */}
            <text
                x={screenX + 64}
                y={screenY + 88}
                fill="#f43f5e"
                fontSize="9"
                fontWeight="700"
            >
                ❤️ 72 BPM
            </text>
            <text
                x={screenX + 130}
                y={screenY + 88}
                fill="#f59e0b"
                fontSize="9"
                fontWeight="700"
            >
                🔥 420 KCAL
            </text>
            <text
                x={screenX + 64}
                y={screenY + 104}
                fill="#10b981"
                fontSize="9"
                fontWeight="700"
            >
                👟 8,420 STEPS
            </text>
            <text
                x={screenX + 140}
                y={screenY + 104}
                fill="#06b6d4"
                fontSize="9"
                fontWeight="700"
            >
                ⚡ 12 HR
            </text>

            {/* Seconds Dynamic Track */}
            <line
                x1={screenX + 64}
                y1={screenY + 114}
                x2={screenX + screenW - 16}
                y2={screenY + 114}
                stroke="#1f2937"
                strokeWidth="2.5"
                strokeLinecap="round"
            />
            <line
                x1={screenX + 64}
                y1={screenY + 114}
                x2={
                    screenX +
                    64 +
                    (screenW - 80) * (displayS / 60)
                }
                y2={screenY + 114}
                stroke={clk.accentColor}
                strokeWidth="2.5"
                strokeLinecap="round"
            />

            {/* Date Pill at Bottom */}
            {dateDisplayStr && (
                <text
                    x={screenX + screenW / 2}
                    y={screenY + 138}
                    textAnchor="middle"
                    fill={clk.textColor}
                    fontSize="9.5"
                    fontWeight="600"
                    opacity="0.8"
                    letterSpacing="1"
                >
                    {dateDisplayStr}
                </text>
            )}
        </g>
    );
}
