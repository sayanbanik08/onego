"use client";

import { useState } from "react";

import DesignEngineHeader from "./components/DesignEngineHeader";
import ElementsPanel from "./components/ElementsPanel";
import DesignCanvas from "./components/DesignCanvas";
import PropertiesPanel from "./components/PropertiesPanel";
import LayersPanel from "./components/LayersPanel";

export type TextElement = {
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

export default function DesignEnginePage() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isElementsMinimised, setIsElementsMinimised] = useState(false);
    const [isElementsFloating, setIsElementsFloating] = useState(false);
    const [isLayersMinimised, setIsLayersMinimised] = useState(false);

    const [floatingPosition, setFloatingPosition] = useState({
        x: 20,
        y: 80,
    });

    const [isPropertiesMenuOpen, setIsPropertiesMenuOpen] = useState(false);
    const [isPropertiesMinimised, setIsPropertiesMinimised] =
        useState(false);
    const [isPropertiesFloating, setIsPropertiesFloating] = useState(false);

    const [propertiesFloatingPosition, setPropertiesFloatingPosition] =
        useState({
            x: 20,
            y: 80,
        });

    const [elements, setElements] = useState<TextElement[]>([]);
    const [selectedElementId, setSelectedElementId] = useState<string | null>(
        null
    );

    const addTextElement = () => {
        const newTextElement: TextElement = {
            id: crypto.randomUUID(),
            type: "text",
            serialNumber: elements.length + 1,
            x: 100,
            y: 100,
            text: "Text",
            fontSize: 24,
            color: "#000000",
            backgroundColor: "transparent",

            fontWeight: 400,
            fontFamily: "Arial",
            fontStyle: "normal",
            rotation: 0,
        };

        setElements((prev) => [...prev, newTextElement]);
        setSelectedElementId(newTextElement.id);
    };

    const selectedElement =
        elements.find((element) => element.id === selectedElementId) ?? null;

    const updateElement = (
        id: string,
        updates: Partial<TextElement>
    ) => {
        setElements((prev) =>
            prev.map((element) =>
                element.id === id
                    ? { ...element, ...updates }
                    : element
            )
        );
    };

    const deleteElement = (id: string) => {
        setElements((prev) => {
            const remainingElements = prev.filter(
                (element) => element.id !== id
            );

            return remainingElements.map((element, index) => ({
                ...element,
                serialNumber: index + 1,
            }));
        });

        setSelectedElementId(null);
    };

    const updateElementPosition = (
        id: string,
        x: number,
        y: number
    ) => {
        setElements((prev) =>
            prev.map((element) =>
                element.id === id
                    ? { ...element, x, y }
                    : element
            )
        );
    };

    const reorderElements = (
        sourceId: string,
        targetId: string
    ) => {
        setElements((prev) => {
            const sourceIndex = prev.findIndex(
                (element) => element.id === sourceId
            );

            const targetIndex = prev.findIndex(
                (element) => element.id === targetId
            );

            if (
                sourceIndex === -1 ||
                targetIndex === -1 ||
                sourceIndex === targetIndex
            ) {
                return prev;
            }

            const next = [...prev];

            const [movedElement] = next.splice(sourceIndex, 1);

            next.splice(targetIndex, 0, movedElement);

            return next;
        });
    };

    return (
        <main className="relative h-screen overflow-hidden bg-black text-white">

            {/* Header */}
            <DesignEngineHeader />

            {/* Editor Area */}
            <div className="flex h-[calc(100vh-4rem)] min-h-0">

                {/* Left Panel */}
                <ElementsPanel
                    isMenuOpen={isMenuOpen}
                    setIsMenuOpen={setIsMenuOpen}
                    isElementsMinimised={isElementsMinimised}
                    setIsElementsMinimised={setIsElementsMinimised}
                    isElementsFloating={isElementsFloating}
                    setIsElementsFloating={setIsElementsFloating}
                    floatingPosition={floatingPosition}
                    setFloatingPosition={setFloatingPosition}
                    onAddText={addTextElement}
                />

                {/* Center Area */}
                <div className="flex min-w-0 min-h-0 flex-1 flex-col">

                    {/* Canvas */}
                    <DesignCanvas
                        elements={elements}
                        selectedElementId={selectedElementId}
                        setSelectedElementId={setSelectedElementId}
                        deleteElement={deleteElement}
                        updateElementPosition={updateElementPosition}
                    />

                    {/* Bottom Layers Dock */}
                    <LayersPanel
                        elements={elements}
                        selectedElementId={selectedElementId}
                        setSelectedElementId={setSelectedElementId}
                        reorderElements={reorderElements}
                        isMinimised={isLayersMinimised}
                        setIsMinimised={setIsLayersMinimised}
                    />

                </div>

                {/* Right Panel */}
                <PropertiesPanel
                    isMenuOpen={isPropertiesMenuOpen}
                    setIsMenuOpen={setIsPropertiesMenuOpen}
                    isPropertiesMinimised={isPropertiesMinimised}
                    setIsPropertiesMinimised={setIsPropertiesMinimised}
                    isPropertiesFloating={isPropertiesFloating}
                    setIsPropertiesFloating={setIsPropertiesFloating}
                    floatingPosition={propertiesFloatingPosition}
                    setFloatingPosition={setPropertiesFloatingPosition}
                    selectedElement={selectedElement}
                    updateElement={updateElement}
                />

            </div>
        </main>
    );
}