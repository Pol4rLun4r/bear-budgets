// mantine
import { Paper, Stack } from "@mantine/core"

// components
import Header from "./header/@Header";
import Table from "./table/@Table";
import NoItems from "./NoItems";

// style
import classes from './Items.module.css';

// redux
import { useAppDispatch, useAppSelector } from "@/app/reduxHooks";
import { BudgetFormScope } from "../../store/@rootReducer";
import {
    cycleAllItemTags,
    setItemTag,
    setTagEditingEnabled,
} from "../../store/itemTable.slice";

const ItemTable = ({ scope }: { scope: BudgetFormScope }) => {
    const dispatch = useAppDispatch();
    const listItems = useAppSelector((state) => state.budgetForm.itemTable[scope]);
    const tagEditingEnabled = useAppSelector(
        (state) => state.budgetForm.itemTable.tagEditingEnabled[scope],
    );
    return (
        <Stack className={classes.container}>
            <Paper withBorder radius="lg" className={classes.items}>
                <div className={classes.header}>
                    <Header
                        scope={scope}
                        tagEditingEnabled={tagEditingEnabled}
                        onTagEditingChange={(enabled) => dispatch(setTagEditingEnabled({
                            scope,
                            enabled,
                        }))}
                    />
                </div>
                <div className={classes.content}>
                    {listItems.length === 0
                        ? <NoItems />
                        : (
                            <Table
                                scope={scope}
                                tagEditingEnabled={tagEditingEnabled}
                                onTagChange={(itemId, tag) => dispatch(setItemTag({
                                    scope,
                                    itemId,
                                    tag,
                                }))}
                                onCycleAllTags={() => dispatch(cycleAllItemTags(scope))}
                            />
                        )}
                </div>
            </Paper>
        </Stack>
    )
};

export default ItemTable;