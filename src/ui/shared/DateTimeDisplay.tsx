import { Stack, Text } from "@mantine/core";
import { formatSqliteDateTime } from "@/utils/formatSqliteDateTime";

interface DateTimeDisplayProps {
    value?: string;
}

const DateTimeDisplay = ({ value }: DateTimeDisplayProps) => {
    if (!value) return "—";

    const { date, time, relative } = formatSqliteDateTime(value);

    return (
        <Stack gap={0}>
            <Text>{date}</Text>
            <Text size="xs" c="dimmed" style={{ whiteSpace: "nowrap" }}>
                {time} · {relative}
            </Text>
        </Stack>
    );
};

export default DateTimeDisplay;
