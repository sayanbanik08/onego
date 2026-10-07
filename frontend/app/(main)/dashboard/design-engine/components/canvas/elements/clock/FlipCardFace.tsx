import React from "react";
import type { ClockFaceProps } from "./clockFaceShared";

export function FlipCardFace({
    clk,
    clockW,
    clockH,
    h12,
    displayM,
    displayS,
    pad,
    dateDisplayStr,
}: ClockFaceProps) {
    const fH = pad(h12);
    const fM = pad(displayM);
    const fS = pad(displayS);
    const cards = clk.showSeconds
        ? [{ val: fH, label: "HOURS" }, { val: fM, label: "MINUTES" }, { val: fS, label: "SECONDS" }]
        : [{ val: fH, label: "HOURS" }, { val: fM, label: "MINUTES" }];

    const cardW = clk.showSeconds ? 76 : 118;
    const cardH = 92;
    const gap = clk.showSeconds ? 12 : 20;
    const totalW = cards.length * cardW + (cards.length - 1) * gap;
    const startX = (clockW - totalW) / 2;
    const cardY = 24;

    return (
        <g>
            {/* Vintage Solid Casing with Screw Rivets */}
            <rect x="0" y="0" width={clockW} height={clockH} rx={clk.borderRadius} fill={clk.bgColor} stroke={clk.borderColor} strokeWidth={clk.borderWidth} />
            {/* Screws in corners */}
            {[[14, 14], [clockW - 14, 14], [14, clockH - 14], [clockW - 14, clockH - 14]].map(([sx, sy], i) => (
                <g key={i}>
                    <circle cx={sx} cy={sy} r="3" fill="#374151" stroke="#1f2937" strokeWidth="0.8" />
                    <line x1={sx - 1.8} y1={sy} x2={sx + 1.8} y2={sy} stroke="#111827" strokeWidth="0.8" />
                </g>
            ))}

            {/* Flip Cards */}
            {cards.map((c, idx) => {
                const cx0 = startX + idx * (cardW + gap);
                const halfH = cardH / 2;
                return (
                    <g key={idx}>
                        {/* Shadow underneath */}
                        <rect x={cx0 + 2} y={cardY + 3} width={cardW} height={cardH} rx="7" fill="rgba(0,0,0,0.5)" />

                        {/* Top Flap */}
                        <rect x={cx0} y={cardY} width={cardW} height={halfH - 1} rx="7" fill={`url(#flip-top-${clk.id})`} stroke="#374151" strokeWidth="1" />
                        <rect x={cx0 + 2} y={cardY + 1} width={cardW - 4} height="2" fill="rgba(255,255,255,0.12)" />

                        {/* Bottom Flap */}
                        <rect x={cx0} y={cardY + halfH + 1} width={cardW} height={halfH - 1} rx="7" fill={`url(#flip-bot-${clk.id})`} stroke="#2b303c" strokeWidth="1" />

                        {/* Center Physical Slot */}
                        <line x1={cx0} y1={cardY + halfH} x2={cx0 + cardW} y2={cardY + halfH} stroke="#0b0d12" strokeWidth="3" />
                        <line x1={cx0} y1={cardY + halfH + 1.5} x2={cx0 + cardW} y2={cardY + halfH + 1.5} stroke="rgba(255,255,255,0.08)" strokeWidth="1" />

                        {/* Side Hinge Clips */}
                        <rect x={cx0 - 3} y={cardY + halfH - 4} width="5" height="8" rx="1.5" fill="#6b7280" stroke="#1f2937" strokeWidth="0.6" />
                        <rect x={cx0 + cardW - 2} y={cardY + halfH - 4} width="5" height="8" rx="1.5" fill="#6b7280" stroke="#1f2937" strokeWidth="0.6" />

                        {/* Big Bold Split Numeral */}
                        <text x={cx0 + cardW / 2} y={cardY + halfH + 16} textAnchor="middle" fill={clk.textColor} fontSize={clk.showSeconds ? 44 : 54} fontWeight="900" fontFamily="Impact, 'Arial Black', sans-serif" letterSpacing="1">{c.val}</text>

                        {/* Label Under Card */}
                        <text x={cx0 + cardW / 2} y={cardY + cardH + 16} textAnchor="middle" fill={clk.textColor} fontSize="8" fontWeight="700" letterSpacing="1.5" opacity="0.5">{c.label}</text>

                        {/* Colon Separator */}
                        {idx < cards.length - 1 && (
                            <g>
                                <circle cx={cx0 + cardW + gap / 2} cy={cardY + halfH - 12} r="3" fill={clk.accentColor} />
                                <circle cx={cx0 + cardW + gap / 2} cy={cardY + halfH + 12} r="3" fill={clk.accentColor} />
                            </g>
                        )}
                    </g>
                );
            })}

            {/* Bottom Date Plaque */}
            {dateDisplayStr && (
                <g>
                    <rect x="50" y="156" width={clockW - 100} height="22" rx="4" fill="#14171e" stroke="#2a2e39" strokeWidth="1" />
                    <text x={clockW / 2} y="171" textAnchor="middle" fill={clk.accentColor} fontSize="9.5" fontWeight="700" letterSpacing="2">{dateDisplayStr}</text>
                </g>
            )}
        </g>
    );
}
