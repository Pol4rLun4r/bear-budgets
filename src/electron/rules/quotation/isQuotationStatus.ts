const isQuotationStatus = (status: unknown): status is QuotationStatus =>
    status === 0 || status === 1 || status === 2 || status === 3;

export default isQuotationStatus;
