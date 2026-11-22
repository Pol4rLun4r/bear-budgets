import { Badge, Group, Paper, Stack, Text, Title } from "@mantine/core";
import { IconNews, IconSparkles } from "@tabler/icons-react";

import { changeLogEntries } from "../changeLog.data";
import { formatChangeLogGroupDate, groupChangeLogEntries } from "../changeLog.utils";
import classes from "../ChangeLog.module.css";
import { ChangeLogEntryCard } from "./ChangeLogEntryCard";

export const ChangeLogModalContent = () => {
    const dateGroups = groupChangeLogEntries(changeLogEntries);
    const latestDate = dateGroups[0]?.date;

    return (
        <Stack className={classes.content} gap="lg">
            <Paper className={classes.intro} withBorder radius="lg" p="lg">
                <Badge
                    className={classes.introBadge}
                    leftSection={<IconSparkles size={15} />}
                    size="md"
                    variant="light"
                    color="violet"
                >
                    DIÁRIO DE ATUALIZAÇÕES
                </Badge>
                <Title order={2} className={classes.introTitle}>
                    Acompanhe as novidades
                </Title>
                <Group className={classes.totalBadge} gap="xs">
                    <IconNews size={16} />
                    <Text size="sm">
                        {changeLogEntries.length} {changeLogEntries.length === 1 ? "novidade" : "novidades"}
                    </Text>
                </Group>
            </Paper>

            <Stack gap="sm">
                <Group justify="space-between" align="baseline">
                    <Title order={4}>Últimas atualizações</Title>
                    <Text className={classes.orderHint} size="sm">Em ordem da mais recente</Text>
                </Group>
                <Stack gap="lg">
                    {dateGroups.map((group) => (
                        <Stack key={formatChangeLogGroupDate(group.date)} gap="sm">
                            <Group className={classes.dateHeading} gap="sm" wrap="nowrap">
                                <Text size="sm" fw={700}>
                                    {formatChangeLogGroupDate(group.date)}
                                </Text>
                                <div className={classes.dateHeadingLine} />
                                <Text className={classes.dateCount} size="sm">
                                    {group.entries.length} {group.entries.length === 1 ? "novidade" : "novidades"}
                                </Text>
                            </Group>
                            <Stack gap="sm">
                                {group.entries.map((entry) => (
                                    <ChangeLogEntryCard
                                        key={`${entry.title}-${entry.date.toISOString()}`}
                                        entry={entry}
                                        isLatest={latestDate?.getTime() === entry.date.getTime()}
                                    />
                                ))}
                            </Stack>
                        </Stack>
                    ))}
                </Stack>
            </Stack>
        </Stack>
    );
};
