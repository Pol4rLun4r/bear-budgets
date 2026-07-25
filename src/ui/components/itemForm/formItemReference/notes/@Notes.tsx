// mantine
import { Button, Modal, Textarea, Tooltip } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

// redux
import { ItemFormScope, setReferenceField } from "../../../../redux/itemForm/itemFormSlice.ts";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../../redux/store.ts";

const Notes = ({ scope }: { scope: ItemFormScope }) => {
    const [opened, { open, close }] = useDisclosure(false);

    const itemData = useSelector((state: RootState) => state.itemForm.form[scope].item_reference);
    const dispatch = useDispatch<AppDispatch>();

    const hasNotes = itemData.notes === null ? false : itemData.notes === undefined ? false : itemData.notes?.length <= 0 ? false : true;

    return (
        <>
            <Tooltip
                disabled={hasNotes ? false : true}
                label={itemData.notes as string || ''}
                multiline
                w={250}
            >
                <Button
                    variant={hasNotes ? "outline" : "default"}
                    radius="lg"
                    onClick={open}
                    style={{
                        borderTopLeftRadius: 0,
                        borderBottomLeftRadius: 0,
                    }}
                >
                    {hasNotes ? `Notas` : 'Adicionar notas'}
                </Button>
            </Tooltip>
            <Modal
                opened={opened}
                onClose={close}
                centered
                title="Notas/Anotações"
                radius='lg'
                size="lg"
                overlayProps={{
                    backgroundOpacity: 0.55,
                    blur: 3,
                }}
                transitionProps={{ transition: 'fade', duration: 200 }}
            >
                <Textarea
                    // design
                    label="Notas sobre o item"
                    radius="lg"
                    placeholder="(opcional) sem anotações no momento"
                    autosize
                    minRows={10}
                    maxRows={20}

                    // valores
                    readOnly={!!itemData.id} // desabilita se já tiver um item selecionado
                    value={itemData.notes as string || ''}
                    onChange={(e) => dispatch(setReferenceField({ scope, key: 'notes', value: e.currentTarget.value }))}
                />
            </Modal>
        </>
    )
}

export default Notes;