// mantine
import { Button, NativeSelect, Textarea } from "@mantine/core"

// redux
import { useSelector, useDispatch } from "react-redux"
import { AppDispatch, RootState } from "../../../../../redux/store"
import { setNoteType, setNoteContent, resetNote } from "../../../../../redux/createBudget/newItemNoteSlice"
import { addNote, ItemReferenceNoteType } from "../../../../../redux/createBudget/items/addItemSlice"

//react
import { useState, useRef } from "react"

const Form = () => {
    const dispatch = useDispatch<AppDispatch>()
    const note = useSelector((state: RootState) => state.createBudget.newItemNote);


    const [isError, setIsError] = useState(false);
    const cleanTimeout = useRef<any>(null);

    const handleAddNote = () => {
        const data: ItemReferenceNoteType = {
            content: note.content,
            type: note.type
        };

        if (cleanTimeout.current) {
            clearTimeout(cleanTimeout.current);
        };

        if (note.content.trim().length <= 0) {
            cleanTimeout.current = setTimeout(() => {
                setIsError(false);
            }, 2000);

            return setIsError(true);
        };

        setIsError(false);

        dispatch(addNote(data));
        dispatch(resetNote())
    }

    return (
        <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: isError ? 'flex-start' : 'center' }}>
            <Textarea
                style={{ width: '65%' }}
                maxRows={note.type === 'link' ? 1 : 3}
                autosize
                radius='lg'
                placeholder="(opcional)"
                rightSectionWidth={70}
                value={note.content}
                onChange={(e) => dispatch(setNoteContent({ content: e.currentTarget.value, type: note.type } as any))}
                error={isError ? 'Defina uma nota' : ''}
            />
            <NativeSelect
                radius='lg'
                data={[
                    { value: 'text', label: 'Text' },
                    { value: 'link', label: 'Link' }
                ]}
                rightSectionWidth={30}
                aria-label="type"
                value={note.type}
                onChange={(e) => dispatch(setNoteType({ type: e.currentTarget.value, content: note.content } as any))}
            />
            <Button radius='lg' variant="outline" onClick={() => handleAddNote()}>adicionar</Button>
        </div>
    )
}

export default Form