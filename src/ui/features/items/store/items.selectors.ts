import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "@/app/store";

import calcAddItem from "@/utils/calcAddItem";

const selectLatestPrice = (state: RootState) => state.items.itemDetails.latestPrice;

const brl = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
});

export const selectLatestPriceFormatted = createSelector(
    [selectLatestPrice],
    (latestPrice) => {
        if (!latestPrice || latestPrice.quantity <= 0) return "—";

        const finalUnitValue = calcAddItem(latestPrice).finalUnitValue;

        return Number.isFinite(finalUnitValue)
            ? brl.format(finalUnitValue)
            : "—";
    },
);
