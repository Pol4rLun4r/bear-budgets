// mantine
import { Paper, Stack } from "@mantine/core"

// components
import ItemsBar from '../itemsBar/@ItemsBar';
import NoItems from "./NoItems";

// style
import classes from './Items.module.css';

// redux
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";

const Items = () => {
    const listItems = useSelector((state: RootState) => state.createBudget.listItems);

    return (
        <Stack mt="lg" className={classes.container}>
            <ItemsBar />
            <Paper withBorder radius="lg" className={classes.items}>
                {/* <NoItems /> */}
                <Stack>
                    {listItems.map((item, index) => (
                        <div key={index}>
                            <div>{item.itemBasicData.description}</div>
                            <div>{item.values.unit_price}</div>
                        </div>
                    ))}
                </Stack>
            </Paper>
        </Stack>
    )
}

export default Items;