// mantine
import { Modal, Paper, Table as MantineTable, VisuallyHidden } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

// components
import Rows from "./Rows";
import MenuItem from "../MenuItem";

// style
import classes from "./Items.module.css"
import ItemDetails from "../itemDetails/@ItemDetails";

const Table = ({ items }: { items: ItemReference[] }) => {
    const [itemDetailsOpened, { open: openItemDetails, close: closeItemDetails }] = useDisclosure(false);

    return (
        <>
            <Paper withBorder radius="lg" w={'100%'} h={'100%'} className={classes.items}>
                <MenuItem>
                    {(handlers) => (
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
                                <MantineTable.Tbody>
                                    <Rows references={items} openItemDetails={openItemDetails} />
                                </MantineTable.Tbody>
                            </MantineTable>
                        </MantineTable.ScrollContainer>
                    )}
                </MenuItem>
            </Paper>

            {/* modal que da informações detalhadas sobre o item*/}
            <Modal
                padding='xl'
                size='100%'
                opened={itemDetailsOpened}
                onClose={closeItemDetails}
                title="Detalhes do item"
                centered
                radius='lg'
                overlayProps={{
                    backgroundOpacity: 0.55,
                    blur: 3,
                }}
            >
                <ItemDetails />
            </Modal>
        </>
    )
}

export default Table;