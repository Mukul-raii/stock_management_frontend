import { getStocks } from "@/app/action/stock";
import { useEffect } from "react";

interface ShopProps {
    shopName: string;
    stockData:any;
}



export default function ReceiveStockData({shopName , stockData}:ShopProps ) {
  

    return(
        <>
        <h1>{shopName}</h1>
        <p>{JSON.stringify(stockData, null, 2)}</p>
        </>
    )
}