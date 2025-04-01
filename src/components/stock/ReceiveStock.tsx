"use client"

import { getStocks } from "@/app/action/stock"
import { useEffect, useState } from "react"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import Shop_Tab from "../tabShop"
import ReceiveStockData from "./ReceiveStockData"
import { Card, CardContent } from "@/components/ui/card"
import { PackageOpen, TruckIcon } from "lucide-react"

export default function ReceiveStockPage() {
  const [shop, setShop] = useState("Amariya")
  const [stockData, setStockData] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [refreshCount, setRefreshCount] = useState(false)

  useEffect(() => {
    async function fetchdata() {
      setIsLoading(true)
      console.log("refresh ",refreshCount);
      
      try {
        const res = await getStocks(shop)
        setStockData(res)
        setRefreshCount(false)
      } catch (error) {
        console.error("Failed to fetch stock data:", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchdata()
  }, [shop,refreshCount])

  const handleShopChange = (shopId: string) => {
    console.log(shopId);
    setShop(shopId)
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center space-x-4">
        <div className="p-2 bg-primary/10 rounded-full">
          <PackageOpen className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Receive Stock</h1>
          <p className="text-muted-foreground">Manage incoming inventory for your shops</p>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <Shop_Tab toogleShop={handleShopChange }  selectedShop={shop}>
              <TabsContent value={shop} className="mt-0 p-6">
                {isLoading ? (
                  <div className="flex items-center justify-center h-64">
                    <div className="animate-pulse flex flex-col items-center">
                      <TruckIcon className="h-10 w-10 text-muted-foreground mb-2" />
                      <p className="text-muted-foreground">Loading inventory data...</p>
                    </div>
                  </div>
                ) : (
                  <ReceiveStockData stockData={stockData} shopName={shop} refresh={setRefreshCount} />
                )}
              </TabsContent>
          </Shop_Tab>
        </CardContent>
      </Card>
    </div>
  )
}

