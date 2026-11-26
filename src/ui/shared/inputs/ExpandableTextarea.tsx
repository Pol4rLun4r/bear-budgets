import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { Box, Textarea, type TextareaProps } from "@mantine/core";
import classes from "./ExpandableTextarea.module.css";

type ExpandableTextareaProps = Omit<TextareaProps, "autosize" | "maxRows"> & {
    compactRows?: number;
    overflowLabel?: string;
};

const ExpandableTextarea = ({
    compactRows = 1,
    overflowLabel,
    minRows = 2,
    readOnly,
    value,
    defaultValue,
    onFocus,
    onBlur,
    onChange,
    className,
    flex,
    ...props
}: ExpandableTextareaProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const [expanded, setExpanded] = useState(false);
    const [compactHeight, setCompactHeight] = useState<number>();
    const [hasOverflow, setHasOverflow] = useState(false);

    const updateOverflow = useCallback(() => {
        const textarea = textareaRef.current;
        if (!textarea || expanded) return;

        setHasOverflow(textarea.scrollHeight > textarea.clientHeight + 1);
    }, [expanded]);

    useLayoutEffect(() => {
        updateOverflow();
    }, [compactRows, defaultValue, expanded, minRows, updateOverflow, value]);

    useEffect(() => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        if (typeof ResizeObserver === "undefined") {
            window.addEventListener("resize", updateOverflow);
            return () => window.removeEventListener("resize", updateOverflow);
        }

        const observer = new ResizeObserver(updateOverflow);
        observer.observe(textarea);
        return () => observer.disconnect();
    }, [updateOverflow]);

    return (
        <Box
            ref={containerRef}
            className={classes.container}
            data-expanded={expanded}
            flex={flex}
            style={{ height: expanded ? compactHeight : undefined }}
        >
            <Textarea
                {...props}
                ref={textareaRef}
                className={[classes.textarea, className].filter(Boolean).join(" ")}
                autosize
                minRows={Math.min(minRows, compactRows)}
                maxRows={expanded ? 10 : compactRows}
                readOnly={Boolean(readOnly) || !expanded}
                value={value}
                defaultValue={defaultValue}
                onFocus={(event) => {
                    setCompactHeight(containerRef.current?.getBoundingClientRect().height);
                    setExpanded(true);
                    onFocus?.(event);
                }}
                onBlur={(event) => {
                    setExpanded(false);
                    setCompactHeight(undefined);
                    onBlur?.(event);
                }}
                onChange={(event) => {
                    onChange?.(event);
                    requestAnimationFrame(updateOverflow);
                }}
            />
            {!expanded && hasOverflow && (overflowLabel ? (
                <button
                    type="button"
                    className={classes.overflowAction}
                    aria-label="Clique para ver a anotação completa"
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => textareaRef.current?.focus()}
                >
                    {overflowLabel}
                </button>
            ) : (
                <span className={classes.overflowIndicator} aria-hidden="true">
                    …
                </span>
            ))}
        </Box>
    );
};

export default ExpandableTextarea;
