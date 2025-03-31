import axios from "axios";

interface FormData {
  product: string;
  size: number;
  quantity: number;
  price: number;
  shop: string;
}

export const getStocks = async (shop:string) => {
  try {
    const response = await axios.get(
      `http://localhost:3000/stock/get_all_stocks?Shop=${shop}`
    );
    return response.data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const add_new_stock = async (formdata: FormData) => {
  try {
    console.log(formdata);
    const response = await axios.post(
      "http://localhost:3000/stock/add_new_stock",
      formdata
    );

    return response.data;
  } catch (error) {
    console.log(error);

    return null;
  }
};
