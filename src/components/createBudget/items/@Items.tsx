// mantine
import { Paper, Stack } from "@mantine/core"

// components
import ItemsBar from '../itemsBar/@ItemsBar';
import List from "./List/@List";
import NoItems from "./NoItems";

// style
import classes from './Items.module.css';
import { RootState } from "../../../redux/store";
import { useSelector } from "react-redux";

const Items = () => {
    const listItems = useSelector((state: RootState) => state.createBudget.listItems);

    return (
        <Stack mt="lg" className={classes.container}>
            <ItemsBar />
            <Paper withBorder radius="lg" className={classes.items}>
                <List/>
            </Paper>
        </Stack>
    )
};

export default Items;