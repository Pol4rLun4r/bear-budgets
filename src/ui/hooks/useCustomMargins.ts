import { useEffect, useState } from 'react';
import { notifications } from '@mantine/notifications';

const useCustomMargins = (enabled = true): CustomMargin[] => {
    const [margins, setMargins] = useState<CustomMargin[]>([]);

    useEffect(() => {
        if (!enabled) return;

        let isMounted = true;
        window.api.margins.get().then((savedMargins) => {
            if (isMounted) setMargins(savedMargins);
        }).catch((error: unknown) => {
            if (!isMounted) return;
            notifications.show({
                color: 'red',
                title: 'Erro ao carregar margens personalizadas',
                message: error instanceof Error ? error.message : 'Tente novamente.',
            });
        });

        return () => {
            isMounted = false;
        };
    }, [enabled]);

    return margins;
};

export default useCustomMargins;
