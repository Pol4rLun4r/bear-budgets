// styles
import classes from './CreateBudget.module.css'

// framer-motion
import { AnimatePresence } from 'framer-motion';

// components
import Steps from './Steps/Steps';
import SearchClient from './SearchClient/SearchClient';
import SlideContent from './slideContent/SlideContent';
import BackBeginningButton from './backBeginningButton/BackBeginningButton';

// redux
import type { RootState } from '../../redux/store';
import { useSelector } from 'react-redux';

const CreateBudget = () => {
    const showSteps = useSelector((state: RootState) => state.steps.showSteps);

    return (
        <div className={classes.container}>
            <div className={classes.slideWrapper}>
                <AnimatePresence mode='wait'>
                    {!showSteps ? (
                        <SlideContent key='search-client'>
                            <SearchClient />
                        </SlideContent>
                    ) : (
                        <SlideContent key='steps'>
                            <Steps />
                        </SlideContent>
                    )}
                </AnimatePresence>
                <BackBeginningButton />
            </div>
        </div>
    )
};

export default CreateBudget;