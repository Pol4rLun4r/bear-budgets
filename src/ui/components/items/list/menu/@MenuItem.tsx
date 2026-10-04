// mantine
import { ActionIcon, Menu } from "@mantine/core";

// components
import MoreInfo from "./MoreInfo.tsx";
import VersionInfo from "./VersionInfo";

// icons
import { IconCopyPlus, IconMenu3, IconPencilMinus, IconTrash } from "@tabler/icons-react";

export interface MenuProps {
    itemReferenceId: ItemReference['id'];
    open: () => void
}

const MenuItem = ({
    itemReferenceId,
    notes,
    openMoreInfo,
    openVersionInfo,
}: {
    itemReferenceId: ItemReference['id'];
    notes: ItemReference['notes'];
    openMoreInfo: () => void;
    openVersionInfo: () => void;
}) => {
    return (
        <Menu shadow="md" withArrow offset={-1}>
            <Menu.Target>
                <ActionIcon variant="transparent">
                    <IconMenu3 />
                </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown>
                <MoreInfo open={openMoreInfo} itemReferenceId={itemReferenceId} notes={notes} />
                <VersionInfo open={openVersionInfo} itemReferenceId={itemReferenceId} />
                <Menu.Item
                    leftSection={<IconPencilMinus size={14} />}
                    disabled
                >
                    Editar referencia do item
                </Menu.Item>
                <Menu.Item
                    leftSection={<IconCopyPlus size={14} />}
                    disabled
                >
                    Duplicar referencia
                </Menu.Item>
                <Menu.Item
                    color="red"
                    leftSection={<IconTrash size={14} />}
                    disabled
                >
                    Deletar referencia
                </Menu.Item>
            </Menu.Dropdown>
        </Menu>
    )
}

export default MenuItem;