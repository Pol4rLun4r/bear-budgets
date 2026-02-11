// mantine
import { Table } from '@mantine/core';

// types
import type { ClientType } from './SearchClient'

const Rows = ({ clients }: { clients: ClientType[] }) => {
    const rows = clients.map((client) => (
        <Table.Tr key={client.id}>
            <Table.Td width={'50%'}>{client.name}</Table.Td>
            <Table.Td>{client.document}</Table.Td>
        </Table.Tr>
    ))

    return (
        <Table highlightOnHover>
            <Table.Thead>
                <Table.Tr>
                    <Table.Th>Name</Table.Th>
                    <Table.Th>Document</Table.Th>
                </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
                {rows}
            </Table.Tbody>
        </Table>
    )
}

export default Rows