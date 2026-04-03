// mantine
import { Table, VisuallyHidden } from "@mantine/core"

// redux
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../../redux/store";
import { reorderItems } from "../../../../redux/createBudget/items/listItemsSlice";

// components
import SortableRow from "./SortableRow";

// dnd-kit
import { DragDropProvider } from "@dnd-kit/react";

const List = () => {
    const dispatch = useDispatch<AppDispatch>();
    const listItems = useSelector((state: RootState) => state.createBudget.listItems);

    const handleDragEnd: React.ComponentProps<typeof DragDropProvider>["onDragEnd"] = (event) => {
        if (event.canceled) return console.log('canceled'); // cancela a operação se cancelado

        const { source } = event.operation;

        if (!source) return console.log('no source'); // cancela a operação se não houver source (item que está sendo arrastado)

        // ------------- corrigir erro de typagem --------------- //

        const oldIndex = source.initialIndex; // index do item que está sendo arrastado 
        const newIndex = source.index; // index para onde o item está sendo arrastado

        if (oldIndex === newIndex) return; // cancela a operação se o item está sendo arrastado para a mesma posição

        dispatch(reorderItems({ oldIndex, newIndex }));
    };

    return (
        <DragDropProvider onDragEnd={handleDragEnd}>
            <Table.ScrollContainer minWidth={800} w={'100%'} h={'100%'}>
                <Table layout="fixed" highlightOnHover stickyHeader>
                    <Table.Thead>
                        <Table.Tr>
                            <Table.Th w={'5%'}><VisuallyHidden /></Table.Th>
                            <Table.Th w={'7%'}>Item</Table.Th>
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
                            <SortableRow key={item.tempId} item={item} index={index} />
                        ))}
                    </Table.Tbody>
                </Table>
            </Table.ScrollContainer>
        </DragDropProvider>
    )
}

export default List;