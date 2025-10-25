import * as React from "react";
import { cn } from "../libs/utils";

export function Badge({ className, variant = "default", ...props }) {
    const variants = {
        default: "bg-primary text-primary-foreground",
        secondary: "bg-accent text-accent-foreground",
        outline: "border border-input text-foreground",
    };

    return (
        <div
            className={cn(
                "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors",
                variants[variant],
                className
            )}
            {...props}
        />
    );
}
