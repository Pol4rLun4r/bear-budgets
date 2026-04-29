// redux
import { useSelector } from 'react-redux';
import type { RootState } from '../../redux/store';

// tabs
import CreateBudget from '../createBudget/@CreateBudget';
import ComingSoon from '../comingSoon/@ComingSoon';

// styles
import classes from './ManagerPage.module.css';


const ManagerPage = () => {
    const tabState = useSelector((state: RootState) => state.sidebar.tab.activeTab);

    return (
        <main className={classes.main}>
            {tabState === 0 && <CreateBudget />}
            {tabState !== 0 && (
                <ComingSoon/>
            )}
        </main>
    )
}

export default ManagerPage