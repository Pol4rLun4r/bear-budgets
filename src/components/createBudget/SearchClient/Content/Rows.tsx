// mantine
import { Table } from '@mantine/core';

// component
import StartBudgetButton from './startBudgetButton';

// style
import classes from '../SearchClient.module.css';

// types
import type { ClientType } from '../SearchClient';

const Rows = ({ clients }: { clients: ClientType[] }) => {
    const rows = clients.map((client) => (
        <Table.Tr key={client.id} className={classes.table}>
            <Table.Td width={'50%'}>{client.name}</Table.Td>
            <Table.Td width={'40%'}>{client.document}</Table.Td>
            <Table.Td width={'10%'}><StartBudgetButton/></Table.Td>
        </Table.Tr>
    ))

    return (
        <Table highlightOnHover>
            <Table.Thead>
                <Table.Tr>
                    <Table.Th>Name</Table.Th>
                    <Table.Th>Document</Table.Th>
                    <Table.Th> </Table.Th>
                </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
                {rows}
            </Table.Tbody>
        </Table>
    )
}

export default Rows