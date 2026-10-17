// mantine
import { Paper, Stack } from "@mantine/core"

// components
import ItemsBar from "./itemsBar/@ItemsBar";
import List from "./List/@List";
import NoItems from "./NoItems";

// style
import classes from './Items.module.css';

// redux
import { RootState } from "../../../redux/store";
import { useSelector } from "react-redux";
import { BudgetFormScope } from "../../../redux/budgetForm/@rootReducer";

const Items = ({ scope }: { scope: BudgetFormScope }) => {
    const listItems = useSelector((state: RootState) => state.budgetForm.listItems[scope]);

    return (
        <Stack className={classes.container}>
            <Paper withBorder radius="lg" className={classes.items}>
                <div className={classes.header}>
                    <ItemsBar scope={scope} />
                </div>
                <div className={classes.content}>
                    {listItems.length === 0 ? <NoItems /> : <List scope={scope} />}
                </div>
            </Paper>
        </Stack>
    )
};

export default Items;