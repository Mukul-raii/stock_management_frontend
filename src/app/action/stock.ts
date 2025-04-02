import { DailyExpenseType } from "@/components/stock_add";
import axios from "axios";

interface FormData {
  product: string;
  size: number;
  price: number;
  shop: string;
}

export const getStocks = async (shop: string) => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_API}/stock/get_all_stocks?Shop=${shop}`,
      {
        headers: {
          "Content-Type": "application/json",

          Accept: "application/json",
        },
      }
    );
    console.log("your stock ", response);

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
      `${process.env.NEXT_PUBLIC_BACKEND_API}/stock/add_new_stock`,
      formdata,
      {
        headers: {
          "Content-Type": "application/json",

          Accept: "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.log(error);

    return null;
  }
};

export const addNewBillHistory = async (
  dailyExpenses: any,
  cashLeft: number,
  date: Date,
  stockData: {
    id: number;
    product: string;
    size: number;
    quantity: number;
    price: number;
    shop: string;
    lastQuantity: number;
  }[], // Ensure it's expecting an array
  shopName: string
) => {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_API}/billhistory/generate_bill_history`,
      { ...dailyExpenses, cashLeft, date, stockData, shopName },
      {
        headers: {
          "Content-Type": "application/json",

          Accept: "application/json",
        },
      }
    );

    return response.status;
  } catch (error) {
    console.error("Error in addNewBillHistory:", error);

    return null;
  }
};

export const receiveNewStock = async (
  shopName: string,
  newQuantities: { [key: number]: number }
) => {
  try {
    const response = await axios.put(
      `${process.env.NEXT_PUBLIC_BACKEND_API}/stock/update_stock`,
      { shopName, newQuantities },
      {
        headers: {
          "Content-Type": "application/json",

          Accept: "application/json",
        },
      }
    );

    return response.status;
  } catch (error) {
    console.error("Error in addNewBillHistory:", error);
  }
};

export const transferStock = async (
  fromshop: string,
  newQuantities: { [key: number]: number }
) => {
  try {
    const response = await axios.put(
      `${process.env.NEXT_PUBLIC_BACKEND_API}/stock/transfer_stock`,
      { fromshop, newQuantities },
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );
    console.log(response.data);

    return response.data;
  } catch (error) {
    console.error("error while transfering ");
  }
};
