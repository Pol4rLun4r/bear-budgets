// redux
import type { AppDispatch } from '../../../../redux/store';
import { useDispatch } from 'react-redux';
import { incrementStep } from '../../../../redux/createBudget/stepsSlice';

// components
import ClientInfo from "./ClientInfo";
import Form from "./Form";

const StartBudget = () => {
  const dispatch = useDispatch<AppDispatch>();

  const handleSubmit = async (data: any, event: React.FormEvent<HTMLFormElement>) => {
    event.defaultPrevented

    try {
      console.log(data);

      dispatch(incrementStep());
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      <ClientInfo />
      <Form handleSubmit={handleSubmit} />
    </>
  )
}

export default StartBudget