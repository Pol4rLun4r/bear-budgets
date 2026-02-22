// mantine
import { Table, Skeleton, SkeletonProps, Button, VisuallyHidden } from '@mantine/core';

// component
import StartBudgetButton from './StartBudgetButton';

// style
import classes from '../SearchClient.module.css';

// types
import type { ClientType } from '../../../../../types/client';

// utils
import { formatDocument } from '../../../../utils/formatDocument';

const dataSkeleton = [
    { nameWidth: '50%', descriptionWidth: '50%' },
    { nameWidth: '50%', descriptionWidth: '55%' },
    { nameWidth: '55%', descriptionWidth: '58%' },
    { nameWidth: '50%', descriptionWidth: '50%' },
    { nameWidth: '55%', descriptionWidth: '59%' },
];

const loadingProps: SkeletonProps = { height: 8 };

const rowSkeleton = dataSkeleton.map((row, index) => (
    <Table.Tr key={index}>
        <Table.Td><Skeleton {...loadingProps} width={row.nameWidth} /></Table.Td>
        <Table.Td><Skeleton {...loadingProps} width={row.descriptionWidth} /></Table.Td>
        <Table.Td><Button variant="light" size="compact-xs" opacity={0.1}>Inciar cotação</Button></Table.Td>
    </Table.Tr>
));

const Rows = ({ clients }: { clients: ClientType[] }) => {
    return (
        <Table>
            <Table.Thead>
                <Table.Tr>
                    <Table.Th className={classes.tableHeaderName}>Name</Table.Th>
                    <Table.Th className={classes.tableHeaderDocument}>Document</Table.Th>
                    <Table.Th className={classes.tableHeaderAction}><VisuallyHidden>Action</VisuallyHidden></Table.Th>
                </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
                {clients.length > 0
                    ? clients.map((client) => (
                        <Table.Tr key={client.id} className={classes.tableTr}>
                            <Table.Td>{client.name}</Table.Td>
                            <Table.Td>{formatDocument(client.document!)}</Table.Td>
                            <Table.Td><StartBudgetButton clientId={client.id}/></Table.Td>
                        </Table.Tr>
                    ))
                    : rowSkeleton
                }
            </Table.Tbody>
        </Table>
    )
};

export default Rows;