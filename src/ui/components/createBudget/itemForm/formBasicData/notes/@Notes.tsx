// mantine
import { Center, Paper, Stack, Text } from "@mantine/core"

// components
import Form from "./Form";
import List from "./List";

import { useSelector } from "react-redux";
import { RootState } from "../../../../../redux/store";

// types
import { ItemFormScope } from "../../../../../redux/createBudget/items/itemFormSlice";

const Notas = ({ scope }: { scope: ItemFormScope }) => {
    const notes = useSelector((state: RootState) => state.createBudget.itemForm[scope].notes);
    const hasId = useSelector((state: RootState) => state.createBudget.itemForm[scope].item_basic_data.id);

    return (
        <div>
            <Text size="sm">Notas do item</Text>
            <Paper radius={'lg'} withBorder mih={100} p='md' style={{ width: '100%' }}>
                <Stack>
                    {hasId ? null :
                        (<Form scope={scope} />)
                    }
                    {notes.length > 0 ? (
                        <List notes={notes} scope={scope} />
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