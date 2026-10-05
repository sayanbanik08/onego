import DemoDashboardHeader from "./DemoDashboardHeader";

export default function DesignCanvas() {
    return (
        <section className="min-h-0 flex-1 overflow-y-auto">

            {/* White Portfolio Canvas */}
            <div
                className="min-h-[1200px] w-full bg-white"
                style={{
                    backgroundImage: "radial-gradient(#b8b8b8 1px, transparent 1px)",
                    backgroundSize: "20px 20px",
                }}
            >

                {/* Demo Fixed Dashboard Header */}
                <DemoDashboardHeader />

                {/* EDITABLE DESIGN AREA */}
                <div className="min-h-[1120px]">
                    {/* User's custom design will be built here */}
                </div>

            </div>

        </section>
    );
}