import { useState } from "react";

// mantine
import { Menu } from "@mantine/core";

// components
// import SeeItemReference from "./SeeItemReference.tsx";
import SeeAllItemValues from "./SeeAllItemValues.tsx";

// icons
import { IconCopyPlus, IconPencilMinus, IconTrash } from "@tabler/icons-react";

// obsoleto?
export interface MenuProps {
    itemReferenceId: ItemReference['id'];
    open: () => void
}

// types para o menu de contexto
interface ContextMenuTargetHandlers {
    onContextMenu: React.MouseEventHandler<HTMLElement>; // função para lidar com o evento de clique com o botão direito do mouse
}

type seeAllValuesType = (itemReferenceId: ItemReference['id']) => React.ReactElement;

interface MenuItemProps {
    openItemReference: () => void;
    openAllItemValues: () => void;
    children: (handlers: ContextMenuTargetHandlers, seeAllValues: seeAllValuesType) => React.ReactElement // função que recebe os handlers retorna um elemento React
}

const MenuItem = ({ openAllItemValues, children }: MenuItemProps) => {
    // estado para armazenar o id do item reference ativo (selecionado) ao menu de contexto
    const [itemReferenceId, setItemReferenceId] = useState<ItemReference['id'] | null>(null);

    // função para obter o id do orçamento a partir do alvo do evento (target)
    const getItemReferenceIdFromTarget = (target: EventTarget | null) => {
        const row = target instanceof Element ? target.closest<HTMLElement>("[data-item-reference-id]") : null; // procura o elemento mais próximo com o atributo data-budget-id
        const id = row?.dataset.itemReferenceId; // obtém o valor do atributo data-item-reference-id
        return id === undefined ? undefined : Number(id); // retorna o id do item reference
    }

    // função para lidar com o evento de clique com o botão direito do mouse
    const handleContextMenu: React.MouseEventHandler<HTMLElement> = (event) => {
        const id = getItemReferenceIdFromTarget(event.target)
        if (id === undefined) event.preventDefault();
        setItemReferenceId(id);

        
        console.log(itemReferenceId); // temporário
    }

    // função para renderizar o botão de ver orçamento
    const seeAllValues: seeAllValuesType = (id) => (
        <SeeAllItemValues open={openAllItemValues} itemReferenceId={id ? id : 0} />
    );

    // itens do menu de contexto
    const menuItems = (
        <>
            {/* <SeeItemReference open={openItemReference} itemReferenceId={itemReferenceId} notes={notes} /> */}
            
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
                c="red"
                leftSection={<IconTrash size={14} />}
                disabled
            >
                Deletar referencia
            </Menu.Item>
        </>
    )

    return (
        <Menu shadow="md" withArrow offset={-1}>
            <Menu.ContextMenu>
                {/* passa os handlers para os filhos */}
                {children({ onContextMenu: handleContextMenu }, seeAllValues)}
            </Menu.ContextMenu>

            <Menu.Dropdown>{menuItems}</Menu.Dropdown>
        </Menu>
    )
}

export default MenuItem;