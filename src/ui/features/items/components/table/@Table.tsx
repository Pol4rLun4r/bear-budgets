import { useState } from "react";

// mantine
import { Button, Center, Group, Modal, Paper, Stack, Table as MantineTable, Text, VisuallyHidden } from "@mantine/core";
import {
    IconBarcode,
    IconCalendarPlus,
    IconClockEdit,
    IconFileText,
    IconHash,
    IconSearch,
} from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";

// components
import Rows from "./Rows";
import MenuItem from "../Menu/@MenuItem";

// style
import classes from "./Items.module.css"
import ItemDetails from "../itemDetails/@ItemDetails";

// redux
import { useAppDispatch, useAppSelector } from "@/app/reduxHooks";
import { selectBudgetEditHasChanges } from "@/features/budget/budgetForm/store/budgetForm.selectors";
import { setOriginalBudget } from "@/features/budget/budgetForm/store/originalBudgetSlice";

// styles
import budgetFormClasses from "@/features/budget/budgetForm/budgetForm.module.css";

const Table = ({ items, searchQuery }: { items: ItemReference[]; searchQuery: string }) => {
    const iconSize = 20;
    const [itemDetailsOpened, { open: openItemDetails, close: closeItemDetails }] = useDisclosure(false);
    const [confirmOpened, { open: openConfirm, close: closeConfirm }] = useDisclosure(false);
    const [viewingBudget, setViewingBudget] = useState(false);
    const [pendingExit, setPendingExit] = useState<"details" | "budget" | null>(null);
    const dispatch = useAppDispatch();
    const hasBudgetChanges = useAppSelector(selectBudgetEditHasChanges);

    const handleOpenItemDetails = () => {
        setViewingBudget(false);
        dispatch(setOriginalBudget(null));
        openItemDetails();
    };

    const closeDetails = () => {
        closeConfirm();
        setPendingExit(null);
        setViewingBudget(false);
        dispatch(setOriginalBudget(null));
        closeItemDetails();
    };

    const closeBudgetAfterSave = () => {
        closeDetails();
    };

    const requestCloseDetails = () => {
        if (viewingBudget && hasBudgetChanges) {
            setPendingExit("details");
            openConfirm();
            return;
        }

        closeDetails();
    };

    const requestBackToDetails = () => {
        if (hasBudgetChanges) {
            setPendingExit("budget");
            openConfirm();
            return;
        }

        setViewingBudget(false);
        dispatch(setOriginalBudget(null));
    };

    const continueEditing = () => {
        closeConfirm();
        setPendingExit(null);
    };

    const discardBudgetChanges = () => {
        closeConfirm();
        if (pendingExit === "details") {
            closeDetails();
            return;
        }

        if (pendingExit === "budget") {
            setViewingBudget(false);
            dispatch(setOriginalBudget(null));
        }
        setPendingExit(null);
    };

    return (
        <>
            <Paper withBorder radius="lg" w={'100%'} h={'100%'} className={classes.items}>
                <MenuItem>
                    {(handlers) => (
                        <MantineTable.ScrollContainer
                            minWidth={1100}
                            w={'100%'}
                            h={'100%'}
                            onContextMenu={handlers.onContextMenu}
                        >
                            <MantineTable layout="fixed" highlightOnHover stickyHeader w={'100%'} h={'100%'}>
                                <MantineTable.Thead h="3.5rem">
                                    <MantineTable.Tr>
                                        <MantineTable.Th w={48}><VisuallyHidden /></MantineTable.Th>
                                        <MantineTable.Th w={300}><Group gap="xs" wrap="nowrap"><IconFileText size={iconSize} />Descrição</Group></MantineTable.Th>
                                        <MantineTable.Th w={150}><Group gap="xs" wrap="nowrap"><IconBarcode size={iconSize} />Código interno</Group></MantineTable.Th>
                                        <MantineTable.Th w={200}><Group gap="xs" wrap="nowrap"><IconHash size={iconSize} />Código do fabricante</Group></MantineTable.Th>
                                        <MantineTable.Th w={200}><Group gap="xs" wrap="nowrap"><IconCalendarPlus size={iconSize} />Criado em</Group></MantineTable.Th>
                                        <MantineTable.Th w={200}><Group gap="xs" wrap="nowrap"><IconClockEdit size={iconSize} />Atualizado em</Group></MantineTable.Th>
                                    </MantineTable.Tr>
                                </MantineTable.Thead>
                                <MantineTable.Tbody>
                                    {items.length > 0 ? (
                                        <Rows references={items} openItemDetails={handleOpenItemDetails} />
                                    ) : (
                                        <MantineTable.Tr>
                                            <MantineTable.Td colSpan={6}>
                                                <Center py="xl">
                                                    <Stack align="center" gap="xs">
                                                        <IconSearch
                                                            size={40}
                                                            stroke={1.5}
                                                            color="var(--mantine-color-dimmed)"
                                                        />
                                                        <Text c="dimmed" ta="center">
                                                            {searchQuery
                                                                ? `Nenhum item encontrado para “${searchQuery}”.`
                                                                : "Nenhum item cadastrado ainda."}
                                                        </Text>
                                                    </Stack>
                                                </Center>
                                            </MantineTable.Td>
                                        </MantineTable.Tr>
                                    )}
                                </MantineTable.Tbody>
                            </MantineTable>
                        </MantineTable.ScrollContainer>
                    )}
                </MenuItem>
            </Paper>

            {/* modal que da informações detalhadas sobre o item*/}
            <Modal
                size='100%'
                opened={itemDetailsOpened}
                onClose={requestCloseDetails}
                // title="Detalhes do item"
                withCloseButton={false}
                classNames={viewingBudget
                    ? {
                        content: budgetFormClasses.modalContent,
                        body: budgetFormClasses.modalBody,
                    }
                    : undefined}
            >
                <>
                    <Modal
                        withCloseButton={false}
                        opened={confirmOpened}
                        onClose={continueEditing}
                        title={pendingExit === "budget"
                            ? "Deseja sair da edição sem salvar?"
                            : "Deseja fechar o orçamento sem salvar?"}
                    >
                        <Group>
                            <Button color="teal" onClick={continueEditing}>
                                Não, continuar editando
                            </Button>
                            <Button color="red" onClick={discardBudgetChanges}>
                                Sim, sair sem salvar
                            </Button>
                        </Group>
                    </Modal>
                    <ItemDetails
                        viewingBudget={viewingBudget}
                        onViewBudget={() => setViewingBudget(true)}
                        onRequestBack={requestBackToDetails}
                        closeBudget={closeBudgetAfterSave}
                    />
                </>
            </Modal>
        </>
    )
}

export default Table;