"use client"
import StockAdd from "@/components/stock_add";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { useState } from "react";
import  Shop_tab from '@/components/tabShop'


export default function Stocks() {
const [shop ,setShop]= useState("Amariya")

const handleShopChange=(shopId:string)=>{
  console.log(shopId);
setShop(shopId)
}

    return (
      <div className="m-3">
        <Tabs defaultValue="Amariya">
      <Shop_tab  toogleShop={handleShopChange}>

      <TabsContent value={shop}>
         <StockAdd shopName={shop}/>
        </TabsContent>
      </Shop_tab>
        </Tabs>
      </div>
    );
  }
