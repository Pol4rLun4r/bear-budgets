// mantine
import { Badge, Group, Paper, Stack, Text, ThemeIcon, Title } from "@mantine/core";

// style
import classes from "./ChangeLog.module.css";

// icons
import { IconCalendarEvent, IconNews, IconSparkles } from "@tabler/icons-react";

// utils
import { changeLogEntries } from "./changeLog.data";
import { formatChangeLogDate } from "./changeLog.utils";

// hook
import useCustomModal from "@/hooks/useCustomModal";

// components
import { SidebarPage } from "@/app/layout/sideBar/components/SidebarPage";

export const ChangeLog = () => {
    const { modal, handlers } = useCustomModal({
        title: (
            <Group gap="xs">
                <IconNews />
                <Title order={3}>Novidades</Title>
            </Group>
        ),
        size: "xl",
        children: (
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
                        Cada detalhe, melhor pensado.
                    </Title>
                    <Text className={classes.introDescription} size="md">
                        Acompanhe o que há de novo e descubra como o app ficou ainda melhor para você.
                    </Text>
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
                            <Paper
                                key={`${entry.title}-${entry.date.toISOString()}`}
                                className={classes.entry}
                                data-featured={index === 0}
                                withBorder
                                radius="lg"
                                p="md"
                            >
                                <Group align="flex-start" wrap="nowrap" gap="md">
                                    <ThemeIcon
                                        className={classes.entryIcon}
                                        variant="light"
                                        color={index === 0 ? "violet" : "gray"}
                                        radius="md"
                                        size={38}
                                    >
                                        <IconSparkles size={19} />
                                    </ThemeIcon>
                                    <Stack className={classes.entryContent} gap={6}>
                                        <Group justify="space-between" align="center" gap="xs">
                                            <Title order={5}>{entry.title}</Title>
                                            {index === 0 && (
                                                <Badge size="sm" variant="light" color="violet">
                                                    MAIS RECENTE
                                                </Badge>
                                            )}
                                        </Group>
                                        <Text className={classes.entryDescription} size="md" lh={1.6}>
                                            {entry.description}
                                        </Text>
                                        <Group className={classes.entryDate} gap={7} mt={4}>
                                            <IconCalendarEvent size={16} />
                                            <Text size="sm">{formatChangeLogDate(entry.date)}</Text>
                                        </Group>
                                    </Stack>
                                </Group>
                            </Paper>
                        ))}
                    </Stack>
                </Stack>
            </Stack>
        ),
    });

    return (
        <>
            <SidebarPage
                icon={IconNews}
                label="Novidades"
                onClick={handlers.open}
            />
            {modal}
        </>
    );
};
