// styles
import classes from './CreateBudget.module.css'

// components
import Items from "../../components/createBudget/items/@Items";

const CreateBudget = () => {
    return (
        <div className={classes.container}>
            <Items />
        </div>
    )
};

export default CreateBudget;