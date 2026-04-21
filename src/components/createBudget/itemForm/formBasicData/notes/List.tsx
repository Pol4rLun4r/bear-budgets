// mantine
import { ScrollArea, Table, Anchor, UnstyledButton, Tooltip } from "@mantine/core";

// type
import { ItemFormScope, ItemNoteType } from "../../../../../redux/createBudget/items/itemFormSlice";

// icon
import { IconTrash } from "@tabler/icons-react";

// redux
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../../../redux/store";
import { removeNote } from "../../../../../redux/createBudget/items/itemFormSlice";

const List = ({ notes, scope }: { notes: ItemNoteType[]; scope: ItemFormScope }) => {
    const dispatch = useDispatch<AppDispatch>();
    const hasId = useSelector((state: RootState) => state.createBudget.itemForm[scope].item_basic_data.id);

    const handleRemove = (index: number) => {
        dispatch(removeNote({ scope, index }));
    };

    const rows = notes.map((note: ItemNoteType, index) => (
        <Table.Tr key={note.id ? note.id : index}>
            <Table.Td width={'90%'} style={{userSelect: 'text'}} >
                {note.type === 'link' ?
                    (<Anchor target="_blank" href={note.content} size="sm" lineClamp={1} w={"100%"} style={{ wordBreak: 'break-all' }} >{note.content}</Anchor>) :
                    note.content
                }
            </Table.Td>
            <Table.Td>
                {hasId === null ? (
                    <Tooltip label='Deletar nota' position="right">
                        <UnstyledButton onClick={() => handleRemove(index)}>
                            <IconTrash size={15} color="var(--mantine-color-dimmed)" />
                        </UnstyledButton>
                    </Tooltip>
                ) :
                    null
                }
            </Table.Td>
        </Table.Tr >
    ))
    return (
        <ScrollArea h={notes.length >= 3 ? 200 : undefined} type="auto" scrollbarSize={8} offsetScrollbars style={{ overflowX: 'hidden' }}>
            <Table>
                <Table.Tbody>{rows}</Table.Tbody>
            </Table>
        </ScrollArea>
    )
}

export default List