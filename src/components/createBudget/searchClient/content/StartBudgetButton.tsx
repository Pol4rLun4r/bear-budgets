// mantine
import { Button } from '@mantine/core';

// style
import classes from '../SearchClient.module.css';

const StartBudgetButton = ({ clientId }: { clientId?: number }) => {
  return (
    <Button
      variant="light"
      size="compact-sm"
      radius={'lg'}
      className={classes.startButton}
    >
      Iniciar cotação id: {clientId}
    </Button>
  )
};

export default StartBudgetButton;