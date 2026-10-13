import { DEFAULT_BACKGROUND_SETTINGS } from "../constants/defaults";
import type { CanvasDocument, DesignWorkspace } from "../types/workspace";

export const DESIGN_WORKSPACE_STORAGE_KEY = "onego.design-engine.workspace.v1";

export function createCanvasDocument(name: string): CanvasDocument {
    return {
        id: crypto.randomUUID(),
        name,
        elements: [],
        backgroundSettings: { ...DEFAULT_BACKGROUND_SETTINGS },
    };
}

export function createDesignWorkspace(): DesignWorkspace {
    const firstCanvas = createCanvasDocument("Home");

    return {
        schemaVersion: 1,
        id: crypto.randomUUID(),
        activeCanvasId: firstCanvas.id,
        canvases: [firstCanvas],
        sharedNavigation: null,
    };
}

export function loadDesignWorkspace(): DesignWorkspace {
    try {
        const stored = window.localStorage.getItem(DESIGN_WORKSPACE_STORAGE_KEY);
        if (!stored) return createDesignWorkspace();

        const parsed = JSON.parse(stored) as Partial<DesignWorkspace>;
        const canvases = Array.isArray(parsed.canvases)
            ? parsed.canvases.filter(
                  (canvas): canvas is CanvasDocument =>
                      Boolean(
                          canvas?.id &&
                              canvas.name &&
                              Array.isArray(canvas.elements) &&
                              canvas.backgroundSettings
                      )
              )
            : [];

        if (parsed.schemaVersion !== 1 || !parsed.id || canvases.length === 0) {
            return createDesignWorkspace();
        }

        const activeCanvasId = canvases.some(
            (canvas) => canvas.id === parsed.activeCanvasId
        )
            ? parsed.activeCanvasId!
            : canvases[0].id;

        return {
            schemaVersion: 1,
            id: parsed.id,
            activeCanvasId,
            canvases,
            sharedNavigation: parsed.sharedNavigation ?? null,
        };
    } catch {
        return createDesignWorkspace();
    }
}

export function saveDesignWorkspace(workspace: DesignWorkspace): boolean {
    try {
        window.localStorage.setItem(
            DESIGN_WORKSPACE_STORAGE_KEY,
            JSON.stringify(workspace)
        );
        return true;
    } catch {
        return false;
    }
}