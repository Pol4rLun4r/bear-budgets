// mantine
import { Button } from '@mantine/core';

// style
import classes from '../SearchClient.module.css';

// redux
import { AppDispatch } from '../../../../redux/store';
import { useDispatch } from 'react-redux';
import startBudget from '../../../../redux/createBudget/searchClient/startBudgetButton.thunk';

// axios
import clientService from '../../../../services/client-api';

const StartBudgetButton = ({ clientId }: { clientId?: number }) => {
  const dispatch = useDispatch<AppDispatch>();

  const handleCreateBudget = async () => {
    try {
      const response = await clientService.get(clientId!);

      dispatch(startBudget(response.data));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Button
      variant="light"
      size="compact-sm"
      radius={'lg'}
      className={classes.startButton}
      onClick={handleCreateBudget}
    >
      Criar orçamento
    </Button>
  )
};

export default StartBudgetButton;