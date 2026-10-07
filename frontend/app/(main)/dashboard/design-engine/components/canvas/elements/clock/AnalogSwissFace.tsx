import React from "react";
import type { ClockFaceProps } from "./clockFaceShared";

export function AnalogSwissFace({
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
            {/* Pure Bauhaus Minimalist Case */}
            <rect x="0" y="0" width={clockW} height={clockH} rx={clk.borderRadius} fill={clk.bgColor} stroke={clk.borderColor} strokeWidth={clk.borderWidth} />
            <circle cx={cx} cy={cy} r={r} fill={clk.bgColor} stroke={clk.textColor} strokeWidth="2.5" />

            {/* 12 Bold Bauhaus Baton Markers + 48 Minute Ticks */}
            {Array.from({ length: 60 }).map((_, i) => {
                const angle = i * 6;
                const isHour = i % 5 === 0;
                const len = isHour ? 12 : 4.5;
                const x1 = cx + Math.sin((angle * Math.PI) / 180) * (r - 2);
                const y1 = cy - Math.cos((angle * Math.PI) / 180) * (r - 2);
                const x2 = cx + Math.sin((angle * Math.PI) / 180) * (r - 2 - len);
                const y2 = cy - Math.cos((angle * Math.PI) / 180) * (r - 2 - len);
                return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={clk.textColor} strokeWidth={isHour ? 3.5 : 1} strokeLinecap="square" />;
            })}

            {/* Hour Baton Hand */}
            <line x1={cx} y1={cy} x2={toX(hourAngle, r * 0.55)} y2={toY(hourAngle, r * 0.55)} stroke={clk.textColor} strokeWidth="5.5" strokeLinecap="square" />

            {/* Minute Baton Hand */}
            <line x1={cx} y1={cy} x2={toX(minuteAngle, r * 0.82)} y2={toY(minuteAngle, r * 0.82)} stroke={clk.textColor} strokeWidth="3.8" strokeLinecap="square" />

            {/* Iconic Swiss Railway Red Lollipop Second Hand */}
            {clk.showSeconds && (
                <g>
                    <line x1={cx} y1={cy} x2={toX(secondAngle + 180, r * 0.2)} y2={toY(secondAngle + 180, r * 0.2)} stroke={clk.accentColor} strokeWidth="1.8" />
                    <line x1={cx} y1={cy} x2={toX(secondAngle, r * 0.68)} y2={toY(secondAngle, r * 0.68)} stroke={clk.accentColor} strokeWidth="1.8" />
                    <circle cx={toX(secondAngle, r * 0.72)} cy={toY(secondAngle, r * 0.72)} r="5.5" fill={clk.accentColor} />
                </g>
            )}

            {/* Prominent Center Hub */}
            <circle cx={cx} cy={cy} r="5" fill={clk.accentColor} />
            <circle cx={cx} cy={cy} r="2" fill={clk.bgColor} />

            {/* Minimalist Date at 6 o'clock */}
            {dateDisplayStr && (
                <g>
                    <rect x={cx - 24} y={cy + 34} width="48" height="15" rx="3" fill="rgba(0,0,0,0.25)" stroke={clk.borderColor} strokeWidth="0.8" />
                    <text x={cx} y={cy + 45} textAnchor="middle" fill={clk.textColor} fontSize="8.5" fontWeight="700">
                        {dateDisplayStr.split(" • ")[0] || pad(now.getDate())}
                    </text>
                </g>
            )}
        </g>
    );
}
