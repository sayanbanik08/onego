"use client";

import { useState } from "react";

import DesignEngineHeader from "./components/DesignEngineHeader";
import ElementsPanel from "./components/ElementsPanel";
import DesignCanvas from "./components/DesignCanvas";
import PropertiesPanel from "./components/PropertiesPanel";

export default function DesignEnginePage() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isElementsMinimised, setIsElementsMinimised] = useState(false);
    const [isElementsFloating, setIsElementsFloating] = useState(false);

    const [floatingPosition, setFloatingPosition] = useState({
        x: 20,
        y: 80,
    });

    const [isPropertiesMenuOpen, setIsPropertiesMenuOpen] = useState(false);
    const [isPropertiesMinimised, setIsPropertiesMinimised] = useState(false);
    const [isPropertiesFloating, setIsPropertiesFloating] = useState(false);

    const [propertiesFloatingPosition, setPropertiesFloatingPosition] =
        useState({
            x: 20,
            y: 80,
        });

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
                />

                {/* Canvas */}
                <DesignCanvas />

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
                />

            </div>
        </main>
    );
}