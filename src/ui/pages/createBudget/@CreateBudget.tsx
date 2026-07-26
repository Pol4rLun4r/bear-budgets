// styles
import classes from './CreateBudget.module.css'

// components
import Items from "../../components/createBudget/items/@Items";
import QuotationInfo from '../../components/createBudget/quotationInfo/@QuotationInfo';

const CreateBudget = () => {
    return (
        <div className={classes.container}>
            <QuotationInfo/>
            <Items />
        </div>
    )
};

export default CreateBudget;