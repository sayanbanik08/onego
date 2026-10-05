import { X } from "lucide-react";
import type { PointerEvent as ReactPointerEvent } from "react";

import DemoDashboardHeader from "./DemoDashboardHeader";

type TextElement = {
    id: string;
    type: "text";
    serialNumber: number;
    x: number;
    y: number;
    text: string;
    fontSize: number;
    color: string;
    backgroundColor?: string;

    fontWeight: number;
    fontFamily: string;
    fontStyle: "normal" | "italic";
    rotation: number;
};

type DesignCanvasProps = {
    elements: TextElement[];
    selectedElementId: string | null;
    setSelectedElementId: (id: string | null) => void;
    deleteElement: (id: string) => void;
    updateElementPosition: (
        id: string,
        x: number,
        y: number
    ) => void;
};

export default function DesignCanvas({
    elements,
    selectedElementId,
    setSelectedElementId,
    deleteElement,
    updateElementPosition,
}: DesignCanvasProps) {
    const handlePointerDown = (
        event: ReactPointerEvent<HTMLDivElement>,
        element: TextElement
    ) => {
        if (event.button !== 0) {
            return;
        }

        event.stopPropagation();

        setSelectedElementId(element.id);

        const startX = event.clientX;
        const startY = event.clientY;

        const initialX = element.x;
        const initialY = element.y;

        const handlePointerMove = (
            moveEvent: PointerEvent
        ) => {
            const deltaX =
                moveEvent.clientX - startX;

            const deltaY =
                moveEvent.clientY - startY;

            const newX = Math.max(
                0,
                initialX + deltaX
            );

            const newY = Math.max(
                0,
                initialY + deltaY
            );

            updateElementPosition(
                element.id,
                newX,
                newY
            );
        };

        const handlePointerUp = () => {
            window.removeEventListener(
                "pointermove",
                handlePointerMove
            );

            window.removeEventListener(
                "pointerup",
                handlePointerUp
            );
        };

        window.addEventListener(
            "pointermove",
            handlePointerMove
        );

        window.addEventListener(
            "pointerup",
            handlePointerUp
        );
    };

    return (
        <section className="min-h-0 flex-1 overflow-y-auto">

            {/* White Portfolio Canvas */}
            <div
                className="min-h-[1200px] w-full bg-white"
                style={{
                    backgroundImage:
                        "radial-gradient(#b8b8b8 1px, transparent 1px)",
                    backgroundSize: "20px 20px",
                }}
            >

                {/* Demo Fixed Dashboard Header */}
                <DemoDashboardHeader />

                {/* EDITABLE DESIGN AREA */}
                <div className="relative min-h-[1120px]">

                    {elements.map((element) => {
                        if (
                            element.type !== "text"
                        ) {
                            return null;
                        }

                        const isSelected =
                            selectedElementId ===
                            element.id;

                        return (
                            <div
                                key={element.id}
                                onPointerDown={(event) =>
                                    handlePointerDown(
                                        event,
                                        element
                                    )
                                }
                                className={`absolute cursor-move select-none ${
                                    isSelected
                                        ? "outline outline-2 outline-blue-500"
                                        : ""
                                }`}
                                style={{
                                    left: element.x,
                                    top: element.y,
                                    transform: `rotate(${element.rotation}deg)`,
                                    transformOrigin:
                                        "center center",
                                    backgroundColor:
                                        element.backgroundColor &&
                                        element.backgroundColor !== "transparent"
                                            ? element.backgroundColor
                                            : undefined,
                                    padding:
                                        element.backgroundColor &&
                                        element.backgroundColor !== "transparent"
                                            ? "4px 8px"
                                            : undefined,
                                    borderRadius:
                                        element.backgroundColor &&
                                        element.backgroundColor !== "transparent"
                                            ? "4px"
                                            : undefined,
                                }}
                            >

                                {/* Delete Button */}
                                {isSelected && (
                                    <button
                                        type="button"
                                        onPointerDown={(event) =>
                                            event.stopPropagation()
                                        }
                                        onClick={(event) => {
                                            event.stopPropagation();

                                            deleteElement(
                                                element.id
                                            );
                                        }}
                                        className="absolute -right-7 -top-7 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full bg-red-600 text-white shadow-md transition hover:bg-red-700"
                                        title="Delete element"
                                    >
                                        <X size={14} />
                                    </button>
                                )}

                                {/* Text */}
                                <span
                                    style={{
                                        fontSize:
                                            element.fontSize,
                                        color:
                                            element.color,
                                        fontWeight:
                                            element.fontWeight,
                                        fontFamily:
                                            element.fontFamily,
                                        fontStyle:
                                            element.fontStyle,
                                        whiteSpace:
                                            "pre",
                                    }}
                                >
                                    {element.text}
                                </span>

                            </div>
                        );
                    })}

                </div>

            </div>

        </section>
    );
}