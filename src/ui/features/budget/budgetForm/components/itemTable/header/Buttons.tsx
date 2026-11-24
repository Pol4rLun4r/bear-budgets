// mantine
import { Button, Group, Menu, Tooltip, Modal, Select, Stack, Text, ThemeIcon } from "@mantine/core"
import { useDisclosure } from '@mantine/hooks';
import { useState } from "react";

// redux
import { BudgetFormScope } from "../../../store/@rootReducer";

// components
import ItemFormModal from "@/features/budget/itemForm/@ItemFormModal";
import CurrencyInput from "@/shared/inputs/CurrencyInput";
import SwitchMode from "./SwitchMode";

// icons
import {
    IconChevronDown,
    IconCircleFilled,
    IconPlus,
    IconPercentage,
    IconRotateClockwise,
    IconSettings,
    IconTrash,
    IconTruck,
} from "@tabler/icons-react"
import { useAppDispatch, useAppSelector } from "@/app/reduxHooks";
import {
    dilutePurchaseShipping,
    getItemFreightDistributionBase,
    matchesFreightDistributionTarget,
    replaceItemMarkup,
    resetItemTags,
    resetTable,
    type FreightDistributionTarget,
} from "../../../store/itemTable.slice";
import { applyDefaultItemValues } from "@/features/budget/itemForm/store/itemForm.slice";
import { markupOptions } from "@/utils/markupList";

const isFreightDistributionTarget = (
    value: string | null,
): value is FreightDistributionTarget => (
    value === "all"
    || value === "neutral"
    || value === "green"
    || value === "yellow"
    || value === "red"
);

const freightTargetColors: Record<FreightDistributionTarget, string> = {
    all: "violet",
    neutral: "gray",
    green: "green",
    yellow: "yellow",
    red: "red",
};

const brl = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
});

interface ButtonsProps {
    scope: BudgetFormScope;
    tagEditingEnabled: boolean;
    onTagEditingChange: (enabled: boolean) => void;
}

