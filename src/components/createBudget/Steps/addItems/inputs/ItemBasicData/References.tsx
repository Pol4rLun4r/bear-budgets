// mantine
import { Button, Center, Divider, Paper, Stack, Text, TextInput, NativeSelect } from "@mantine/core"

// type
import { ItemReferenceNoteType } from "../../../../../../redux/createBudget/items/addItemSlice";

import { useSelector } from "react-redux";
import { RootState } from "../../../../../../redux/store";

// react
import { useState } from "react"

const References = () => {
    const notes = useSelector((state: RootState) => state.createBudget.addItem.notes);

    const select = (
        <NativeSelect
            radius='lg'
            data={[
                { value: 'text', label: 'Text' },
                { value: 'link', label: 'Link' }
            ]}
            rightSectionWidth={30}
            aria-label="type"
            styles={{
                input: {
                    fontWeight: 500,
                    borderTopLeftRadius: 0,
                    borderBottomLeftRadius: 0,
                    width: 70,
                    marginRight: -2
                }
            }}
        />
    )

    return (
        <Paper radius={'lg'} withBorder mih={100} p='md' style={{ width: '100%' }}>
            <Stack>
                <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                    <TextInput
                        style={{ width: '80%' }}
                        label='Nova referencia'
                        radius='lg'
                        rightSection={select}
                        placeholder="(opcional)"
                        rightSectionWidth={70}
                    />
                    <Button radius='lg' variant="default" c='dimmed'>adicionar</Button>
                </div>
                <Divider />
                {notes.length > 0 ? (
                    <Stack>
                        {notes.map((note: ItemReferenceNoteType) => (
                            <Paper key={note.id} radius='md' withBorder p='sm'>
                                <Text size="sm">{note.content}</Text>
                            </Paper>
                        ))}
                    </Stack>
                ) : (
                    <Center>
                        <Text c='dimmed'>Sem referencias</Text>
                    </Center>
                )}
            </Stack>
        </Paper>
    )
}

export default References