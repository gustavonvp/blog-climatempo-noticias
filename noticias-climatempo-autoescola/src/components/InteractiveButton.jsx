import React from "react";
import { ArrowRight } from "lucide-react";
import clsx from "clsx";

export function InteractiveButton({
    label,
    href,
    onClick,
    disabled = false,
    icon,
}) {
    const baseStyles =
        "group inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all duration-300 select-none";
    const activeStyles =
        "bg-blue-600 text-white hover:bg-blue-700 hover:scale-105 focus:ring-4 focus:ring-blue-300 cursor-[url('/magico.png'),pointer]";
    const disabledStyles =
        "bg-gray-300 text-gray-500 cursor-not-allowed opacity-70";

    const classes = clsx(
        baseStyles,
        disabled ? disabledStyles : activeStyles,
        "px-5 py-2"
    );

    const iconElement =
        !disabled &&
        (icon || (
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
        ));

    if (href) {
        return (
            <a
                href={href}
                className={classes}
                onClick={(e) => disabled && e.preventDefault()}
                aria-disabled={disabled}
            >
                <span>{label}</span>
                {iconElement}
            </a>
        );
    }

    return (
        <button
            type="button"
            className={classes}
            onClick={onClick}
            disabled={disabled}
        >
            <span>{label}</span>
            {iconElement}
        </button>
    );
}
