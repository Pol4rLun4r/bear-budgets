import { memo, useState } from "react";

// mantine
import { Box, Center, Paper, Select, Stack, Table, Text, VisuallyHidden } from "@mantine/core"
import { Group } from "@mantine/core";
import {
    IconCalendarPlus,
    IconClockEdit,
    IconCurrencyReal,
    IconBox,
    IconNotes,
    IconFilter,
    IconSearch,
    IconTag,
} from "@tabler/icons-react";

// components
import Rows from "./Rows.tsx";
import MenuBudget from "./MenuBudget.tsx";
import { quotationStatusOptions } from "../../quotationStatus";

// style
import classes from "./Items.module.css"

interface ListType {
    budgets: Quotation[];
    open: () => void;
    searchQuery: string;
}

const iconSize = 20
const statusOptions = Object.values(quotationStatusOptions);

const List = ({ budgets, open, searchQuery }: ListType ) => {
    const [statusFilter, setStatusFilter] = useState<string | null>(null);
    const filteredBudgets = statusFilter === null
        ? budgets
        : budgets.filter((budget) => String(budget.status ?? 0) === statusFilter);
    const selectedStatus = statusFilter === null
        ? undefined
        : statusOptions.find((status) => String(status.value) === statusFilter);
    const statusFilterOptions = statusOptions.map(({ value, label }) => ({
        value: String(value),
        label: String(value) === statusFilter && label.length > 6
            ? `${label.slice(0, 5)}…`
            : label,
    }));

    return (
        <Paper withBorder radius="lg" w={'100%'} h={'100%'} miw={0} className={classes.items}>
            <MenuBudget open={open}>
                {(handlers, seeBudget) => (
                    <Table.ScrollContainer
                        minWidth={1180}
                        w={'100%'}
                        h={'100%'}
                        onContextMenu={handlers.onContextMenu}
                    >
                        <Table layout="fixed" highlightOnHover stickyHeader w={'100%'} h={'100%'}>
                            <Table.Thead h={"3.5rem"}>
                                <Table.Tr>
                                    <Table.Th w={48}><VisuallyHidden /></Table.Th>
                                    <Table.Th w={96}><Group gap="xs" wrap="nowrap"><IconTag size={iconSize} />ID</Group></Table.Th>
                                    <Table.Th w={190}>
                                        <Select
                                            aria-label="Filtrar orçamentos por status"
                                            placeholder="Status"
                                            data={statusFilterOptions}
                                            value={statusFilter}
                                            onChange={setStatusFilter}
                                            clearable
                                            allowDeselect={false}
                                            size="md"
                                            w={170}
                                            title={selectedStatus?.label ?? "Filtrar por status"}
                                            leftSection={selectedStatus ? (
                                                <Box
                                                    w={10}
                                                    h={10}
                                                    style={{
                                                        borderRadius: "50%",
                                                        backgroundColor: `var(--mantine-color-${selectedStatus.color}-4)`,
                                                    }}
                                                />
                                            ) : <IconFilter size={16} />}
                                            renderOption={({ option }) => {
                                                const status = statusOptions.find(
                                                    (item) => String(item.value) === option.value,
                                                );

                                                if (!status) return option.label;

                                                return (
                                                    <Group gap="xs" wrap="nowrap">
                                                        <Box
                                                            w={10}
                                                            h={10}
                                                            style={{
                                                                flexShrink: 0,
                                                                borderRadius: "50%",
                                                                backgroundColor: `var(--mantine-color-${status.color}-4)`,
                                                            }}
                                                        />
                                                        {status.label}
                                                    </Group>
                                                );
                                            }}
                                        />
                                    </Table.Th>
                                    <Table.Th w={220}><Group gap="xs" wrap="nowrap"><IconNotes size={iconSize} />Anotações</Group></Table.Th>
                                    <Table.Th w={150}><Group gap="xs" wrap="nowrap"><IconCurrencyReal size={iconSize} />Valor Total</Group></Table.Th>
                                    <Table.Th w={80}><Group gap="xs" wrap="nowrap"><IconBox size={iconSize} />Itens</Group></Table.Th>
                                    <Table.Th w={200}><Group gap="xs" wrap="nowrap"><IconCalendarPlus size={iconSize} />Data de criação</Group></Table.Th>
                                    <Table.Th w={200}><Group gap="xs" wrap="nowrap"><IconClockEdit size={iconSize} />Última atualização</Group></Table.Th>
                                </Table.Tr>
                            </Table.Thead>
                            <Table.Tbody>
                                {filteredBudgets.length > 0 ? (
                                    <Rows seeBudget={seeBudget} budgets={filteredBudgets} />
                                ) : (
                                    <Table.Tr>
                                        <Table.Td colSpan={8}>
                                            <Center py="xl">
                                                <Stack align="center" gap="xs">
                                                    <IconSearch
                                                        size={40}
                                                        stroke={1.5}
                                                        color="var(--mantine-color-dimmed)"
                                                    />
                                                    <Text c="dimmed" ta="center">
                                                        {selectedStatus
                                                            ? `Nenhum orçamento com status “${selectedStatus.label}”.`
                                                            : searchQuery
                                                                ? `Nenhum orçamento encontrado para “${searchQuery}”.`
                                                                : "Nenhum orçamento cadastrado ainda."}
                                                    </Text>
                                                </Stack>
                                            </Center>
                                        </Table.Td>
                                    </Table.Tr>
                                )}
                            </Table.Tbody>
                        </Table>
                    </Table.ScrollContainer>
                )}
            </MenuBudget>
        </Paper >
    )
}

export default memo(List);