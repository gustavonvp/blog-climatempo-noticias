import * as React from "react";
import { cn } from "@/lib/utils";

export function Button({ className, variant, size, ...props }) {
    const base = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none disabled:opacity-50 disabled:pointer-events-none";

    const variants = {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        ghost: "hover:bg-accent hover:text-accent-foreground",
    };

    const sizes = {
        default: "h-10 px-4 py-2",
        sm: "h-9 px-3",
        lg: "h-11 px-8",
    };

    return (
        <button
            className={cn(base, variants[variant || "default"], sizes[size || "default"], className)}
            {...props}
        />
    );
}
