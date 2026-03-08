// mantine
import { ScrollArea, Table, Anchor, UnstyledButton, Tooltip } from "@mantine/core";

// type
import { ItemReferenceNoteType } from "../../../../../redux/createBudget/items/addItemSlice";

// icon
import { IconTrash } from "@tabler/icons-react";

// redux
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../../../redux/store";
import { removeNote } from "../../../../../redux/createBudget/items/addItemSlice";

const List = ({ notes }: { notes: ItemReferenceNoteType[] }) => {
    const dispatch = useDispatch<AppDispatch>()

    const handleRemove = (index: number) => {
        dispatch(removeNote(index));
    }

    const rows = notes.map((note: ItemReferenceNoteType, index) => (
        <Table.Tr key={note.id ? note.id : index}>
            <Table.Td width={'95%'}>
                {note.type === 'link' ?
                    (<Anchor target="_blank" href={note.content} size="sm">{note.content}</Anchor>) :
                    note.content
                }
            </Table.Td>
            <Table.Td>
                <Tooltip label='Deletar nota' position="right">
                    <UnstyledButton onClick={() => handleRemove(index)}>
                        <IconTrash size={15} color="var(--mantine-color-dimmed)" />
                    </UnstyledButton>
                </Tooltip>
            </Table.Td>
        </Table.Tr >
    ))
    return (
        <ScrollArea h={notes.length >= 3 ? 100 : undefined } type="auto" scrollbarSize={8} offsetScrollbars>
            <Table>
                <Table.Tbody>{rows}</Table.Tbody>
            </Table>
        </ScrollArea>
    )
}

export default List