// mantine
import { Button } from "@mantine/core"

// style
import classes from '../SearchClient.module.css'

const StartBudgetButton = () => {
  return (
    <Button variant="light" size="compact-sm" radius={'lg'} className={classes.startButton}>Iniciar cotação</Button>
  )
}

export default StartBudgetButton;