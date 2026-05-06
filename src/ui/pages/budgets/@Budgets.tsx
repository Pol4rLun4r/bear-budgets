// react
import { useEffect, useState } from "react";

// components
import List from "./List/@List.tsx";

// api
import services from "../../services/index.ts";

const Budgets = () => {
  const [budgets, setBudgets] = useState<QuotationSummary[]>([]);

  // puxa os dados dos orçamentos
  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      const response = await services.quotation.getAllSummary();

      if (!response.success) {
        console.log('fetch error');
        if (isMounted) setBudgets([]);
        return;
      }

      if (!isMounted) return;

      const data = response.data;
      setBudgets(Array.isArray(data) ? data : []);
    };

    void fetchData();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <List budgets={budgets} />
  )
}

export default Budgets