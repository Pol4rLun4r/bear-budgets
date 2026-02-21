// redux
import { RootState, type AppDispatch } from '../../../../redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { incrementStep } from '../../../../redux/createBudget/stepsSlice';
import { setBasicData } from '../../../../redux/createBudget/drafts/quotationBasicDataSlice';

// components
import ClientInfo from "./ClientInfo";
import Form from "./Form";

// api
import clientService from '../../../../services/quotation-api';

// type
import { QuotationQuery } from '../../../../../types/quotation';

const StartBudget = () => {
  const dispatch = useDispatch<AppDispatch>();
  const client_id = useSelector<RootState>((state) => state.createBudget.newClient.id);

  const handleSubmit = async (data: any, event: React.FormEvent<HTMLFormElement>) => {
    event.defaultPrevented

    const cleanedData: QuotationQuery = {
      client_id: client_id as number,
      notes: data.notes,
      status: Number(data.status) as any
    }

    try {
      const response = await clientService.create(cleanedData);

      dispatch(setBasicData(response.data));
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