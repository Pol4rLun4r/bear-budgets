// mantine
import { ActionIcon, Group, Loader, Table as MantineTable, Stack, Text, Title, Tooltip } from "@mantine/core";
import { UseDisclosureHandlers } from "@mantine/hooks";
import { IconCalendarPlus, IconCurrencyReal, IconPercentage } from "@tabler/icons-react";

// components
import Rows from "./Rows";

// icons
import { IconExclamationCircle, IconHistory } from "@tabler/icons-react";

// redux
import type { ItemFormScope } from "../../../../store/itemForm.slice";

interface TableProps {
    scope: ItemFormScope;
    itemValues: ItemValues[];
    isFetching: boolean;
    errorMessage?: string;

    handlers: UseDisclosureHandlers
}

const Table = ({ scope, itemValues, isFetching, errorMessage, handlers }: TableProps) => {
    return (
        <Stack>
            <Group justify="space-between" align="center">
                <Group gap="xs" align="center">
                    <IconHistory size={20} />
                    <Title order={4}>Histórico de preços</Title>
                </Group>
                <Tooltip
                    label="Os valores exibidos são unitários."
                    position="top"
                    withArrow
                    withinPortal
                    zIndex={500}
                >
                    <ActionIcon
                        variant="subtle"
                        color="gray"
                        size="sm"
                        aria-label="Informações sobre os valores exibidos"
                    >
                        <IconExclamationCircle size={18} />
                    </ActionIcon>
                </Tooltip>
            </Group>
            <MantineTable layout="fixed" highlightOnHover stickyHeader w={'100%'} h={'100%'}>
                <MantineTable.Thead>
                    <MantineTable.Tr>
                        <MantineTable.Th w={'25%'}><Group gap="xs" wrap="nowrap"><IconCurrencyReal size={16} />Preço custo</Group></MantineTable.Th>
                        <MantineTable.Th w={'25%'}><Group gap="xs" wrap="nowrap"><IconCurrencyReal size={16} />Preço final</Group></MantineTable.Th>
                        <MantineTable.Th w={'18%'}><Group gap="xs" wrap="nowrap"><IconPercentage size={16} />Margem</Group></MantineTable.Th>
                        <MantineTable.Th w={'25%'}><Group gap="xs" wrap="nowrap"><IconCalendarPlus size={16} />Criado em</Group></MantineTable.Th>
                    </MantineTable.Tr>
                </MantineTable.Thead>
                <MantineTable.Tbody>
                    {itemValues.length > 0 ? (
                            <Rows scope={scope} items={itemValues} handlers={handlers} />
                    ) : (
                        <MantineTable.Tr>
                            <MantineTable.Td colSpan={4} align="center">
                                {isFetching ? (
                                    <Loader size="sm" />
                                ) : (
                                    <Text c="dimmed">
                                        {errorMessage ?? "Nenhum registro de valores encontrado."}
                                    </Text>
                                )}
                            </MantineTable.Td>
                        </MantineTable.Tr>
                    )}
                </MantineTable.Tbody>
            </MantineTable>
        </Stack>
    )
}

export default Table;