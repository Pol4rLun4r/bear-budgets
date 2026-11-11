import { notifications } from "@mantine/notifications";
import { IconSparkles } from "@tabler/icons-react";
import { createElement, useCallback, useEffect, useRef, useState } from "react";

export const useChangeLogState = () => {
    const [isUnread, setIsUnread] = useState<boolean>();
    const [version, setVersion] = useState<string>();
    const hasMarkedRead = useRef(false);

    useEffect(() => {
        let isActive = true;

        void window.api.news.getState()
            .then((state) => {
                if (!isActive || hasMarkedRead.current) return;

                setIsUnread(state.unread);
                setVersion(state.version);
            })
            .catch((error: unknown) => {
                console.error("Failed to load application news state:", error);
                notifications.show({
                    title: "Não foi possível carregar as novidades",
                    message: "O estado das novidades não pôde ser verificado.",
                    color: "red",
                    position: "bottom-left",
                });
            });

        return () => {
            isActive = false;
        };
    }, []);

    useEffect(() => {
        if (!isUnread) return;

        const versionLabel = version ? `A versão ${version}` : "A nova versão";
        notifications.show({
            id: "app-news-available",
            title: "Novidades para conferir",
            message: `${versionLabel} já está instalada. Clique em “Novidades” na barra lateral para conferir o que mudou.`,
            icon: createElement(IconSparkles, { size: 18 }),
            color: "violet",
            position: "bottom-left",
            autoClose: false,
        });
    }, [isUnread, version]);

    const markAsRead = useCallback(async () => {
        if (isUnread === false) return;

        try {
            await window.api.news.markRead();
            hasMarkedRead.current = true;
            setIsUnread(false);
            notifications.hide("app-news-available");
        } catch (error) {
            console.error("Failed to mark application news as read:", error);
            notifications.show({
                title: "Não foi possível salvar a leitura",
                message: "As novidades continuarão destacadas até que essa informação seja salva.",
                color: "red",
                position: "bottom-left",
            });
        }
    }, [isUnread]);

    return { isUnread, markAsRead };
};
