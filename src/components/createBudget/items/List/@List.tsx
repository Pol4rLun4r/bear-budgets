// mantine
import { Table } from "@mantine/core"

// redux
import { useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
import Row from "./Row";

const List = () => {
    const listItems = useSelector((state: RootState) => state.createBudget.listItems);

    return (
        <Table.ScrollContainer minWidth={800} w={'100%'} h={'100%'}>
            <Table layout="fixed" highlightOnHover withColumnBorders stickyHeader>
                <Table.Thead>
                    <Table.Tr>
                        <Table.Th w={'30%'}>Descrição</Table.Th>
                        <Table.Th w={'10%'}>Valor unitário</Table.Th>
                        <Table.Th w={'8%'}>Qtd</Table.Th>
                        <Table.Th w={'12%'}>Total</Table.Th>
                        <Table.Th w={'10%'}>Código interno</Table.Th>
                        <Table.Th w={'10%'}>Markup unitário</Table.Th>
                        <Table.Th w={'10%'}>Markup total</Table.Th>
                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                    {listItems.map((item, index) => (
                        <Row key={index} item={item} />
                    ))}
                </Table.Tbody>
            </Table>
        </Table.ScrollContainer>
    )
}

export default List;