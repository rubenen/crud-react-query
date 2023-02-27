import React from "react";

export const Button = React.forwardRef<
    HTMLButtonElement,
    React.ComponentPropsWithoutRef<"button">
>((props, ref) => {
    const { children, ...rest } = props;
    const className = `bg-neutral-900 hover:bg-neutral-800 active:bg-neutral-700 text-white px-4 py-2 h-9 flex items-center focus-visible:ring focus:outline-none ${props.className}`;

    return (
        <button ref={ref} {...rest} className={className}>
            {children}
        </button>
    );
});
