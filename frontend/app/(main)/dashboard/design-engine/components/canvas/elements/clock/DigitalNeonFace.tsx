import React from "react";
import type { ClockFaceProps } from "./clockFaceShared";

export function DigitalNeonFace({
    clk,
    clockW,
    clockH,
    displayS,
    ampm,
    timeStr,
    dateDisplayStr,
}: ClockFaceProps) {
    const totalBars = 20;
    const activeBars = Math.floor((displayS / 60) * totalBars);

    return (
        <g>
            {/* Dark Cyber Base & Glow Border */}
            <rect x="0" y="0" width={clockW} height={clockH} rx={clk.borderRadius} fill={clk.bgColor} stroke={clk.borderColor} strokeWidth={clk.borderWidth} />
            <rect x="0" y="0" width={clockW} height={clockH} rx={clk.borderRadius} fill="none" stroke={clk.accentColor} strokeWidth="1" opacity="0.35" filter={`url(#neon-glow-${clk.id})`} />

            {/* Cyber Corner Brackets */}
            <path d="M 14 30 L 14 14 L 30 14" fill="none" stroke={clk.accentColor} strokeWidth="2" strokeLinecap="round" />
            <path d={`M ${clockW - 30} 14 L ${clockW - 14} 14 L ${clockW - 14} 30`} fill="none" stroke={clk.accentColor} strokeWidth="2" strokeLinecap="round" />
            <path d="M 14 160 L 14 176 L 30 176" fill="none" stroke={clk.accentColor} strokeWidth="2" strokeLinecap="round" />
            <path d={`M ${clockW - 30} 176 L ${clockW - 14} 176 L ${clockW - 14} 160`} fill="none" stroke={clk.accentColor} strokeWidth="2" strokeLinecap="round" />

            {/* Tactical Header */}
            <text x="36" y="30" fill={clk.accentColor} fontSize="9" fontWeight="800" fontFamily="monospace" letterSpacing="2">SYS.NEON // CHRONO</text>
            <text x={clockW - 36} y="30" textAnchor="end" fill={clk.textColor} fontSize="9" fontWeight="700" fontFamily="monospace" letterSpacing="1" opacity="0.7">{clk.is24Hour ? "24-HOUR" : ampm}</text>

            {/* Ghost 88:88:88 Background */}
            <text x={clockW / 2} y="106" textAnchor="middle" fill={clk.accentColor} opacity="0.08" fontSize={clk.showSeconds ? 44 : 52} fontWeight="900" fontFamily="'Courier New', monospace" letterSpacing="4">
                88:88{clk.showSeconds ? ":88" : ""}
            </text>

            {/* Bright Neon Digits */}
            <text x={clockW / 2} y="106" textAnchor="middle" fill={clk.textColor} stroke={clk.accentColor} strokeWidth="1.2" filter={`url(#neon-glow-${clk.id})`} fontSize={clk.showSeconds ? 44 : 52} fontWeight="900" fontFamily="'Courier New', monospace" letterSpacing="4">
                {timeStr}
            </text>

            {/* Audio-meter style tick meter for seconds */}
            <g transform="translate(40, 130)">
                {Array.from({ length: totalBars }).map((_, i) => (
                    <rect key={i} x={i * 11} y="0" width="7" height="6" rx="1"
                        fill={i <= activeBars ? clk.accentColor : "#1e293b"}
                        opacity={i <= activeBars ? 0.95 : 0.3}
                        filter={i <= activeBars ? `url(#neon-glow-${clk.id})` : undefined}
                    />
                ))}
            </g>

            {/* Date Tag */}
            {dateDisplayStr && (
                <text x={clockW / 2} y="165" textAnchor="middle" fill={clk.accentColor} fontSize="10" fontWeight="700" fontFamily="monospace" letterSpacing="2.5" opacity="0.9">
                    {`[ ${dateDisplayStr} ]`}
                </text>
            )}
        </g>
    );
}
