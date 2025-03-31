"use client"
import { getStocks } from "@/app/action/stock";
import { useEffect, useState } from "react";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import Shop_Tab from "../tabShop";
import ReceiveStockData from "./ReceiveStockData";




export default function ReceiveStockPage() {
    const [shop ,setShop]= useState("Amariya")
    const [stockData ,setStockData ] = useState({})


    useEffect(()=>{
    async function fetchdata() {
       const res = await getStocks(shop)
       console.log(res);
       
       setStockData(res)
    }
    fetchdata()
    },[shop])

    
    const handleShopChange=(shopId:string)=>{
        console.log(shopId);
      setShop(shopId)
      }

    return (
        <div>
      <Shop_Tab  toogleShop={handleShopChange}>
            <TabsContent value={shop}>
            < ReceiveStockData stockData={stockData} shopName={shop} />
            </TabsContent>
      </Shop_Tab>

        </div>
    );
}