import { Accordion, Badge, Group, Paper, Stack, Text, ThemeIcon, Title } from "@mantine/core";
import { IconBug, IconCalendarEvent, IconSparkles, IconTrendingUp } from "@tabler/icons-react";

import type { ChangeLogCategory } from "../changeLog.entries";
import type { ChangeLogEntry } from "../changeLog.data";
import { formatChangeLogDate } from "../changeLog.utils";
import classes from "../ChangeLog.module.css";
import { ChangeLogMarkdown } from "./ChangeLogMarkdown";

const categoryConfig = {
    novelty: { label: "Novidade", color: "violet", icon: IconSparkles },
    improvement: { label: "Melhoria", color: "teal", icon: IconTrendingUp },
    "bug-fix": { label: "Correção", color: "red", icon: IconBug },
} satisfies Record<ChangeLogCategory, { label: string; color: string; icon: typeof IconSparkles }>;

interface ChangeLogEntryCardProps {
    entry: ChangeLogEntry;
    isLatest: boolean;
}

export const ChangeLogEntryCard = ({ entry, isLatest }: ChangeLogEntryCardProps) => {
    const category = entry.category ? categoryConfig[entry.category] : undefined;
    const EntryIcon = category?.icon ?? IconSparkles;

    return (
        <Paper
            className={classes.entry}
            data-featured={isLatest}
            withBorder
            radius="lg"
            p="md"
        >
            <Group align="flex-start" wrap="nowrap" gap="md">
                <ThemeIcon
                    className={classes.entryIcon}
                    variant="light"
                    color={category?.color ?? (isLatest ? "violet" : "gray")}
                    radius="md"
                    size={38}
                >
                    <EntryIcon size={19} />
                </ThemeIcon>
                <Stack className={classes.entryContent} gap={6}>
                    <Group justify="space-between" align="center" gap="xs">
                        <Title order={5}>{entry.title}</Title>
                        <Group gap={6} wrap="wrap" justify="flex-end">
                            {category && (
                                <Badge size="sm" variant="light" color={category.color}>
                                    {category.label}
                                </Badge>
                            )}
                            {isLatest && (
                                <Badge size="sm" variant="light" color="violet">
                                    MAIS RECENTE
                                </Badge>
                            )}
                        </Group>
                    </Group>
                    <Text className={classes.entryDescription} size="md" lh={1.6}>
                        {entry.summary ?? entry.description}
                    </Text>
                    {entry.content && (
                        <Accordion
                            className={classes.detailsAccordion}
                            classNames={{
                                item: classes.detailsItem,
                                control: classes.detailsControl,
                                panel: classes.detailsPanel,
                                content: classes.detailsContent,
                            }}
                            order={6}
                            variant="default"
                        >
                            <Accordion.Item value={entry.title}>
                                <Accordion.Control>Ver detalhes</Accordion.Control>
                                <Accordion.Panel>
                                    <ChangeLogMarkdown content={entry.content} />
                                </Accordion.Panel>
                            </Accordion.Item>
                        </Accordion>
                    )}
                    <Group className={classes.entryDate} gap={7} mt={4}>
                        <IconCalendarEvent size={16} />
                        <Text size="sm">{formatChangeLogDate(entry.date)}</Text>
                    </Group>
                </Stack>
            </Group>
        </Paper>
    );
};
