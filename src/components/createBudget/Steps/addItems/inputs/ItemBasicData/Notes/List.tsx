// mantine
import { ScrollArea, Table, Anchor } from "@mantine/core";

// type
import { ItemReferenceNoteType } from "../../../../../../../redux/createBudget/items/addItemSlice";

// react
import { useState } from "react";

const List = ({ notes }: { notes: ItemReferenceNoteType[] }) => {
    const [scrolled, setScrolled] = useState(false);

    const rows = notes.map((note: ItemReferenceNoteType) => (
        <Table.Tr key={note.id}>
            <Table.Td>
                {note.type === 'link' ?
                    (<Anchor target="_blank" href={note.content} size="sm">{note.content}</Anchor>) :
                    note.content 
                }
            </Table.Td>
        </Table.Tr >
    ))

    return (
        <ScrollArea mah={100} onScrollPositionChange={({ y }) => setScrolled(y !== 0)}>
            <Table>
                <Table.Tbody>{rows}</Table.Tbody>
            </Table>
        </ScrollArea>
    )
}

export default List