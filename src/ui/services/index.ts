import clientApi from "./client-api";
import itemApi from "./item-api";
import quotationApi from "./quotation-api";

const services = {
    item: itemApi,
    client: clientApi,
    quotation: quotationApi
}

export default services;