import React from "react";
import type { ClockFaceProps } from "./clockFaceShared";

export function AnalogClassicFace({
    clk,
    clockW,
    clockH,
    hourAngle,
    minuteAngle,
    secondAngle,
    pad,
    dateDisplayStr,
    now,
}: ClockFaceProps) {
    const cx = clockW / 2;
    const cy = clockH / 2;
    const r = 78;
    const toX = (angle: number, len: number) =>
        cx + Math.sin((angle * Math.PI) / 180) * len;
    const toY = (angle: number, len: number) =>
        cy - Math.cos((angle * Math.PI) / 180) * len;

    return (
        <g>
            {/* Outer Case / Plate */}
            <rect x="0" y="0" width={clockW} height={clockH} rx={clk.borderRadius} fill={clk.bgColor} stroke={clk.borderColor} strokeWidth={clk.borderWidth} />

            {/* Outer Luxury Polished Bezel */}
            <circle cx={cx} cy={cy} r={r + 6} fill="none" stroke="#475569" strokeWidth="3" />
            <circle cx={cx} cy={cy} r={r + 3} fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="1" />
            <circle cx={cx} cy={cy} r={r} fill={clk.bgColor} stroke={clk.borderColor} strokeWidth={clk.borderWidth} />

            {/* Concentric Guilloché Texture Rings */}
            <circle cx={cx} cy={cy} r={r * 0.38} fill="none" stroke={clk.textColor} strokeWidth="0.5" opacity="0.08" />
            <circle cx={cx} cy={cy} r={r * 0.65} fill="none" stroke={clk.textColor} strokeWidth="0.5" opacity="0.08" />
            <circle cx={cx} cy={cy} r={r * 0.86} fill="none" stroke={clk.textColor} strokeWidth="0.5" opacity="0.08" />

            {/* Horology Inscriptions */}
            <text x={cx} y={cy - 26} textAnchor="middle" fill={clk.textColor} fontSize="7" fontWeight="700" letterSpacing="1.8" opacity="0.65">CHRONOMETER</text>
            <text x={cx} y={cy - 18} textAnchor="middle" fill={clk.accentColor} fontSize="5.5" fontWeight="600" letterSpacing="1.2" opacity="0.75">AUTOMATIC</text>
            <text x={cx} y={cy + 42} textAnchor="middle" fill={clk.textColor} fontSize="5" fontWeight="600" letterSpacing="2" opacity="0.45">SWISS HOROLOGY</text>

            {/* 60 Minute Chapter Ring & 12 Faceted Hour Markers */}
            {Array.from({ length: 60 }).map((_, i) => {
                const angle = i * 6;
                const isHour = i % 5 === 0;
                const len = isHour ? 10 : 3.5;
                const x1 = cx + Math.sin((angle * Math.PI) / 180) * (r - 3);
                const y1 = cy - Math.cos((angle * Math.PI) / 180) * (r - 3);
                const x2 = cx + Math.sin((angle * Math.PI) / 180) * (r - 3 - len);
                const y2 = cy - Math.cos((angle * Math.PI) / 180) * (r - 3 - len);
                return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={clk.textColor} strokeWidth={isHour ? 2.5 : 0.8} strokeLinecap="round" opacity={isHour ? 0.95 : 0.35} />;
            })}

            {/* Beveled Date Aperture at 3 o'clock */}
            <rect x={cx + 34} y={cy - 8} width="22" height="16" rx="2.5" fill="#0b0f19" stroke={clk.borderColor} strokeWidth="1" />
            <text x={cx + 45} y={cy + 4} textAnchor="middle" fill={clk.textColor} fontSize="9" fontWeight="700">{pad(now.getDate())}</text>

            {/* Hour Hand (Faceted Sword Hand) */}
            <line x1={cx} y1={cy} x2={toX(hourAngle, r * 0.52)} y2={toY(hourAngle, r * 0.52)} stroke={clk.textColor} strokeWidth="4" strokeLinecap="round" />
            <line x1={cx} y1={cy} x2={toX(hourAngle, r * 0.48)} y2={toY(hourAngle, r * 0.48)} stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" strokeLinecap="round" />

            {/* Minute Hand (Slender Sword Hand) */}
            <line x1={cx} y1={cy} x2={toX(minuteAngle, r * 0.78)} y2={toY(minuteAngle, r * 0.78)} stroke={clk.textColor} strokeWidth="3" strokeLinecap="round" />
            <line x1={cx} y1={cy} x2={toX(minuteAngle, r * 0.74)} y2={toY(minuteAngle, r * 0.74)} stroke="rgba(255,255,255,0.4)" strokeWidth="1" strokeLinecap="round" />

            {/* Second Hand (Needle with Counterweight Ring) */}
            {clk.showSeconds && (
                <g>
                    <line x1={cx} y1={cy} x2={toX(secondAngle + 180, r * 0.22)} y2={toY(secondAngle + 180, r * 0.22)} stroke={clk.accentColor} strokeWidth="1.5" strokeLinecap="round" />
                    <circle cx={toX(secondAngle + 180, r * 0.16)} cy={toY(secondAngle + 180, r * 0.16)} r="3" fill="none" stroke={clk.accentColor} strokeWidth="1.5" />
                    <line x1={cx} y1={cy} x2={toX(secondAngle, r * 0.88)} y2={toY(secondAngle, r * 0.88)} stroke={clk.accentColor} strokeWidth="1.5" strokeLinecap="round" />
                </g>
            )}

            {/* Layered Center Cap */}
            <circle cx={cx} cy={cy} r="5" fill="#334155" stroke="#1e293b" strokeWidth="1" />
            <circle cx={cx} cy={cy} r="2.2" fill={clk.accentColor} />

            {/* Bottom Date Text */}
            {dateDisplayStr && (
                <text x={cx} y={cy + 62} textAnchor="middle" fill={clk.textColor} fontSize="8" fontWeight="600" opacity="0.6">{dateDisplayStr}</text>
            )}
        </g>
    );
}