const Buttons = ({ scope, tagEditingEnabled, onTagEditingChange }: ButtonsProps) => {
    const [itemOpened, { open: itemOpen, close: itemClose }] = useDisclosure(false);
    const [deleteOpened, { open: deleteOpen, close: deleteClose }] = useDisclosure(false);
    const [freightOpened, { open: freightOpen, close: freightClose }] = useDisclosure(false);
    const [markupOpened, { open: markupOpen, close: markupClose }] = useDisclosure(false);
    const [freightAmount, setFreightAmount] = useState<number>();
    const [freightTarget, setFreightTarget] = useState<FreightDistributionTarget>("all");
    const [markupTarget, setMarkupTarget] = useState<FreightDistributionTarget>("all");
    const [newMarkup, setNewMarkup] = useState<string | null>(null);
    const dispatch = useAppDispatch();
    const items = useAppSelector((state) => state.budgetForm.itemTable[scope]);
    const defaultItemValues = useAppSelector(
        (state) => state.settings.value?.interface.itemForm.itemValues,
    );
    const selectedItemCount = items.filter((item) =>
        matchesFreightDistributionTarget(item, freightTarget),
    ).length;
    const selectedFinalTotal = items
        .filter((item) => matchesFreightDistributionTarget(item, freightTarget))
        .reduce((sum, item) => sum + Math.max(0, getItemFreightDistributionBase(item)), 0);
    const selectedMarkupItemCount = items.filter((item) =>
        matchesFreightDistributionTarget(item, markupTarget),
    ).length;

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

    const handleDiluteFreight = () => {
        if (freightAmount === undefined || selectedItemCount === 0) return;

        dispatch(dilutePurchaseShipping({
            scope,
            amount: freightAmount,
            target: freightTarget,
        }));
        setFreightAmount(undefined);
        freightClose();
    };

    const handleReplaceMarkup = () => {
        if (newMarkup === null || selectedMarkupItemCount === 0) return;

        dispatch(replaceItemMarkup({
            scope,
            markup: newMarkup,
            target: markupTarget,
        }));
        setNewMarkup(null);
        markupClose();
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
                        <Menu.Item
                            leftSection={<IconTruck size={16} />}
                            onClick={freightOpen}
                        >
                            Diluir frete nos itens
                        </Menu.Item>
                        <Menu.Item
                            leftSection={<IconPercentage size={16} />}
                            onClick={markupOpen}
                        >
                            Alterar margem em massa
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

            <Modal
                opened={freightOpened}
                onClose={freightClose}
                title="Diluir frete nos itens"
                size="sm"
            >
                <Stack>
                    <Text size="sm" c="dimmed">
                        Informe o valor total do frete. Ele será dividido proporcionalmente ao valor
                        final de cada item, considerando impostos, margem, valores extras e o frete
                        atual. O resultado substituirá o frete de compra dos itens selecionados.
                    </Text>
                    <CurrencyInput
                        value={freightAmount}
                        onValueChange={setFreightAmount}
                        label="Valor total do frete"
                        placeholder="R$ 0,00"
                        withAsterisk
                    />
                    <Select
                        label="Diluir para"
                        value={freightTarget}
                        leftSection={
                            <ThemeIcon
                                size="sm"
                                radius="xl"
                                variant="light"
                                color={freightTargetColors[freightTarget]}
                            >
                                <IconCircleFilled size={8} />
                            </ThemeIcon>
                        }
                        onChange={(value) => {
                            if (isFreightDistributionTarget(value)) setFreightTarget(value);
                        }}
                        data={[
                            { value: "all", label: "Todos os itens" },
                            { value: "neutral", label: "Itens neutros (sem tag)" },
                            { value: "green", label: "Itens marcados em verde" },
                            { value: "yellow", label: "Itens marcados em amarelo" },
                            { value: "red", label: "Itens marcados em vermelho" },
                        ]}
                        renderOption={({ option }) => {
                            const target = isFreightDistributionTarget(option.value)
                                ? option.value
                                : "all";

                            return (
                                <Group gap="xs" wrap="nowrap">
                                    <ThemeIcon
                                        size="sm"
                                        radius="xl"
                                        variant="light"
                                        color={freightTargetColors[target]}
                                    >
                                        <IconCircleFilled size={8} />
                                    </ThemeIcon>
                                    <span>{option.label}</span>
                                </Group>
                            );
                        }}
                        allowDeselect={false}
                    />
                    <Text
                        size="sm"
                        c={selectedItemCount === 0 || selectedFinalTotal <= 0 ? "red" : "dimmed"}
                    >
                        {selectedItemCount === 0
                            ? "Nenhum item corresponde a esta opção."
                            : selectedFinalTotal <= 0
                                ? "Os itens selecionados precisam ter valor final maior que zero."
                                : `${selectedItemCount} ${selectedItemCount === 1 ? "item selecionado" : "itens selecionados"} · valor final considerado: ${brl.format(selectedFinalTotal)}.`}
                    </Text>
                    <Button
                        radius="lg"
                        variant="light"
                        leftSection={<IconTruck size={18} />}
                        disabled={
                            freightAmount === undefined
                            || !Number.isFinite(freightAmount)
                            || freightAmount <= 0
                            || selectedFinalTotal <= 0
                        }
                        onClick={handleDiluteFreight}
                    >
                        Distribuir e substituir fretes
                    </Button>
                </Stack>
            </Modal>

            <Modal
                opened={markupOpened}
                onClose={markupClose}
                title="Alterar margem em massa"
                size="sm"
            >
                <Stack>
                    <Text size="sm" c="dimmed">
                        Escolha uma nova margem para substituir a margem atual dos itens selecionados.
                    </Text>
                    <Select
                        label="Nova margem"
                        placeholder="Selecione a margem"
                        radius="lg"
                        leftSection={<IconPercentage size={18} />}
                        value={newMarkup}
                        onChange={setNewMarkup}
                        data={markupOptions}
                        searchable
                        limit={10}
                        selectFirstOptionOnChange
                        selectFirstOptionOnDropdownOpen
                    />
                    <Select
                        label="Alterar em"
                        radius="lg"
                        value={markupTarget}
                        leftSection={
                            <ThemeIcon
                                size="sm"
                                radius="xl"
                                variant="light"
                                color={freightTargetColors[markupTarget]}
                            >
                                <IconCircleFilled size={8} />
                            </ThemeIcon>
                        }
                        onChange={(value) => {
                            if (isFreightDistributionTarget(value)) setMarkupTarget(value);
                        }}
                        data={[
                            { value: "all", label: "Todos os itens" },
                            { value: "neutral", label: "Itens neutros (sem tag)" },
                            { value: "green", label: "Itens marcados em verde" },
                            { value: "yellow", label: "Itens marcados em amarelo" },
                            { value: "red", label: "Itens marcados em vermelho" },
                        ]}
                        renderOption={({ option }) => {
                            const target = isFreightDistributionTarget(option.value)
                                ? option.value
                                : "all";

                            return (
                                <Group gap="xs" wrap="nowrap">
                                    <ThemeIcon
                                        size="sm"
                                        radius="xl"
                                        variant="light"
                                        color={freightTargetColors[target]}
                                    >
                                        <IconCircleFilled size={8} />
                                    </ThemeIcon>
                                    <span>{option.label}</span>
                                </Group>
                            );
                        }}
                        allowDeselect={false}
                    />
                    <Text size="sm" c={selectedMarkupItemCount === 0 ? "red" : "dimmed"}>
                        {selectedMarkupItemCount === 0
                            ? "Nenhum item corresponde a esta opção."
                            : `${selectedMarkupItemCount} ${selectedMarkupItemCount === 1 ? "item selecionado" : "itens selecionados"}.`}
                    </Text>
                    <Button
                        radius="lg"
                        variant="light"
                        leftSection={<IconPercentage size={18} />}
                        disabled={newMarkup === null || selectedMarkupItemCount === 0}
                        onClick={handleReplaceMarkup}
                    >
                        Aplicar nova margem
                    </Button>
                </Stack>
            </Modal>

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