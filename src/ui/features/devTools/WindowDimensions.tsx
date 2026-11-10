import { useState } from "react";
import { ActionIcon, Group, Paper, Stack, Text, Tooltip } from "@mantine/core";
import { useFloatingWindow, useViewportSize } from "@mantine/hooks";
import { IconDimensions } from "@tabler/icons-react";

const WindowDimensions = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { width, height } = useViewportSize();
    const floatingWindow = useFloatingWindow<HTMLDivElement>({
        enabled: isOpen,
        constrainToViewport: true,
        initialPosition: { top: 56, right: 16 },
    });

    return (
        <>
            <Tooltip label="Dimensões da janela" withinPortal>
                <ActionIcon
                    size="lg"
                    radius="lg"
                    variant="transparent"
                    aria-label={isOpen ? "Ocultar dimensões da janela" : "Mostrar dimensões da janela"}
                    aria-expanded={isOpen}
                    onClick={() => setIsOpen((open) => !open)}
                    style={{ WebkitAppRegion: "no-drag" }}
                >
                    <IconDimensions size="1.2rem" />
                </ActionIcon>
            </Tooltip>

            {isOpen && (
                <Paper
                    ref={(element) => floatingWindow.ref(element)}
                    withBorder
                    shadow="md"
                    p="sm"
                    role="dialog"
                    aria-label="Dimensões da janela"
                    style={{
                        position: "fixed",
                        zIndex: 10000,
                        width: 210,
                        top: 56,
                        right: 16,
                        cursor: "grab",
                        userSelect: "none",
                    }}
                >
                    <Stack gap="xs">
                        <Text size="sm" fw={600}>Dimensões da janela</Text>
                        <Group justify="space-between">
                            <Text size="sm">Largura</Text>
                            <Text size="sm" fw={600} style={{ fontVariantNumeric: "tabular-nums" }}>
                                {width} px
                            </Text>
                        </Group>
                        <Group justify="space-between">
                            <Text size="sm">Altura</Text>
                            <Text size="sm" fw={600} style={{ fontVariantNumeric: "tabular-nums" }}>
                                {height} px
                            </Text>
                        </Group>
                    </Stack>
                </Paper>
            )}
        </>
    );
};

export default WindowDimensions;
