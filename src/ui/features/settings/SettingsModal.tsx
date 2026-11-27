import { useState } from 'react';
import { Button, Group, Modal } from '@mantine/core';
import { useAppSelector } from '@/app/reduxHooks';
import SettingsTabs from './components/SettingsTabs';

interface SettingsModalProps {
    opened: boolean;
    onClose: () => void;
}

const SettingsModal = ({ opened, onClose }: SettingsModalProps) => {
    const [hasChanges, setHasChanges] = useState(false);
    const [discardConfirmationOpened, setDiscardConfirmationOpened] = useState(false);
    const saving = useAppSelector((state) => state.settings.pendingWrites > 0);

    const requestClose = () => {
        if (saving) return;
        if (hasChanges) {
            setDiscardConfirmationOpened(true);
            return;
        }
        onClose();
    };

    const discardChangesAndClose = () => {
        setDiscardConfirmationOpened(false);
        setHasChanges(false);
        onClose();
    };

    return (
        <>
            <Modal
                opened={opened}
                onClose={requestClose}
                closeOnEscape={!saving}
                closeOnClickOutside={!saving}
                withCloseButton={false}
                size="90vw"
                styles={{
                    content: {
                        height: '90vh',
                        maxHeight: '90vh',
                        display: 'flex',
                        flexDirection: 'column',
                    },
                    body: {
                        flex: '1 1 auto',
                        minHeight: 0,
                        overflow: 'hidden',
                    },
                }}
            >
                {opened && (
                    <SettingsTabs
                        onDirtyChange={setHasChanges}
                        onRequestClose={requestClose}
                    />
                )}
            </Modal>
            <Modal
                opened={discardConfirmationOpened}
                onClose={() => setDiscardConfirmationOpened(false)}
                title="Descartar alterações?"
                centered
                size="md"
            >
                <Group justify="center" wrap="nowrap">
                    <Button
                        variant="default"
                        onClick={() => setDiscardConfirmationOpened(false)}
                    >
                        Não, continuar editando
                    </Button>
                    <Button color="red" onClick={discardChangesAndClose}>
                        Sim, sair sem salvar
                    </Button>
                </Group>
            </Modal>
        </>
    );
};

export default SettingsModal;
