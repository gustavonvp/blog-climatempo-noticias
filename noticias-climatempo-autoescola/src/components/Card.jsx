import * as React from "react";
import { cn } from "../libs/utils";

export function Card({ className, children, ...props }) {
    return (
        <div
            className={cn("rounded-xl border bg-white text-foreground shadow-sm", className)}
            {...props}
        >
            {children}
        </div>
    );
}

export function CardHeader({ className, children, ...props }) {
    return (
        <div className={cn("p-4 border-b", className)} {...props}>
            {children}
        </div>
    );
}

export function CardTitle({ className, children, ...props }) {
    return (
        <div className={cn("leading-none font-semibold", className)} {...props}>
            {children}
        </div>
    );
}

export function CardContent({ className, children, ...props }) {
    return (
        <div className={cn("p-4", className)} {...props}>
            {children}
        </div>
    );
}

export function CardFooter({ className, children, ...props }) {
    return (
        <div className={cn("p-4 border-t", className)} {...props}>
            {children}
        </div>
    );
}
