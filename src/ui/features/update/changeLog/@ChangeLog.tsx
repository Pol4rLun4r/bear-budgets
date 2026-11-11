import { Group, Title } from "@mantine/core";
import { IconNews } from "@tabler/icons-react";

import useCustomModal from "@/hooks/useCustomModal";
import { SidebarPage } from "@/app/layout/sideBar/components/SidebarPage";
import { ChangeLogModalContent } from "./components/ChangeLogModalContent";
import { useChangeLogState } from "./useChangeLogState";

export const ChangeLog = () => {
    const { isUnread, markAsRead } = useChangeLogState();

    const { modal, handlers } = useCustomModal({
        title: (
            <Group gap="xs">
                <IconNews />
                <Title order={3}>Novidades</Title>
            </Group>
        ),
        size: "xl",
        children: <ChangeLogModalContent />,
    });

    const handleOpen = () => {
        handlers.open();
        void markAsRead();
    };

    return (
        <>
            <SidebarPage
                icon={IconNews}
                label="Novidades"
                tooltip={isUnread ? "Há novidades desta atualização para conferir." : undefined}
                highlighted={isUnread ?? false}
                onClick={handleOpen}
            />
            {modal}
        </>
    );
};
