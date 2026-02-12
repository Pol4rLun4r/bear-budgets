// mantine
import { Button, Skeleton, SkeletonProps, Table } from "@mantine/core";

// style
import classes from '../SearchClient.module.css'

const Loading = () => {
    const loadingProps: SkeletonProps = { height: 8 }

    const data = [
    {nameWidth: '50%',  descriptionWidth: '50%'},
    {nameWidth: '50%',  descriptionWidth: '55%'},
    {nameWidth: '55%',  descriptionWidth: '58%'},
    {nameWidth: '50%',  descriptionWidth: '50%'},
    {nameWidth: '55%',  descriptionWidth: '59%'},
    // {nameWidth: '50%',  descriptionWidth: '70%'},
    // {nameWidth: '88%',  descriptionWidth: '92%'},
    // {nameWidth: '92%',  descriptionWidth: '84%'},
    // {nameWidth: '75%',  descriptionWidth: '95%'},
    // {nameWidth: '82%',  descriptionWidth: '81%'},
];

    const rows = data.map((row, index) => (
        <Table.Tr key={index}>
            <Table.Td width={'50%'}><Skeleton {...loadingProps} width={row.nameWidth} /></Table.Td>
            <Table.Td width={'40%'}><Skeleton {...loadingProps} width={row.descriptionWidth} /></Table.Td>
            <Table.Td width={'10%'}><Button variant="light" size="compact-xs" opacity={0.1}>Inciar cotação</Button></Table.Td>
        </Table.Tr>
    ))

    return (
        <Table highlightOnHover className={classes.loading}>
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

export default Loading