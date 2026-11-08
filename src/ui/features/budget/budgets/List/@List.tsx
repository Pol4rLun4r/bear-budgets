import { memo } from "react";

// mantine
import { Paper, Table, VisuallyHidden } from "@mantine/core"
import { Group } from "@mantine/core";
import {
    IconCalendarPlus,
    IconClockEdit,
    IconCurrencyReal,
    IconHash,
    IconListDetails,
    IconNotes,
} from "@tabler/icons-react";

// components
import Rows from "./Rows.tsx";
import MenuBudget from "./MenuBudget.tsx";

// style
import classes from "./Items.module.css"

interface ListType {
    budgets: Quotation[];
    open: () => void;
}

const List = ({ budgets, open }: ListType ) => {

    return (
        <Paper withBorder radius="lg" w={'100%'} h={'100%'} className={classes.items}>
            <MenuBudget open={open}>
                {(handlers, seeBudget) => (
                    <Table.ScrollContainer
                        minWidth={700}
                        w={'100%'}
                        h={'100%'}
                        onContextMenu={handlers.onContextMenu}
                    >
                        <Table layout="fixed" highlightOnHover stickyHeader w={'100%'} h={'100%'}>
                            <Table.Thead>
                                <Table.Tr>
                                    <Table.Th w={'3%'}><VisuallyHidden /></Table.Th>
                                    <Table.Th w={'10%'}><Group gap="xs" wrap="nowrap"><IconHash size={16} />Nº do Orçamento</Group></Table.Th>
                                    <Table.Th w={'20%'}><Group gap="xs" wrap="nowrap"><IconNotes size={16} />Notas</Group></Table.Th>
                                    <Table.Th w={'10%'}><Group gap="xs" wrap="nowrap"><IconCurrencyReal size={16} />Valor Total</Group></Table.Th>
                                    <Table.Th w={'5%'}><Group gap="xs" wrap="nowrap"><IconListDetails size={16} />Itens</Group></Table.Th>
                                    <Table.Th w={'10%'}><Group gap="xs" wrap="nowrap"><IconCalendarPlus size={16} />Data de criação</Group></Table.Th>
                                    <Table.Th w={'10%'}><Group gap="xs" wrap="nowrap"><IconClockEdit size={16} />Última atualização</Group></Table.Th>
                                </Table.Tr>
                            </Table.Thead>
                            <Table.Tbody><Rows seeBudget={seeBudget} budgets={budgets} /></Table.Tbody>
                        </Table>
                    </Table.ScrollContainer>
                )}
            </MenuBudget>
        </Paper >
    )
}

export default memo(List);