// mantine
import { UnstyledButton, Text } from "@mantine/core"

// redux
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../../redux/store";
import { resetItemValues } from "../../../../redux/createBudget/items/addItemSlice";

const ClearValues = () => {
    const dispatch = useDispatch<AppDispatch>(); 

    const handleClear = () => {
        dispatch(resetItemValues());
    };

    return (
        <UnstyledButton style={{ position: 'absolute', right: 0, top: 0 }} onClick={() => handleClear()} >
            <Text c={'violet'}>Limpar dados</Text>
        </UnstyledButton>
    )
};

export default ClearValues