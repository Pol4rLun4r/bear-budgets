import type { ReactNode } from 'react';

// redux
import { useSelector } from 'react-redux';
import type { RootState } from '../../redux/store';

// tabs
import CreateBudgetPage from '../CreateBudgetPage.tsx';
import BudgetsPage from '../BudgetsPage.tsx';
import ItemsPage from '../ItemsPage.tsx';
import ComingSoon from '../comingSoon/@ComingSoon';

// styles
import classes from './ManagerPage.module.css';


const ManagerPage = () => {
    const tabState = useSelector((state: RootState) => state.sidebar.tab.activeTab);
    const tabContentById: Record<number, ReactNode> = {
        0: <CreateBudgetPage />,
        1: <BudgetsPage />,
        2: <ItemsPage/>
    };

    return (
        <main className={classes.main}>
            {tabContentById[tabState] ?? <ComingSoon />}
        </main>
    )
}

export default ManagerPage