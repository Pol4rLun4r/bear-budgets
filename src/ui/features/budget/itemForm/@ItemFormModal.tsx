// mantine
import { Box, em, Modal } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";

// redux
import { useAppSelector } from "@/app/reduxHooks";
import type { ItemFormScope } from "./store/itemForm.slice";
import { BudgetFormScope } from "../budgetForm/store/@rootReducer";
import { getStepState, getSwitchModeValuesForm } from "./store/itemForm.selectors";

// components
import ItemForm from "./@ItemForm";
import HiddenContentWarning from "./components/HiddenContentWarning";
import CalcAside from "./components/ItemValues/CalcAside";

// styles
import classes from "./ItemFormModal.module.css";

// utils
import hasVisibleCalculationSummary, {
    hasVisibleCalculationDetails,
} from "./utils/hasVisibleCalculationSummary";

interface ItemFormModalProps {
    opened: boolean;
    onClose: () => void;
    title: string;
    scope: ItemFormScope;
    budgetScope: BudgetFormScope;
}

const ItemFormModal = ({
    opened,
    onClose,
    title,
    scope,
    budgetScope,
}: ItemFormModalProps) => {
    const isWideLayout = useMediaQuery(`(min-width: ${em(1280)})`, true, {
        getInitialValueInEffect: false,
    });
    const step = useAppSelector((state) => getStepState(state, scope));
    const simpleMode = useAppSelector(getSwitchModeValuesForm);
    const simpleModeVisibleFields = useAppSelector(
        (state) => state.settings.value?.interface.itemForm.itemValues.simpleModeVisibleFields ?? [],
    );
    const showAsideCalc =
        isWideLayout &&
        step === 1 &&
        hasVisibleCalculationSummary(simpleMode, simpleModeVisibleFields);
    const showDetailsCalc =
        showAsideCalc && hasVisibleCalculationDetails(simpleMode, simpleModeVisibleFields);

    return (
        <Modal.Root
            opened={opened}
            onClose={onClose}
            centered
            size="lg"
            padding={0}
            radius="lg"
            classNames={{ inner: classes.inner, content: classes.content }}
        >
            <Modal.Overlay backgroundOpacity={0.55} />
            <Modal.Content radius="lg">
                <HiddenContentWarning scope={scope} />
                <Box className={classes.formPane}>
                    <Modal.Header px="lg" pt="md" pb="sm">
                        <Modal.Title>{title}</Modal.Title>
                        <Modal.CloseButton />
                    </Modal.Header>
                    <Modal.Body p="lg" pt="sm">
                        <ItemForm
                            opened={opened}
                            scope={scope}
                            budgetScope={budgetScope}
                            closeModal={onClose}
                            showInlineCalc={!isWideLayout}
                        />
                    </Modal.Body>
                    <CalcAside
                        scope={scope}
                        mounted={opened && showDetailsCalc}
                        variant="details"
                        placement="left"
                    />
                    <CalcAside
                        scope={scope}
                        mounted={opened && showAsideCalc}
                        variant="primary"
                        placement="right"
                    />
                </Box>
            </Modal.Content>
        </Modal.Root>
    );
};

export default ItemFormModal;
