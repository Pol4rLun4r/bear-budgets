import { useEffect, useState } from 'react';
import MantineProvider from '@/app/MantineProvider';
import AutomaticUpdateOverlay from './AutomaticUpdateOverlay';

const stages: AppUpdateStatus[] = [
    'checking',
    'downloading',
    'downloaded',
    'preparing',
    'installing',
    'finalizing',
];

const AutomaticUpdatePreview = () => {
    const requestedStage = new URLSearchParams(window.location.search)
        .get('preview-update') as AppUpdateStatus | null;
    const initialStage = requestedStage && stages.includes(requestedStage)
        ? requestedStage
        : 'downloading';
    const [update, setUpdate] = useState<AppUpdateState>({
        status: initialStage,
        version: '4.16.0',
        percent: initialStage === 'downloading' ? 42 : undefined,
        automatic: true,
    });

    useEffect(() => {
        let stageIndex = stages.indexOf(initialStage);
        let percent = initialStage === 'downloading' ? 42 : 0;
        let timer: number;

        const advance = () => {
            if (stages[stageIndex] === 'downloading' && percent < 100) {
                percent = Math.min(100, percent + 4);
                setUpdate((current) => ({ ...current, percent }));
                timer = window.setTimeout(advance, 350);
                return;
            }

            if (stageIndex >= stages.length - 1) return;

            stageIndex += 1;
            setUpdate((current) => ({
                ...current,
                status: stages[stageIndex],
                percent: stages[stageIndex] === 'downloading' ? percent : undefined,
            }));
            timer = window.setTimeout(advance, 1600);
        };

        timer = window.setTimeout(advance, 1600);
        return () => window.clearTimeout(timer);
    }, [initialStage]);

    return (
        <MantineProvider>
            <AutomaticUpdateOverlay update={update} onContinue={() => undefined} />
        </MantineProvider>
    );
};

export default AutomaticUpdatePreview;
