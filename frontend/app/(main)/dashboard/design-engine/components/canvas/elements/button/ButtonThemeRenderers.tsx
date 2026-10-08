"use client";

import React from "react";
import type { ButtonElement } from "../../../../types/button";
import {
    getButtonRadius,
    getButtonShadow,
} from "./buttonHelpers";
import "./button-themes.css";

type ButtonRendererProps = {
    element: ButtonElement;
    isEditing: boolean;
    editingText: string;
    setEditingText: (val: string) => void;
    handleBlur: () => void;
    handleKeyDown: (e: React.KeyboardEvent) => void;
    onButtonClick: (e: React.MouseEvent) => void;
};

export default function ButtonThemeRenderer({
    element,
    isEditing,
    editingText,
    setEditingText,
    handleBlur,
    handleKeyDown,
    onButtonClick,
}: ButtonRendererProps) {
    const text = element.text || "Button";
    const customRadius = getButtonRadius(element);
    const customShadow = getButtonShadow(element);

    const paddingX = element.paddingX ?? 24;
    const paddingY = element.paddingY ?? 12;
    const paddingStyle = `${paddingY}px ${paddingX}px`;

    // ── Background Image Styles (Applied across all themes) ──────────────
    const hasBgImage = Boolean(element.bgImage);
    const bgImageStyle: React.CSSProperties = hasBgImage
        ? {
              backgroundImage: `url(${element.bgImage})`,
              backgroundSize: element.bgImageFit || "cover",
              backgroundPosition: element.bgImagePosition || "center",
              backgroundRepeat: element.bgImageFit === "repeat" ? "repeat" : "no-repeat",
          }
        : {};

    const renderBgImageOverlay = (tintColor?: string) => {
        if (!hasBgImage) return null;
        return (
            <div
                className="pointer-events-none absolute inset-0 z-0 rounded-[inherit]"
                style={{
                    backgroundColor: tintColor || "black",
                    opacity: 1 - (element.bgImageOpacity ?? 1),
                }}
            />
        );
    };

    // ── SPECIAL: Custom Drawn Shape (Paint Studio) ──────────────────────
    if (element.drawnShape?.hasDrawnShape && element.drawnShape.dataUrl) {
        return (
            <button
                type="button"
                onClick={onButtonClick}
                className="relative inline-flex items-center justify-center cursor-pointer transition-transform duration-200 active:scale-95 bg-transparent border-0 outline-none p-0"
                style={{
                    width: `${element.drawnShape.width}px`,
                    height: `${element.drawnShape.height}px`,
                    backgroundImage: `url(${element.drawnShape.dataUrl})`,
                    backgroundSize: "contain",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    backgroundColor: "transparent",
                    boxShadow: customShadow !== "none" ? customShadow : undefined,
                    borderRadius: customRadius,
                }}
            >
                <div
                    className="relative z-10 flex items-center justify-center px-4 py-2"
                    style={{
                        fontFamily: element.fontFamily,
                        fontSize: `${element.fontSize}px`,
                        color: element.textColor || "#ffffff",
                        textShadow: "0 2px 4px rgba(0,0,0,0.85)",
                    }}
                >
                    <EditableContent
                        isEditing={isEditing}
                        editingText={editingText}
                        setEditingText={setEditingText}
                        handleBlur={handleBlur}
                        handleKeyDown={handleKeyDown}
                        text={text}
                        fontSize={element.fontSize}
                    />
                </div>
            </button>
        );
    }

    // ── BUTTON 1: 3D Controller Joypad Button ───────────────────────────
    if (element.theme === "button-1" || element.theme === "gamepad-3d") {
        return (
            <Button1Gamepad
                element={element}
                text={text}
                onClick={onButtonClick}
                isEditing={isEditing}
                editingText={editingText}
                setEditingText={setEditingText}
                handleBlur={handleBlur}
                handleKeyDown={handleKeyDown}
                customShadow={customShadow}
            />
        );
    }

    // ── BUTTON 3: Skew Slide Hover Button ───────────────────────────────
    if (element.theme === "button-3" || element.theme === "skew-slide") {
        return (
            <button
                type="button"
                onClick={onButtonClick}
                className="uiverse-btn-3 relative overflow-hidden"
                style={{
                    fontFamily: element.fontFamily,
                    fontSize: `${element.fontSize}px`,
                    padding: paddingStyle,
                    minWidth: "auto",
                    minHeight: "auto",
                    color: element.textColor || "#ffffff",
                    borderRadius: customRadius,
                    boxShadow: customShadow !== "none" ? customShadow : undefined,
                    backgroundColor:
                        element.bgColor && element.bgColor !== "transparent"
                            ? element.bgColor
                            : "#000000",
                    border: element.borderWidth
                        ? `${element.borderWidth}px ${element.borderStyle} ${element.borderColor}`
                        : undefined,
                    ...bgImageStyle,
                }}
            >
                {renderBgImageOverlay()}
                <span className="relative z-10 flex items-center justify-center">
                    <EditableContent
                        isEditing={isEditing}
                        editingText={editingText}
                        setEditingText={setEditingText}
                        handleBlur={handleBlur}
                        handleKeyDown={handleKeyDown}
                        text={text}
                        fontSize={element.fontSize}
                    />
                </span>
            </button>
        );
    }

    // ── BUTTON 4: Retro Neo-Brutalist Button ────────────────────────────
    if (element.theme === "button-4" || element.theme === "neo-brutalist") {
        return (
            <button
                type="button"
                onClick={onButtonClick}
                className="uiverse-btn-4 relative overflow-hidden"
                style={{
                    fontFamily: element.fontFamily,
                    fontSize: `${element.fontSize}px`,
                    padding: paddingStyle,
                    minWidth: "auto",
                    minHeight: "auto",
                    borderRadius: customRadius,
                    color: element.textColor || "#fafafa",
                    borderColor: element.borderColor || "#fafafa",
                    borderWidth: `${element.borderWidth ?? 2}px`,
                    borderStyle: element.borderStyle || "solid",
                    boxShadow:
                        customShadow !== "none"
                            ? customShadow
                            : "3px 3px #111111, 4px 4px #fafafa",
                    backgroundColor:
                        element.bgColor && element.bgColor !== "transparent"
                            ? element.bgColor
                            : "#252525",
                    ...bgImageStyle,
                }}
            >
                {renderBgImageOverlay()}
                <span className="relative z-10 flex items-center justify-center">
                    <EditableContent
                        isEditing={isEditing}
                        editingText={editingText}
                        setEditingText={setEditingText}
                        handleBlur={handleBlur}
                        handleKeyDown={handleKeyDown}
                        text={text}
                        fontSize={element.fontSize}
                    />
                </span>
            </button>
        );
    }

    // ── BUTTON 5: Layered 3D Multi-shadow Steps Button (Exact User Snippet) ──
    if (element.theme === "button-5" || element.theme === "stacked-3d") {
        return (
            <button
                type="button"
                onClick={onButtonClick}
                className="uiverse-btn-5 relative"
                style={{
                    fontFamily: element.fontFamily,
                    fontSize: `${element.fontSize}px`,
                    padding: paddingStyle,
                    minWidth: "auto",
                    minHeight: "auto",
                    borderRadius: customRadius,
                    color: element.textColor || "#000000",
                    border: element.borderWidth
                        ? `${element.borderWidth}px ${element.borderStyle} ${element.borderColor}`
                        : "none",
                    boxShadow:
                        customShadow !== "none"
                            ? customShadow
                            : undefined, // Uses CSS 9-step hsl box-shadow by default
                    backgroundColor:
                        element.bgColor && element.bgColor !== "transparent"
                            ? element.bgColor
                            : "white",
                    ...bgImageStyle,
                }}
            >
                {renderBgImageOverlay()}
                <span className="relative z-10 flex items-center justify-center">
                    <EditableContent
                        isEditing={isEditing}
                        editingText={editingText}
                        setEditingText={setEditingText}
                        handleBlur={handleBlur}
                        handleKeyDown={handleKeyDown}
                        text={text}
                        fontSize={element.fontSize}
                    />
                </span>
            </button>
        );
    }

    // ── BUTTON 6: Kinetic Letter Slide Button (Zero Width Shift) ─────────
    if (element.theme === "button-6" || element.theme === "letter-slide") {
        const chars = text.split("");
        return (
            <button
                type="button"
                onClick={onButtonClick}
                className="uiverse-btn-6 relative overflow-hidden"
                style={{
                    fontFamily: element.fontFamily,
                    fontSize: `${element.fontSize}px`,
                    padding: paddingStyle,
                    height: "auto",
                    minHeight: "auto",
                    borderRadius: customRadius,
                    backgroundColor:
                        element.bgColor && element.bgColor !== "transparent"
                            ? element.bgColor
                            : "#3653f8",
                    color: element.textColor || "#ffffff",
                    borderColor: element.borderColor,
                    borderWidth: element.borderWidth ? `${element.borderWidth}px` : undefined,
                    borderStyle: element.borderStyle,
                    boxShadow: customShadow !== "none" ? customShadow : undefined,
                    ...bgImageStyle,
                }}
            >
                {renderBgImageOverlay()}
                <div className="relative z-10 flex items-center justify-center">
                    {isEditing ? (
                        <EditableContent
                            isEditing={isEditing}
                            editingText={editingText}
                            setEditingText={setEditingText}
                            handleBlur={handleBlur}
                            handleKeyDown={handleKeyDown}
                            text={text}
                            fontSize={element.fontSize}
                        />
                    ) : (
                        <div className="kinetic-letters-grid">
                            <span className="span-mother">
                                {chars.map((c, i) => (
                                    <span
                                        key={i}
                                        style={{
                                            transition: `${0.2 + (i % 8) * 0.1}s`,
                                        }}
                                    >
                                        {c === " " ? "\u00A0" : c}
                                    </span>
                                ))}
                            </span>
                            <span className="span-mother2">
                                {chars.map((c, i) => (
                                    <span
                                        key={i}
                                        style={{
                                            transition: `${0.2 + (i % 8) * 0.1}s`,
                                        }}
                                    >
                                        {c === " " ? "\u00A0" : c}
                                    </span>
                                ))}
                            </span>
                        </div>
                    )}
                </div>
            </button>
        );
    }

    // ── BUTTON 7: Glossy Jelly Pill Button (Mutually Exclusive BG & Photo) ─
    if (element.theme === "button-7" || element.theme === "jelly-pill") {
        // When hasBgImage is true, do not mix background color onto the image!
        const pillBg = hasBgImage
            ? "transparent"
            : element.bgColor && element.bgColor !== "transparent"
            ? element.bgColor
            : "rgb(151, 95, 255)";

        return (
            <button
                type="button"
                onClick={onButtonClick}
                className="uiverse-btn-7 relative overflow-hidden"
                style={{
                    fontFamily: element.fontFamily,
                    fontSize: `${element.fontSize}px`,
                    padding: paddingStyle,
                    height: "auto",
                    minHeight: "auto",
                    minWidth: "auto",
                    borderRadius: customRadius,
                    backgroundColor: pillBg,
                    color: element.textColor || "#ffffff",
                    borderColor: element.borderColor,
                    borderWidth: element.borderWidth ? `${element.borderWidth}px` : undefined,
                    borderStyle: element.borderStyle,
                    boxShadow: customShadow !== "none" ? customShadow : undefined,
                    ...bgImageStyle,
                }}
            >
                {hasBgImage && (
                    <div
                        className="pointer-events-none absolute inset-0 z-0 rounded-[inherit]"
                        style={{
                            backgroundColor: "black",
                            opacity: 1 - (element.bgImageOpacity ?? 1),
                        }}
                    />
                )}
                <span className="relative z-10 flex items-center justify-center">
                    <EditableContent
                        isEditing={isEditing}
                        editingText={editingText}
                        setEditingText={setEditingText}
                        handleBlur={handleBlur}
                        handleKeyDown={handleKeyDown}
                        text={text}
                        fontSize={element.fontSize}
                    />
                </span>
            </button>
        );
    }

    // ── BUTTON 8: Cyber Cut Border Hover Button ─────────────────────────
    if (element.theme === "button-8" || element.theme === "cyber-cut") {
        const bgVal =
            element.bgColor && element.bgColor !== "transparent"
                ? element.bgColor
                : "#212121";

        return (
            <button
                type="button"
                onClick={onButtonClick}
                className="uiverse-btn-8 relative overflow-hidden"
                style={
                    {
                        "--btn-bg": bgVal,
                        borderRadius: customRadius,
                        backgroundColor: bgVal,
                        boxShadow: customShadow !== "none" ? customShadow : undefined,
                        ...bgImageStyle,
                    } as React.CSSProperties
                }
            >
                {renderBgImageOverlay()}
                <a
                    href="#"
                    onClick={(e) => e.preventDefault()}
                    className="relative z-10"
                    style={{
                        padding: paddingStyle,
                        borderRadius: customRadius,
                        borderColor: element.borderColor || "#fefefe",
                        borderWidth: `${element.borderWidth ?? 2}px`,
                        borderStyle: element.borderStyle || "solid",
                        color: element.textColor || "#fefefe",
                        fontSize: `${element.fontSize}px`,
                        fontFamily: element.fontFamily,
                    }}
                >
                    <span
                        style={{
                            fontFamily: element.fontFamily,
                            fontSize: `${element.fontSize}px`,
                        }}
                    >
                        <EditableContent
                            isEditing={isEditing}
                            editingText={editingText}
                            setEditingText={setEditingText}
                            handleBlur={handleBlur}
                            handleKeyDown={handleKeyDown}
                            text={text}
                            fontSize={element.fontSize}
                        />
                    </span>
                </a>
            </button>
        );
    }

    // ── CUSTOM / USER DEFINED BUTTON (Full Styling Support) ─────────────
    return (
        <button
            type="button"
            onClick={onButtonClick}
            className="group relative inline-flex items-center justify-center cursor-pointer select-none transition-all duration-200 active:scale-95 overflow-hidden"
            style={{
                fontFamily: element.fontFamily,
                fontSize: `${element.fontSize}px`,
                color: element.textColor || "#ffffff",
                padding: paddingStyle,
                backgroundColor:
                    element.bgColor && element.bgColor !== "transparent"
                        ? element.bgColor
                        : "transparent",
                borderRadius: customRadius,
                border: `${element.borderWidth ?? 2}px ${element.borderStyle || "solid"} ${element.borderColor || "#3b82f6"}`,
                boxShadow: customShadow !== "none" ? customShadow : undefined,
                ...bgImageStyle,
            }}
        >
            {renderBgImageOverlay()}
            <span className="relative z-10 flex items-center justify-center">
                <EditableContent
                    isEditing={isEditing}
                    editingText={editingText}
                    setEditingText={setEditingText}
                    handleBlur={handleBlur}
                    handleKeyDown={handleKeyDown}
                    text={text}
                    fontSize={element.fontSize}
                />
            </span>
        </button>
    );
}

