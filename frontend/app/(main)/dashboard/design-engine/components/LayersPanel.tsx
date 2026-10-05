import { ChevronDown, ChevronUp, GripVertical } from "lucide-react";

type LayerElement = {
    id: string;
    type: string;
    serialNumber: number;
};

type LayersPanelProps = {
    elements: LayerElement[];
    selectedElementId: string | null;
    setSelectedElementId: (id: string | null) => void;
    reorderElements: (sourceId: string, targetId: string) => void;
    isMinimised: boolean;
    setIsMinimised: (value: boolean) => void;
};

export default function LayersPanel({
    elements,
    selectedElementId,
    setSelectedElementId,
    reorderElements,
    isMinimised,
    setIsMinimised,
}: LayersPanelProps) {
    const handleDragStart = (
        event: React.DragEvent<HTMLDivElement>,
        id: string
    ) => {
        event.dataTransfer.setData("text/plain", id);
        event.dataTransfer.effectAllowed = "move";
    };

    const handleDragOver = (
        event: React.DragEvent<HTMLDivElement>
    ) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = "move";
    };

    const handleDrop = (
        event: React.DragEvent<HTMLDivElement>,
        targetId: string
    ) => {
        event.preventDefault();

        const sourceId = event.dataTransfer.getData("text/plain");

        if (!sourceId || sourceId === targetId) {
            return;
        }

        reorderElements(sourceId, targetId);
    };

    return (
        <section
            className={`shrink-0 border-t border-neutral-800 bg-neutral-950 ${isMinimised ? "h-10" : "h-56"
                }`}
        >
            {/* Layers Header */}
            <div className="flex h-10 items-center justify-between border-b border-neutral-800 px-3">
                <span className="text-sm font-medium text-white">
                    Layers
                </span>

                <button
                    type="button"
                    onClick={() => setIsMinimised(!isMinimised)}
                    className="flex h-7 w-7 items-center justify-center rounded-md text-neutral-400 transition hover:bg-neutral-800 hover:text-white"
                    title={
                        isMinimised
                            ? "Expand Layers"
                            : "Minimise Layers"
                    }
                >
                    {isMinimised ? (
                        <ChevronUp size={16} />
                    ) : (
                        <ChevronDown size={16} />
                    )}
                </button>
            </div>

            {/* Layers Content */}
            {!isMinimised && (
                <div className="h-[calc(100%-2.5rem)] overflow-y-auto p-2">
                    {elements.length === 0 ? (
                        <div className="flex h-full items-center justify-center text-sm text-neutral-500">
                            No elements
                        </div>
                    ) : (
                        <div className="space-y-1">
                            {[...elements]
                                .reverse()
                                .map((element) => {
                                    const isSelected =
                                        selectedElementId ===
                                        element.id;

                                    return (
                                        <div
                                            key={element.id}
                                            draggable
                                            onDragStart={(event) =>
                                                handleDragStart(
                                                    event,
                                                    element.id
                                                )
                                            }
                                            onDragOver={handleDragOver}
                                            onDrop={(event) =>
                                                handleDrop(
                                                    event,
                                                    element.id
                                                )
                                            }
                                            onClick={() =>
                                                setSelectedElementId(
                                                    element.id
                                                )
                                            }
                                            className={`flex cursor-grab items-center rounded-md px-2 py-2 text-sm transition active:cursor-grabbing ${isSelected
                                                    ? "bg-neutral-800 text-white"
                                                    : "text-neutral-400 hover:bg-neutral-900 hover:text-white"
                                                }`}
                                        >
                                            <GripVertical
                                                size={15}
                                                className="mr-2 shrink-0 text-neutral-500"
                                            />

                                            <div className="min-w-0">
                                                <div className="truncate font-medium">
                                                    Element{" "}
                                                    {element.serialNumber}
                                                </div>

                                                <div className="text-xs text-neutral-500">
                                                    Type:{" "}
                                                    {element.type
                                                        .charAt(0)
                                                        .toUpperCase() +
                                                        element.type.slice(
                                                            1
                                                        )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                        </div>
                    )}
                </div>
            )}
        </section>
    );
}