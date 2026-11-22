// mantine
import { Paper, Transition } from "@mantine/core";

// components
import Calc from "./Calc";

// styles
import classes from "../../ItemFormModal.module.css";

// redux
import { ItemFormScope } from "../../store/itemForm.slice";

interface CalcAsideProps {
    scope: ItemFormScope;
    mounted: boolean;
    placement: "left" | "right";
    variant: "primary" | "details";
}

const CalcAside = ({ scope, mounted, placement, variant }: CalcAsideProps) => (
    <Transition
        mounted={mounted}
        transition={placement === "left" ? "fade-right" : "fade-left"}
        duration={220}
        timingFunction="ease"
    >
        {(transitionStyles) => (
            <Paper
                className={`${classes.aside} ${placement === "left" ? classes.asidePrimary : classes.asideDetails}`}
                radius="lg"
                p="md"
                withBorder
                style={transitionStyles}
            >
                <Calc scope={scope} layout={variant} />
            </Paper>
        )}
    </Transition>
);

export default CalcAside;
