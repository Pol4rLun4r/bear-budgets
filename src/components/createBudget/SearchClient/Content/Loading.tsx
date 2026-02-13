// mantine
import { Button, Skeleton, SkeletonProps, Table } from "@mantine/core";

// style
import classes from '../SearchClient.module.css'

const Loading = () => {
    

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