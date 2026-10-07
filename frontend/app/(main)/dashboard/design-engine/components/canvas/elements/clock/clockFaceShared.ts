import type { ClockElement } from "../../../../types/elements";

/** Props shared by every individual clock face renderer. */
export type ClockFaceProps = {
    clk: ClockElement;
    clockW: number;
    clockH: number;
    // Pre-computed time values
    displayH: number;
    displayM: number;
    displayS: number;
    h12: number;
    ampm: string;
    pad: (n: number) => string;
    timeStr: string;
    dateDisplayStr: string;
    hourAngle: number;
    minuteAngle: number;
    secondAngle: number;
    now: Date;
};
