// mantine
import { Table, Skeleton, SkeletonProps, Button } from '@mantine/core';

// component
import StartBudgetButton from './startBudgetButton';

// style
import classes from '../SearchClient.module.css';

// types
import type { ClientType } from '../SearchClient';

const dataSkeleton = [
    { nameWidth: '50%', descriptionWidth: '50%' },
    { nameWidth: '50%', descriptionWidth: '55%' },
    { nameWidth: '55%', descriptionWidth: '58%' },
    { nameWidth: '50%', descriptionWidth: '50%' },
    { nameWidth: '55%', descriptionWidth: '59%' },
];

const loadingProps: SkeletonProps = { height: 8 }

const rowSkeleton = dataSkeleton.map((row, index) => (
    <Table.Tr key={index}>
        <Table.Td width={'50%'}><Skeleton {...loadingProps} width={row.nameWidth} /></Table.Td>
        <Table.Td width={'40%'}><Skeleton {...loadingProps} width={row.descriptionWidth} /></Table.Td>
        <Table.Td width={'10%'}><Button variant="light" size="compact-xs" opacity={0.1}>Inciar cotação</Button></Table.Td>
    </Table.Tr>
))

const Rows = ({ clients }: { clients: ClientType[] }) => {
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
                {clients.length > 0
                    ? clients.map((client) => (
                        <Table.Tr key={client.id} className={classes.table}>
                            <Table.Td width={'50%'}>{client.name}</Table.Td>
                            <Table.Td width={'40%'}>{client.document}</Table.Td>
                            <Table.Td width={'10%'}><StartBudgetButton /></Table.Td>
                        </Table.Tr>
                    ))
                    : rowSkeleton
                }
            </Table.Tbody>
        </Table>
    )
}

export default Rows