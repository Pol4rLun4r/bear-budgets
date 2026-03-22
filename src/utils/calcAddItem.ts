type CalcType = {
    unitValue?: number | undefined;
    quantity?: number | undefined;
    markup?: number | undefined;
    ipi?: number | undefined;
    st?: number | undefined;
    purchaseShipping?: number | undefined;
};

const calcAddItem = ({ unitValue = 0, quantity = 0, markup = 0, ipi = 0, purchaseShipping = 0, st = 0 }: CalcType) => {
    const totalWithoutTaxes = quantity * unitValue;
    const ipiValue = ipi !== 0 ? totalWithoutTaxes * (ipi / 100) : 0;
    const totalWithIPI = ipiValue + totalWithoutTaxes;
    const totalWithIPIandST = totalWithIPI + st

    return { totalWithoutTaxes, ipiValue, totalWithIPIandST };
};

export default calcAddItem;