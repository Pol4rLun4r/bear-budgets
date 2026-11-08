import { memo } from "react";

// mantine
import { Paper, Table, VisuallyHidden } from "@mantine/core"
import { Group } from "@mantine/core";
import {
    IconCalendarPlus,
    IconClockEdit,
    IconCurrencyReal,
    IconBox,
    IconNotes,
    IconTag,
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

const iconSize = 20

const List = ({ budgets, open }: ListType ) => {

    return (
        <Paper withBorder radius="lg" w={'100%'} h={'100%'} className={classes.items}>
            <MenuBudget open={open}>
                {(handlers, seeBudget) => (
                    <Table.ScrollContainer
                        minWidth={1100}
                        w={'100%'}
                        h={'100%'}
                        onContextMenu={handlers.onContextMenu}
                    >
                        <Table layout="fixed" highlightOnHover stickyHeader w={'100%'} h={'100%'}>
                            <Table.Thead h={"3.5rem"}>
                                <Table.Tr>
                                    <Table.Th w={48}><VisuallyHidden /></Table.Th>
                                    <Table.Th w={160}><Group gap="xs" wrap="nowrap"><IconTag size={iconSize} />Nº do Orçamento</Group></Table.Th>
                                    <Table.Th w={220}><Group gap="xs" wrap="nowrap"><IconNotes size={iconSize} />Notas</Group></Table.Th>
                                    <Table.Th w={150}><Group gap="xs" wrap="nowrap"><IconCurrencyReal size={iconSize} />Valor Total</Group></Table.Th>
                                    <Table.Th w={80}><Group gap="xs" wrap="nowrap"><IconBox size={iconSize} />Itens</Group></Table.Th>
                                    <Table.Th w={200}><Group gap="xs" wrap="nowrap"><IconCalendarPlus size={iconSize} />Data de criação</Group></Table.Th>
                                    <Table.Th w={200}><Group gap="xs" wrap="nowrap"><IconClockEdit size={iconSize} />Última atualização</Group></Table.Th>
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