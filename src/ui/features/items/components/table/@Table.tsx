// mantine
import { Modal, Paper, Table as MantineTable, VisuallyHidden } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

// components
import Rows from "./Rows";
import ItemForm from "@/features/budget/itemForm/@ItemForm";
import MenuItem from "../menu/@MenuItem";
import ItemReferenceModal from "../menu/modals/ItemReferenceModal";
import AllItemValuesModal from "../menu/modals/allItemValuesModal/@AllItemValuesModal";

// style
import classes from "./Items.module.css"

const Table = ({ items }: { items: ItemReference[] }) => {
    const [itemReferenceOpened, { open: openItemReference, close: closeItemReference }] = useDisclosure(false);
    const [allItemValuesOpened, { open: openAllItemValues, close: closeAllItemValues }] = useDisclosure(false);
    const [itemValuesOpened, { open: openItemValues, close: closeItemValues }] = useDisclosure(false);

    return (
        <>
            <Paper withBorder radius="lg" w={'100%'} h={'100%'} className={classes.items}>
                <MenuItem
                    openAllItemValues={openAllItemValues}
                    openItemReference={openItemReference}
                >
                    {(handlers, seeAllValues) => (
                        <MantineTable.ScrollContainer
                            minWidth={900}
                            w={'100%'}
                            h={'100%'}
                            onContextMenu={handlers.onContextMenu}
                        >
                            <MantineTable layout="fixed" highlightOnHover stickyHeader w={'100%'} h={'100%'}>
                                <MantineTable.Thead>
                                    <MantineTable.Tr>
                                        <MantineTable.Th w={'3%'}><VisuallyHidden /></MantineTable.Th>
                                        <MantineTable.Th w={'30%'}>Descrição</MantineTable.Th>
                                        <MantineTable.Th w={'10%'}>Código interno</MantineTable.Th>
                                        <MantineTable.Th w={'10%'}>Código do fabricante</MantineTable.Th>
                                        <MantineTable.Th w={'8%'}>NCM</MantineTable.Th>
                                        <MantineTable.Th w={'10%'}>Criado em</MantineTable.Th>
                                        <MantineTable.Th w={'10%'}>Atualizado em</MantineTable.Th>
                                    </MantineTable.Tr>
                                </MantineTable.Thead>
                                <MantineTable.Tbody><Rows seeAllValues={seeAllValues} references={items} /></MantineTable.Tbody>
                            </MantineTable>
                        </MantineTable.ScrollContainer>
                    )}
                </MenuItem>
            </Paper>

            {/* modal que da mais informações sobre o item_reference */}
            <Modal
                padding='xl'
                size="lg"
                opened={itemReferenceOpened}
                onClose={closeItemReference}
                title="Mais informações do item"
                centered
                radius='lg'
                overlayProps={{
                    backgroundOpacity: 0.55,
                    blur: 1,
                }}
                transitionProps={{ transition: 'fade', duration: 200 }}
            >
                <ItemReferenceModal />
            </Modal>

            {/* modal que informa todos os item values, daquele item reference */}
            <Modal
                padding='xl'
                size="100%"
                opened={allItemValuesOpened}
                onClose={closeAllItemValues}
                title="Informações sobre os valores do item"
                centered
                radius='lg'
                overlayProps={{
                    backgroundOpacity: 0.55,
                    blur: 1,
                }}
                transitionProps={{ transition: 'fade', duration: 200 }}
            >
                <AllItemValuesModal onOpenValuesModal={openItemValues} />
            </Modal>

            {/* modal que da informações detalhadas sobre os valores de um item */}
            <Modal
                padding='xl'
                size='lg'
                opened={itemValuesOpened}
                onClose={closeItemValues}
                title="Editar item"
                centered
                radius='lg'
                overlayProps={{
                    backgroundOpacity: 0.55,
                    blur: 3,
                }}
            >
                <ItemForm budgetScope={'budget_form_edit'} scope="item_form_edit" closeModal={closeItemValues} />
            </Modal>
        </>
    )
}

export default Table;