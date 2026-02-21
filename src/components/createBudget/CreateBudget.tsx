// styles
import classes from './CreateBudget.module.css'

// components
import Steps from './Steps/Steps';
import SearchClient from './searchClient/SearchClient';
import BackBeginningButton from './backBeginningButton/BackBeginningButton';

// redux
import type { RootState } from '../../redux/store';
import { useSelector } from 'react-redux';

const CreateBudget = () => {
    const showSteps = useSelector((state: RootState) => state.createBudget.showSteps.showSteps);

    return (
        <div className={classes.container}>
                {!showSteps ? (
                    <SearchClient />
                ) : (
                    <Steps />
                )}
            <BackBeginningButton />
        </div>
    )
};

export default CreateBudget;