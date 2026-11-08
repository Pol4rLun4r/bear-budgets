import { Badge, Group, Stack, Text } from "@mantine/core";
import { IconCalendarEvent, IconClock } from "@tabler/icons-react";
import { formatSqliteDateTime } from "@/utils/formatSqliteDateTime";

interface DateTimeDisplayProps {
    value?: string;
}

const DateTimeDisplay = ({ value }: DateTimeDisplayProps) => {
    if (!value) return "—";

    const { date, time, relative } = formatSqliteDateTime(value);
    const isToday = relative === "Hoje";
    const iconColor = "light-dark(var(--mantine-color-violet-5), var(--mantine-color-violet-2))";
    const formattedRelative =
        relative.charAt(0).toLocaleUpperCase("pt-BR") + relative.slice(1).toLocaleLowerCase("pt-BR");

    return (
        <Stack gap={"0.2rem"}>
            <Group gap={"xs"} wrap="nowrap">
                <IconCalendarEvent size={16} color={iconColor} />
                <Text size="sm" fw={500}>{date}</Text>
            </Group>
            <Group gap="xs" wrap="nowrap">
                <Group gap={"xs"} wrap="nowrap">
                    <IconClock
                        size={14}
                        color={iconColor}
                    />
                    <Text
                        size="sm"
                        fw={500}
                        style={{
                            whiteSpace: "nowrap",
                            color: "var(--mantine-color-text)",
                            opacity: 0.75,
                        }}
                    >
                        {time}
                    </Text>
                </Group>
                <Badge
                    size="xs"
                    variant={isToday ? "light" : "default"}
                    color={isToday ? "violet" : undefined}
                    style={{ flexShrink: 0, textTransform: "none" }}
                >
                    {formattedRelative}
                </Badge>
            </Group>
        </Stack>
    );
};

export default DateTimeDisplay;
