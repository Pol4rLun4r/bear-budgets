// mantine
import { Group, Paper, Text } from "@mantine/core";
import { IconEye } from "@tabler/icons-react";

const configPaperProps = {
    radius: "lg",
    p: "sm",
    style: {
        borderColor: "light-dark(var(--mantine-color-violet-7), var(--mantine-color-violet-3))",
        borderWidth: 2,
        borderStyle: "solid"
    },
};

const SeeBudget = () => {
    return (
        <Paper
            {...configPaperProps}
            role="button"
            tabIndex={0}
            aria-label="Ver orçamento"
            style={{ ...configPaperProps.style, cursor: "pointer" }}
        >
            <Group gap={5}>
                <IconEye color="light-dark(var(--mantine-color-violet-9), var(--mantine-color-violet-1))" />
                <Text
                    size="0.8rem"
                    c="light-dark(var(--mantine-color-violet-9), var(--mantine-color-violet-1))"
                >
                    Ver orçamento
                </Text>
            </Group>
        </Paper>
    )
}

export default SeeBudget