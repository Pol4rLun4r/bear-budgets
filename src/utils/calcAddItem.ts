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
    const totalWithIPIandST = totalWithIPI + st;
    const markupValue = markup !== 0 ? totalWithIPIandST * (markup / 100) : 0;
    const markupUnitValue = markupValue / quantity;
    const totalWithAll = markupValue + totalWithIPIandST + purchaseShipping;
    const finalUnitValue = totalWithAll / quantity;

    return { totalWithoutTaxes, ipiValue, totalWithIPIandST, markupValue, markupUnitValue, totalWithAll, finalUnitValue };
};

export default calcAddItem;