// mantine
import { Center, Paper, Stack, Text } from "@mantine/core"

// components
import Form from "./Form";
import List from "./List";

import { useSelector } from "react-redux";
import { RootState } from "../../../../../redux/store";

const Notas = () => {
    const notes = useSelector((state: RootState) => state.createBudget.addItem.notes);
    const hasId = useSelector((state: RootState) => state.createBudget.addItem.itemBasicData.id);

    return (
        <div>
            <Text size="sm">Notas do item</Text>
            <Paper radius={'lg'} withBorder mih={100} p='md' style={{ width: '100%' }}>
                <Stack>
                    {hasId ? null :
                        (<Form />)
                    }
                    {notes.length > 0 ? (
                        <List notes={notes} />
                    ) : (
                        <Center>
                            <Text c='dimmed'>Sem notas</Text>
                        </Center>
                    )}
                </Stack>
            </Paper>
        </div>
    )
}

export default Notas;