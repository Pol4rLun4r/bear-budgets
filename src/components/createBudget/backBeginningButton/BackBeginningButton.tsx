// mantine
import { Tooltip, ActionIcon } from "@mantine/core"

// redux
import type { AppDispatch, RootState } from "../../../redux/store";
import { useDispatch, useSelector } from "react-redux";
import resetCreateBudget from "../../../redux/createBudget/resetCreateBudget.thunk";

// icons
import { IconArrowLeft } from "@tabler/icons-react";

// style
import classes from './BackBeginningButton.module.css';

const BackBeginningButton = () => {
    const dispatch = useDispatch<AppDispatch>();
    const showSteps = useSelector((state: RootState) => state.steps.showSteps);

    const handleReset = () => dispatch(resetCreateBudget());

    return (
        <Tooltip
            label='Voltar ao inicio'
            position='right'
        >
            <ActionIcon
                className={classes.backButton}
                size='lg'
                onClick={handleReset}
                radius='lg'
                variant='default'
                disabled={showSteps ? false : true}
            >
                <IconArrowLeft />
            </ActionIcon>
        </Tooltip>
    )
}

export default BackBeginningButton;