// ── Inline Editable Text Field ──────────────────────────────────────────
function EditableContent({
    isEditing,
    editingText,
    setEditingText,
    handleBlur,
    handleKeyDown,
    text,
    fontSize,
}: {
    isEditing: boolean;
    editingText: string;
    setEditingText: (t: string) => void;
    handleBlur: () => void;
    handleKeyDown: (e: React.KeyboardEvent) => void;
    text: string;
    fontSize: number;
}) {
    if (isEditing) {
        return (
            <input
                autoFocus
                type="text"
                value={editingText}
                onChange={(e) => setEditingText(e.target.value)}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                className="bg-black/70 px-2 py-0.5 text-center text-inherit outline-none ring-1 ring-blue-500 rounded"
                style={{ fontSize: `${fontSize}px` }}
            />
        );
    }
    return <span>{text}</span>;
}

// ── BUTTON 1 GAMEPAD JOYPAD COMPONENT ───────────────────────────────────
function Button1Gamepad({
    element,
    text,
    onClick,
    isEditing,
    editingText,
    setEditingText,
    handleBlur,
    handleKeyDown,
    customShadow,
}: {
    element: ButtonElement;
    text: string;
    onClick: (e: React.MouseEvent) => void;
    isEditing: boolean;
    editingText: string;
    setEditingText: (t: string) => void;
    handleBlur: () => void;
    handleKeyDown: (e: React.KeyboardEvent) => void;
    customShadow: string;
}) {
    const customBg =
        element.bgColor && element.bgColor !== "transparent"
            ? element.bgColor
            : undefined;

    return (
        <div
            onClick={onClick}
            className="uiverse-btn-1-wrapper cursor-pointer"
            style={{
                boxShadow: customShadow !== "none" ? customShadow : undefined,
            }}
        >
            <section className="row">
                {/* 4 Touch Quadrants */}
                <div className="touch">
                    <div className="t t1" />
                    <div className="t t2" />
                    <div className="t t3" />
                    <div className="t t4" />
                </div>

                <div className="container">
                    <div
                        className="around relative overflow-hidden"
                        style={customBg ? { background: customBg } : undefined}
                    >
                        <div
                            className="handle relative z-10"
                            style={customBg ? { background: customBg } : undefined}
                        >
                            <div className="button-wrapper">
                                <div
                                    className="inside"
                                    style={customBg ? { background: customBg } : undefined}
                                >
                                    <div className="dot" />
                                    <div className="dot" />
                                    <div className="dot" />
                                    <div className="dot" />

                                    <div
                                        className="relative z-10 text-center px-1 font-semibold"
                                        style={{
                                            fontFamily: element.fontFamily,
                                            fontSize: `${element.fontSize}px`,
                                            color: element.textColor || "#2c3e50",
                                        }}
                                    >
                                        <EditableContent
                                            isEditing={isEditing}
                                            editingText={editingText}
                                            setEditingText={setEditingText}
                                            handleBlur={handleBlur}
                                            handleKeyDown={handleKeyDown}
                                            text={text}
                                            fontSize={element.fontSize}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 4 SVGs directly from User Snippet 1 */}
                    <svg className="icon i-top" viewBox="0 0 1024 1024">
                        <path d="M512 330.666667c14.933333 0 29.866667 4.266667 40.533333 14.933333l277.33333399 234.666667c27.733333 23.466667 29.866667 64 8.53333301 89.6-23.466667 27.733333-64 29.866667-89.6 8.53333299L512 477.866667l-236.8 200.53333299c-27.733333 23.466667-68.266667 19.19999999-89.6-8.53333299-23.466667-27.733333-19.19999999-68.266667 8.53333301-89.6l277.33333399-234.666667c10.666667-10.666667 25.6-14.933333 40.533333-14.933333z" />
                    </svg>
                    <svg className="icon i-right" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M135.417 100C135.417 102.917 134.583 105.833 132.5 107.917L86.6667 162.083C82.0833 167.5 74.1667 167.917 69.1667 163.75C63.75 159.167 63.3333 151.25 67.5 146.25L106.667 100L67.5 53.75C62.9167 48.3333 63.75 40.4167 69.1667 36.25C74.5833 31.6667 82.5 32.5 86.6667 37.9167L132.5 92.0833C134.583 94.1667 135.417 97.0833 135.417 100Z" />
                    </svg>
                    <svg className="icon i-bottom" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M100 135.417C97.0833 135.417 94.1667 134.583 92.0833 132.5L37.9167 86.6667C32.5 82.0833 32.0833 74.1667 36.25 69.1667C40.8333 63.75 48.75 63.3333 53.75 67.5L100 106.667L146.25 67.5C151.667 62.9167 159.583 63.75 163.75 69.1667C168.333 74.5833 167.5 82.5 162.083 86.6667L107.917 132.5C105.833 134.583 102.917 135.417 100 135.417Z" />
                    </svg>
                    <svg className="icon i-left" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M64.5833 100C64.5833 97.0833 65.4167 94.1667 67.5 92.0833L113.333 37.9167C117.917 32.5 125.833 32.0833 130.833 36.25C136.25 40.8333 136.667 48.75 132.5 53.75L93.3333 100L132.5 146.25C137.083 151.667 136.25 159.583 130.833 163.75C125.417 168.333 117.5 167.5 113.333 162.083L67.5 107.917C65.4167 105.833 64.5833 102.917 64.5833 100Z" />
                    </svg>
                </div>
            </section>
        </div>
    );
}
