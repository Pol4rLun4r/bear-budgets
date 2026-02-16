// redux
import { useSelector } from 'react-redux';
import type { RootState } from '../../redux/store';

// tabs
import CreateBudget from '../createBudget/CreateBudget';

// styles
import classes from './MainContainer.module.css';

// mantine
import { Text, Title } from '@mantine/core';

const MainContainer = () => {
    const tabState = useSelector((state: RootState) => state.sidebar.tab.activeTab);

    return (
        <main className={classes.main}>
            {tabState === 0 && <CreateBudget />}
            {tabState !== 0 && (
                <>
                    <Title >Hello world {tabState}</Title>
                    <Text>1. Existir uma cotação por CNPJ</Text>
                    <Text>2. O nome do cliente deve servir apenas como apelido</Text>
                    <Text>3. Ao criar uma cotação com o mesmo CNPJ, buscar os dados da mesma, sem criar uma outra</Text>
                </>
            )}
        </main>
    )
}

export default MainContainer