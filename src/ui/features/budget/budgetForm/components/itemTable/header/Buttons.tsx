// mantine
import { Button, Group, Menu, Tooltip, Modal } from "@mantine/core"
import { useDisclosure } from '@mantine/hooks';

// redux
import { BudgetFormScope } from "../../../store/@rootReducer";

// components
import ItemFormModal from "@/features/budget/itemForm/@ItemFormModal";
import SwitchMode from "./SwitchMode";

// icons
import { IconChevronDown, IconPlus, IconRotateClockwise, IconSettings, IconTrash } from "@tabler/icons-react"
import { useAppDispatch, useAppSelector } from "@/app/reduxHooks";
import { resetItemTags, resetTable } from "../../../store/itemTable.slice";
import { applyDefaultItemValues } from "@/features/budget/itemForm/store/itemForm.slice";

interface ButtonsProps {
    scope: BudgetFormScope;
    tagEditingEnabled: boolean;
    onTagEditingChange: (enabled: boolean) => void;
}

const Buttons = ({ scope, tagEditingEnabled, onTagEditingChange }: ButtonsProps) => {
    const [itemOpened, { open: itemOpen, close: itemClose }] = useDisclosure(false);
    const [deleteOpened, { open: deleteOpen, close: deleteClose }] = useDisclosure(false);
    const dispatch = useAppDispatch();
    const defaultItemValues = useAppSelector(
        (state) => state.settings.value?.interface.itemForm.itemValues,
    );

    const handleDelete = () => {
        dispatch(resetTable(scope))
        deleteClose()
    }

    const handleAddItemScope = () => {
        if (scope === 'budget_form_create') return 'item_form_add';
        return 'item_form_add_budget_edit';
    } 

    const handleOpenItem = () => {
        if (defaultItemValues) {
            dispatch(applyDefaultItemValues({
                scope: handleAddItemScope(),
                markup: defaultItemValues.defaultMarkup,
                boarding: defaultItemValues.defaultBoarding,
                delivery: defaultItemValues.defaultDelivery,
            }));
        }
        itemOpen();
    };

    return (
        <>
            <Group>
                <Menu position="bottom-end" shadow="md" withinPortal>
                    <Menu.Target>
                        <Button
                            variant="light"
                            color="violet"
                            radius="lg"
                            leftSection={<IconSettings size={18} />}
                            rightSection={<IconChevronDown size={16} />}
                        >
                            Ajustes do orçamento
                        </Button>
                    </Menu.Target>
                    <Menu.Dropdown>
                        <Menu.Label>Caixas de seleção</Menu.Label>
                        <Menu.CheckboxItem
                            checked={tagEditingEnabled}
                            color={tagEditingEnabled ? "teal" : undefined}
                            onChange={onTagEditingChange}
                        >
                            {tagEditingEnabled
                                ? "Desativar caixas de seleção"
                                : "Ativar caixas de seleção"}
                        </Menu.CheckboxItem>
                        <Menu.Item
                            leftSection={<IconRotateClockwise size={16} />}
                            onClick={() => dispatch(resetItemTags(scope))}
                        >
                            Limpar caixas de seleção
                        </Menu.Item>
                        <Menu.Divider />
                        <Menu.Label>Modo de visualização</Menu.Label>
                        <SwitchMode />
                        <Menu.Divider />
                        <Menu.Label>Itens do orçamento</Menu.Label>
                        <Menu.Item
                            color="red"
                            leftSection={<IconTrash size={16} />}
                            onClick={deleteOpen}
                        >
                            Excluir todos os itens
                        </Menu.Item>
                    </Menu.Dropdown>
                </Menu>
                <Tooltip label='Adicionar Item'>
                    <Button
                        leftSection={<IconPlus size={20} />}
                        radius="lg"
                        variant="light"
                        onClick={handleOpenItem}
                    >
                        Item
                    </Button>
                </Tooltip>
            </Group >
            {/* modal do botão para deletar lista */}
            < Modal
                opened={deleteOpened}
                onClose={deleteClose}
                title="Deseja realmente excluir todos os itens do orçamento?"
            >
                <Button
                    radius="lg"
                    variant="light"
                    color="red"
                    fullWidth
                    onClick={() => handleDelete()}
                >
                    Excluir todos os itens
                </Button>
            </ Modal>

            {/* modal do botão para adicionar um item */}
            <ItemFormModal
                opened={itemOpened}
                onClose={itemClose}
                title="Adicionar item"
                scope={handleAddItemScope()}
                budgetScope={scope}
            />
        </>
    )
}

export default Buttons