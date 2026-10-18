// styles
import classes from './Sidebar.module.css';

// components
import MainOptions from './components/MainOptions';
import SecondaryOptions from './components/SecondaryOptions';

// redux
import { useSelector } from 'react-redux';
import { selectIsSidebarCollapsed } from '../store/layout.selectors';

const Sidebar = () => {
        const isSidebarCollapsed = useSelector(selectIsSidebarCollapsed);

    return (
        <nav className={classes.sideBar} data-collapsed={isSidebarCollapsed}>
            <MainOptions />
            <SecondaryOptions />
        </nav>
    )
}

export default Sidebar;