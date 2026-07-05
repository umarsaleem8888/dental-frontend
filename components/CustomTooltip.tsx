import * as React from "react";
import * as Tooltip from "@radix-ui/react-tooltip";

interface CustomTooltipProps {
    content: React.ReactNode;
    children: React.ReactNode;
    side?: "top" | "right" | "bottom" | "left";
}

export default function CustomTooltip({
    children,
    content,
    side = "top",
}: CustomTooltipProps) {
    return (
        <Tooltip.Provider delayDuration={150}>
            <Tooltip.Root>

                <Tooltip.Trigger asChild>
                    {children}
                </Tooltip.Trigger>

                <Tooltip.Portal>

                    <Tooltip.Content
                        side={side}
                        sideOffset={8}
                        className="
                            z-50
                            rounded-lg
                            bg-slate-900
                            px-3
                            py-2
                            text-sm
                            text-white
                            shadow-xl
                            animate-in
                            fade-in
                        "
                    >
                        {content}

                        <Tooltip.Arrow className="fill-slate-900" />

                    </Tooltip.Content>

                </Tooltip.Portal>

            </Tooltip.Root>
        </Tooltip.Provider>
    );
}