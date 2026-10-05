import { MoreVertical } from "lucide-react";
import type { Dispatch, SetStateAction } from "react";

type ElementsMenuProps = {
    isMenuOpen: boolean;
    setIsMenuOpen: Dispatch<SetStateAction<boolean>>;
    setIsElementsMinimised: Dispatch<SetStateAction<boolean>>;
    setIsElementsFloating: Dispatch<SetStateAction<boolean>>;
    isElementsFloating: boolean;
};

export default function ElementsMenu({
    isMenuOpen,
    setIsMenuOpen,
    setIsElementsMinimised,
    setIsElementsFloating,
    isElementsFloating,
}: ElementsMenuProps) {
    return (
        <>
            <button
                type="button"
                onClick={() => setIsMenuOpen((prev) => !prev)}
                className="absolute right-0 flex h-8 w-8 items-center justify-center rounded-md text-gray-400 transition hover:bg-gray-800 hover:text-white"
            >
                <MoreVertical size={18} />
            </button>

            {isMenuOpen && (
                <div className="absolute right-0 top-10 z-50 w-32 rounded-lg border border-gray-700 bg-gray-900 p-1 shadow-lg">
                    <button
                        type="button"
                        onClick={() => {
                            setIsElementsMinimised(true);
                            setIsMenuOpen(false);
                        }}
                        className="w-full rounded-md px-3 py-2 text-left text-sm text-gray-300 transition hover:bg-gray-800 hover:text-white"
                    >
                        Minimise
                    </button>

                    <button
                        type="button"
                        onClick={() => {
                            setIsElementsFloating((prev) => !prev);
                            setIsMenuOpen(false);
                        }}
                        className="w-full rounded-md px-3 py-2 text-left text-sm text-gray-300 transition hover:bg-gray-800 hover:text-white"
                    >
                        {isElementsFloating ? "Dock" : "Float"}
                    </button>
                </div>
            )}
        </>
    );
}