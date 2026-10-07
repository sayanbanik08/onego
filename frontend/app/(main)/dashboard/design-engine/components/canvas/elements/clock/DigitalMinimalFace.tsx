import React from "react";
import type { ClockFaceProps } from "./clockFaceShared";

export function DigitalMinimalFace({
    clk,
    clockW,
    clockH,
    displayS,
    ampm,
    pad,
    h12,
    displayM,
    dateDisplayStr,
}: ClockFaceProps) {
    const secProgressW = (clockW - 48) * (displayS / 60);

    return (
        <g>
            {/* Background & Inset Glass Highlight */}
            <rect
                x="0"
                y="0"
                width={clockW}
                height={clockH}
                rx={clk.borderRadius}
                fill={clk.bgColor}
                stroke={clk.borderColor}
                strokeWidth={clk.borderWidth}
            />
            <rect
                x="1"
                y="1"
                width={clockW - 2}
                height={clockH - 2}
                rx={Math.max(0, clk.borderRadius - 1)}
                fill={`url(#glass-shine-${clk.id})`}
            />

            {/* Header: Status Dot & AM/PM Badge */}
            <circle cx="28" cy="26" r="3.5" fill={clk.accentColor} />
            <circle
                cx="28"
                cy="26"
                r="7"
                fill={clk.accentColor}
                opacity="0.2"
            />
            <text
                x="40"
                y="30"
                fill={clk.textColor}
                fontSize="10"
                fontWeight="600"
                letterSpacing="1.5"
                opacity="0.6"
            >
                PRECISION TIME
            </text>

            <rect
                x={clockW - 56}
                y="16"
                width="38"
                height="20"
                rx="10"
                fill={clk.accentColor + "18"}
                stroke={clk.accentColor + "35"}
                strokeWidth="1"
            />
            <text
                x={clockW - 37}
                y="30"
                textAnchor="middle"
                fill={clk.accentColor}
                fontSize="10"
                fontWeight="700"
            >
                {clk.is24Hour ? "24H" : ampm}
            </text>

            {/* Main Time Digits */}
            <text
                x={clk.showSeconds ? 126 : clockW / 2}
                y="112"
                textAnchor="middle"
                fill={clk.textColor}
                fontSize={clk.showSeconds ? 48 : 54}
                fontWeight="700"
                fontFamily="system-ui, -apple-system, sans-serif"
                letterSpacing="2"
            >
                {pad(h12)}:{pad(displayM)}
            </text>

            {/* Dedicated Seconds Badge */}
            {clk.showSeconds && (
                <g>
                    <rect
                        x="206"
                        y="78"
                        width="44"
                        height="34"
                        rx="8"
                        fill={clk.accentColor + "16"}
                        stroke={clk.accentColor + "38"}
                        strokeWidth="1"
                    />
                    <text
                        x="228"
                        y="101"
                        textAnchor="middle"
                        fill={clk.accentColor}
                        fontSize="19"
                        fontWeight="800"
                        fontFamily="monospace"
                    >
                        {pad(displayS)}
                    </text>
                    <text
                        x="228"
                        y="70"
                        textAnchor="middle"
                        fill={clk.textColor}
                        fontSize="8"
                        fontWeight="600"
                        letterSpacing="1"
                        opacity="0.5"
                    >
                        SEC
                    </text>
                </g>
            )}

            {/* Minimal Second Progress Bar */}
            <line
                x1="24"
                y1="138"
                x2={clockW - 24}
                y2="138"
                stroke={clk.borderColor}
                strokeWidth="2.5"
                strokeLinecap="round"
                opacity="0.4"
            />
            <line
                x1="24"
                y1="138"
                x2={24 + secProgressW}
                y2="138"
                stroke={clk.accentColor}
                strokeWidth="2.5"
                strokeLinecap="round"
            />

            {/* Date Pill */}
            {dateDisplayStr && (
                <g>
                    <rect
                        x="40"
                        y="152"
                        width={clockW - 80}
                        height="22"
                        rx="11"
                        fill="rgba(0,0,0,0.2)"
                        stroke={clk.borderColor}
                        strokeWidth="0.8"
                    />
                    <text
                        x={clockW / 2}
                        y="167"
                        textAnchor="middle"
                        fill={clk.textColor}
                        fontSize="10"
                        fontWeight="600"
                        letterSpacing="1.5"
                        opacity="0.85"
                    >
                        {dateDisplayStr}
                    </text>
                </g>
            )}
        </g>
    );
}
