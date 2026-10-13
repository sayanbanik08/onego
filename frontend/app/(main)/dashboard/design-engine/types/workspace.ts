import type { DashboardBackgroundSettings, CanvasElement } from "./elements";
import type { NavigationElement } from "./navigation";

export type CanvasDocument = {
    id: string;
    name: string;
    elements: CanvasElement[];
    backgroundSettings: DashboardBackgroundSettings;
};

export type DesignWorkspace = {
    schemaVersion: 1;
    id: string;
    activeCanvasId: string;
    canvases: CanvasDocument[];
    sharedNavigation: NavigationElement | null;
};