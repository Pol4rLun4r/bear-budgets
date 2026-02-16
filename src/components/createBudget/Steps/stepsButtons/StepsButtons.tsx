// redux
import { useSelector, useDispatch } from "react-redux"
import { decrementStep } from "../../../../redux/createBudget/stepsSlice"
import type { RootState, AppDispatch } from "../../../../redux/store"

// mantine
import { Group, Button } from "@mantine/core"

const StepsButtons = () => {
    const dispatch = useDispatch<AppDispatch>();
    const stepState = useSelector<RootState>((state) => state.createBudget.steps.step) as number;

    const handleDecrement = () => {
        if (stepState === 0) {
            return;
        }

        dispatch(decrementStep());
    }

    return (
        <Group justify="space-between" style={{ width: '100%' }} mt={20}>
            <Button
                style={{ width: '45%' }}
                variant="default"
                radius='lg'
                size="lg"
                disabled={stepState === 0 ? true : false}
                onClick={() => handleDecrement()}
            >
                Voltar
            </Button>
            <Button
                style={{ width: '45%' }}
                variant="light"
                radius='lg'
                size="lg"
                type="submit"
                form={
                    stepState === 0 ?
                        'create-client-form' : stepState === 1 ?
                            'start-budget-form' : 'other' 
                }
            >
                Próximo
            </Button>
        </Group>
    )
}

export default StepsButtons