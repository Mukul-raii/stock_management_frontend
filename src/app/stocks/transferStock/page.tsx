"use client";
import { getStocks, transferStock } from "@/app/action/stock";
import { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardFooter,
  CardDescription
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { ArrowRightLeft, SendHorizontal, Package, Check, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

export default function TransferStocks() {
  const [fromshop, setFromShop] = useState("Amariya");
  const [toshop, setToShop] = useState("Vamanpuri");
  const [stockData, setStockData] = useState([]);
  const [newQuantities, setNewQuantities] = useState<{ [key: number]: number }>({});
  const [isSuccess,setIsSuccess]=useState(false)
  const [isLoading, setIsLoading] = useState(false);


  useEffect(() => {
    async function fetchData() {
      const getStockData = await getStocks(fromshop);

      setStockData(getStockData);
    }
    fetchData();
  }, [fromshop, newQuantities]);

  const handleToogleTransfer = () => {
    const temp: string = fromshop;

    setFromShop(toshop);
    setToShop(temp);
  };

  async function handleTransfer (){
    try {
      const response = await transferStock(fromshop, newQuantities);
      console.log(response);
    } catch (error) {
      console.error("Error in addNewBillHistory:", error);
    }
}
const totalItemsToTransfer = Object.values(newQuantities).filter((qty) => qty > 0).length
const totalQuantityToTransfer = Object.values(newQuantities).reduce((sum, qty) => sum + (qty || 0), 0)

return (
  <div className="container mx-auto py-6 max-w-5xl">
    <Card className="shadow-md border-muted/40">
        <CardHeader className="pb-4 bg-muted/10">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl flex items-center gap-2">
                <SendHorizontal className="h-5 w-5 text-primary" />
                Stock Transfer
              </CardTitle>
              <CardDescription className="mt-1">Move inventory between locations</CardDescription>
            </div>
            {isSuccess && (
              <Badge
                variant="outline"
                className="bg-green-50 text-green-700 border-green-200 flex items-center gap-1 px-3 py-1.5"
              >
                <Check className="h-4 w-4" />
                Transfer successful
              </Badge>
            )}
          </div>
        </CardHeader>

        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-center gap-3 mb-6">
           
            <div className="w-full md:w-auto flex-1">
              <Button className="w-full" variant={"outline"}>
                {fromshop}
              </Button>
              </div>

              <div className="flex items-center justify-center my-2 md:my-0 md:mt-6">

              <Button   className="rounded-full h-10 w-10 border-dashed"  onClick={handleToogleTransfer}>
              <ArrowRightLeft className="h-4 w-4" />
              </Button>
              </div>
              <div className="w-full md:w-auto flex-1">
              <Button className="w-full" variant={"outline"}>
                {" "}
                {toshop}
              </Button>
            </div>
            </div>



            {isLoading && stockData.length === 0 ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="rounded-md border overflow-hidden">
              <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30 hover:bg-muted/30">
                    <TableHead className="w-[250px]">Product</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead>Available Quantity</TableHead>
                    <TableHead>Price (₹)</TableHead>
                    <TableHead className="text-right">New Stock</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                {stockData.length > 0 ? (
                      stockData.map((item: any) => {
                    const hasNewQuantity =
                      newQuantities[item.id] !== undefined &&
                      newQuantities[item.id] > 0;

                    return (
                      <TableRow
                        key={item.id}
                        className={`border-b ${hasNewQuantity ? "bg-primary/5" : ""}`}
                      >
                        <TableCell className="py-3 font-medium">
                          {item.product}
                        </TableCell>
                        <TableCell className="py-3">{item.size}</TableCell>
                        <TableCell className="py-3">{item.quantity}</TableCell>
                        <TableCell className="py-3">₹{item.price}</TableCell>
                        <TableCell className="py-3 text-right">
                          <div className="flex items-center justify-end">
                              <Input
                                  type="number"
                                  min="0"
                                  max={item.quantity}
                                  placeholder="0"
                                  value={newQuantities[item.id] || ""}
                                  onChange={(e) => {
                                    const value = e.target.value === "" ? 0 : Number.parseInt(e.target.value, 10)
                                    if (value >= 0 && value <= item.quantity) {
                                      setNewQuantities((prev) => ({
                                        ...prev,
                                        [item.id]: value,
                                      }))
                                    }
                                  }}
                                  className={`w-24 text-right ${
                                    hasNewQuantity ? "border-primary/50 bg-primary/5" : ""
                                  }`}
                                />
                                   </div>
                                        
                        </TableCell>
                        </TableRow>
                        )})
                      )  : (
                      <TableRow>
                        <TableCell colSpan={5} className="h-24 text-center">
                          No stock data available for this location
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
              </Table>
            </div>
            </div>
          
          
          
          )}
          </CardContent>

                <CardFooter className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 border-t bg-muted/5">
          <div className="text-sm text-muted-foreground">
            {totalItemsToTransfer > 0 ? (
              <span>
                Transferring <strong>{totalItemsToTransfer}</strong> {totalItemsToTransfer === 1 ? "item" : "items"}{" "}
                (Total: <strong>{totalQuantityToTransfer}</strong> units)
              </span>
            ) : (
              <span>Select quantities to transfer</span>
            )}
          </div>
          <Button
            variant="default"
            onClick={handleTransfer}
            disabled={totalItemsToTransfer === 0 || isLoading}
            className="w-full sm:w-auto"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <SendHorizontal className="mr-2 h-4 w-4" />
                Transfer Stock
              </>
            )}
          </Button>
        </CardFooter>
        </Card>
      </div>
    );
}