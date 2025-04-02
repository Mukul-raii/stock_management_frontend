"use client"

import { useEffect, useState } from "react";
import Shop_Tab from "@/components/tabShop";
import { Tabs, TabsContent } from "@radix-ui/react-tabs";
import BillhistoryData from "@/components/billhistory/billhistoryData";
import { fetchBillBookData } from "../action/billhistory";



export default function BillHistory() {
  const [shop, setShop] = useState("Amariya");
  const [data ,setData]= useState<BillType[]>([])
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
    async function fetchData() {
        setLoading(true);
        try {
          const res = await fetchBillBookData(shop);
          setData(res);
        } catch (error) {
          console.error("Error fetching bill data:", error);
        } finally {
          setLoading(false);
        }
      }
      fetchData();
    }, [shop]);

  const handleShopChange = (shopId: string) => {
    console.log(shopId);
    setShop(shopId);
  };

  return (
    <div className="min-h-screen w-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Bill Book</h1>
          </div>
          
          <Tabs defaultValue="Amariya" className="w-full">
            <Shop_Tab toogleShop={handleShopChange} selectedShop={shop}>
              <TabsContent value={shop} className="pt-4 w-full">
                {loading ? (
                  <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                  </div>
                ) : (
                  <BillhistoryData data={data} />
                )}
              </TabsContent>
            </Shop_Tab>
          </Tabs>
        </div>
      </div>
    </div>
  );
}



export type BillType = {
    id:number;
    date:Date;
    pdfDate:Date;
    rateDiff:number;
    rent:number;
    salary:number;
    shop:string;
    discount:number;
    totalBeerSale:number;
    totalCashReceived:number;
    totalDesiSale:number;
    canteenCash:number;
    breakageCash:number;
    totalSale:number;
    transportation:number;
    upiPayment:number;
    
}