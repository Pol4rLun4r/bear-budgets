import { Badge, Group, Paper, Stack, Text, Title } from "@mantine/core";
import { IconNews, IconSparkles } from "@tabler/icons-react";

import { changeLogEntries } from "../changeLog.data";
import classes from "../ChangeLog.module.css";
import { ChangeLogEntryCard } from "./ChangeLogEntryCard";

export const ChangeLogModalContent = () => (
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
            <Stack gap="sm">
                {changeLogEntries.map((entry, index) => (
                    <ChangeLogEntryCard
                        key={`${entry.title}-${entry.date.toISOString()}`}
                        entry={entry}
                        isLatest={index === 0}
                    />
                ))}
            </Stack>
        </Stack>
    </Stack>
);
