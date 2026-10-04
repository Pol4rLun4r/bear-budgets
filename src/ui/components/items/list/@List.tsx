// mantine
import { Modal, Paper, Table, VisuallyHidden } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

// components
import Rows from "./Rows";
import ItemForm from "../../itemForm/@ItemForm";
import MoreInfoModal from "./menu/modals/MoreInfoModal";
import ValuesInfoModal from "./menu/modals/ValuesModal/ValuesInfoModal";

// style
import classes from "./Items.module.css"

const List = ({ items }: { items: ItemReference[] }) => {
    const [moreInfoOpened, { open: openMoreInfo, close: closeMoreInfo }] = useDisclosure(false);
    const [versionInfoOpened, { open: openVersionInfo, close: closeVersionInfo }] = useDisclosure(false);
    const [viewValuesOpened, { open: openViewValues, close: closeViewValues }] = useDisclosure(false);

    return (
        <>
            <Paper withBorder radius="lg" w={'100%'} h={'100%'} className={classes.items}>
                <Table.ScrollContainer minWidth={900} w={'100%'} h={'100%'}>
                    <Table layout="fixed" highlightOnHover stickyHeader w={'100%'} h={'100%'}>
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Th w={'5%'}><VisuallyHidden /></Table.Th>
                                <Table.Th w={'30%'}>Descrição</Table.Th>
                                <Table.Th w={'10%'}>Código interno</Table.Th>
                                <Table.Th w={'10%'}>Código do fabricante</Table.Th>
                                <Table.Th w={'8%'}>NCM</Table.Th>
                                <Table.Th w={'10%'}>Criado em</Table.Th>
                                <Table.Th w={'10%'}>Atualizado em</Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                            <Rows
                                references={items}
                                openMoreInfo={openMoreInfo}
                                openVersionInfo={openVersionInfo}
                            />
                        </Table.Tbody>
                    </Table>
                </Table.ScrollContainer>
            </Paper>

            {/* modal que da mais informações sobre o item_reference */}
            <Modal
                padding='xl'
                size="lg"
                opened={moreInfoOpened}
                onClose={closeMoreInfo}
                title="Mais informações do item"
                centered
                radius='lg'
                overlayProps={{
                    backgroundOpacity: 0.55,
                    blur: 1,
                }}
                transitionProps={{ transition: 'fade', duration: 200 }}
            >
                <MoreInfoModal />
            </Modal>

            {/* modal que informa os valores do item */}
            <Modal
                padding='xl'
                size="100%"
                opened={versionInfoOpened}
                onClose={closeVersionInfo}
                title="Informações sobre os valores do item"
                centered
                radius='lg'
                overlayProps={{
                    backgroundOpacity: 0.55,
                    blur: 1,
                }}
                transitionProps={{ transition: 'fade', duration: 200 }}
            >
                <ValuesInfoModal onOpenValuesModal={openViewValues}/>
            </Modal>

            {/* modal que da informações detalhadas sobre os valores de um item */}
            <Modal
                padding='xl'
                size='lg'
                opened={viewValuesOpened}
                onClose={closeViewValues}
                title="Editar item"
                centered
                radius='lg'
                overlayProps={{
                    backgroundOpacity: 0.55,
                    blur: 3,
                }}
            >
                <ItemForm budgetScope={'budget_form_edit'} scope="item_form_edit" close={closeViewValues} />
            </Modal>
        </>
    )
}

export default List