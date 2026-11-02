// mantine
import { Group, Paper, Text, Timeline, Title } from "@mantine/core";

// style
import classes from "./ChangeLog.module.css";

// icons
import { IconClockEdit, IconHistoryToggle, IconNews } from "@tabler/icons-react";
import { changeLogEntries } from "./changeLog.data";
import { formatChangeLogDate } from "./changeLog.utils";

interface ChangeLogProps {
    isCollapsed: boolean;
}

export const ChangeLog = ({ isCollapsed }: ChangeLogProps) => {
    return (
        <Paper radius={"lg"} withBorder p={"md"} className={classes.changeLog} data-collapsed={isCollapsed}>
            <Group>
                <IconNews/>
                <Title order={3}>
                    Novidades
                </Title>
            </Group>
            <Text size="xs" c="dimmed" mt={4} mb="md">
                Acompanhe aqui as novidades do App!
            </Text>

            <div className={classes.content}>
                <Timeline
                    active={Math.min(Math.max(changeLogEntries.length - 1, 0), 1)}
                    bulletSize={24}
                    lineWidth={2}
                >
                    {changeLogEntries.map((entry, index) => {
                        const Icon = index === 0
                            ? IconNews
                            : index === 1
                                ? IconClockEdit
                                : IconHistoryToggle;
                        const isImportant = index < 2;

                        return (
                            <Timeline.Item
                                key={`${entry.title}-${entry.date.toISOString()}`}
                                bullet={<Icon size={15} />}
                                title={entry.title}
                                color={isImportant ? "violet" : "gray"}
                                lineVariant={isImportant ? "solid" : "dashed"}
                            >
                                <Text c="dimmed" size="sm">{entry.description}</Text>
                                <Text size="xs" mt={4}>
                                    {formatChangeLogDate(entry.date)}
                                </Text>
                            </Timeline.Item>
                        );
                    })}
                </Timeline>
            </div>
        </Paper>
    );
};
