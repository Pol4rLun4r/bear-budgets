// redux
import { useSelector } from 'react-redux';
import { RootState } from "../../../../../../redux/store.ts";

// mantine
import { Table, VisuallyHidden } from '@mantine/core';

// components
import Row from './Row.tsx';

const ValuesInfoModal = ({ onOpenValuesModal }: { onOpenValuesModal: () => void }) => {
    const menu = useSelector((state: RootState) => state.items.menu);
    const values = menu.item_values;

    const rows = [...values]
        .sort((a, b) => (b.updated_at ?? '').localeCompare(a.updated_at ?? ''))
        .map((value) => (
            <Row key={value.id} item_values={value} onOpenValuesModal={onOpenValuesModal} />
        ));

    return (
        <Table.ScrollContainer minWidth={800} w={'100%'} h={'100%'}>
            <Table layout="fixed" highlightOnHover stickyHeader>
                <Table.Thead>
                    <Table.Tr>
                        <Table.Th w={'3%'}><VisuallyHidden /></Table.Th>
                        <Table.Th w={'10%'}>Valor unitário</Table.Th>
                        <Table.Th w={'10%'}>Qtd</Table.Th>
                        <Table.Th w={'10%'}>Total c/ somas</Table.Th>
                        <Table.Th w={'10%'}>Embarque</Table.Th>
                        <Table.Th w={'10%'}>Markup (%)</Table.Th>
                        <Table.Th w={'10%'}>Criado</Table.Th>
                        <Table.Th w={'10%'}>Atualizado</Table.Th>
                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody>{rows}</Table.Tbody>
            </Table>
        </Table.ScrollContainer>
    )
};

export default ValuesInfoModal;