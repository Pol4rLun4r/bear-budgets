// redux
import { RootState, type AppDispatch } from '../../../../redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { incrementStep } from '../../../../redux/createBudget/stepsSlice';
import { quotationBasicDataSliceDataType, setBasicData } from '../../../../redux/createBudget/drafts/quotationBasicDataSlice';

// components
import ClientInfo from "./ClientInfo";
import Form from "./Form";

// api
import clientService from '../../../../services/quotation-api';

// type
import { QuotationQuery } from '../../../../../types/quotation';
import { notifications } from '@mantine/notifications';

const StartBudget = () => {
  const dispatch = useDispatch<AppDispatch>();
  const client_id = useSelector<RootState>((state) => state.createBudget.newClient.id);
  const getBasicData = useSelector<RootState>((state) => state.createBudget.quotationBasicData) as quotationBasicDataSliceDataType;

  const handleSubmit = async (data: any, event: React.FormEvent<HTMLFormElement>) => {
    event.defaultPrevented

    const cleanedData: QuotationQuery = {
      client_id: client_id as number,
      notes: data.notes === '' ? null : data.notes,
      status: Number(data.status) as any
    }

    try {
      const statusIsEqual = getBasicData.status === cleanedData.status;
      const notesIsEqual = getBasicData.notes === cleanedData.notes;

      if (statusIsEqual && notesIsEqual && getBasicData.quotation_version_id !== null && client_id === getBasicData.client_id) {
        notifications.show({
          title: 'Cotação já criada',
          message: 'Usando os dados da cotação existente',
          autoClose: 5000,
          position: 'top-right',
          withCloseButton: false
        },)

        dispatch(incrementStep());
        return;
      }

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