"use client"
import { addNewBillHistory, getStocks } from "@/app/action/stock";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table";
import { useEffect, useState } from "react";
  
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, Package } from "lucide-react";
import { useId } from "react";

import { AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

  
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Check, Copy, UserRoundPlus } from "lucide-react";
import {Label} from "@/components/ui/label";

interface StockAddProps{
    shopName:string
}

interface ItemType{
    id:number,
    product:string,
    size:number,
    quantity:number,
    price:number,
    shop:string,
}

export interface DailyExpenseType{
  discount : number,
  upiPayment : number,
  canteenCash : number,
  breakageCash :number,
  ratedifference:number,
  transportation:number,
  rent:number,
  totalCash :number,
  totalBeerSale:number,
  totalLiquorSale:number 
}

export default function StockAdd({ shopName }: StockAddProps) {
  const id = useId();
  const [date, setDate] = useState<Date>(new Date());
  const [cashLeft, setCashLeft] = useState(0);
  const [stockData, setStockData] = useState<
  {
    id: number;
    product: string;
    size: number;
    quantity: number;
    price: number;
    shop: string;
    lastQuantity: number;
  }[]
>([]);

  const [newQuantities, setNewQuantities] = useState<{[key:number]: number}>({});
  const [ isConfirmDialogOpen ,setIsConfirmDialogOpen] = useState(false)
  const [isMainDialogOpen, setIsMainDialogOpen] = useState(false);

 const [dailyExpenses,setDailyExpenses]=useState({
    discount : 0,
    upiPayment : 0,
    canteenCash : 0,
    breakageCash :0,
    ratedifference:0,
    transportation:0,
    rent:0,
    totalCash :0,
    totalBeerSale:0,
    totalLiquorSale:0
  })
  
  useEffect(()=>{
    let totalCash = 0 ;
    let totalLiquorSale = 0;
    let totalBeerSale = 0;

    stockData?.forEach((stock)=>{
      const currentQuantity = newQuantities[stock.id] !== undefined ? newQuantities[stock.id] : stock.lastQuantity
      const soldQuantity =stock.quantity-currentQuantity
      
      const saleAmount = soldQuantity * stock.price;

    
      totalCash += saleAmount;

      if (stock.product.toLowerCase().includes("desi")) {
        totalLiquorSale += saleAmount;
      } else {
        totalBeerSale += saleAmount;
      }
    })
    
    setDailyExpenses((prevExpenses) => ({
      ...prevExpenses,
      totalCash:   totalCash,
      totalLiquorSale: totalLiquorSale,
      totalBeerSale: totalBeerSale,
    }));
    
    
  },[newQuantities,stockData])
  
  useEffect(() => {
    
    setCashLeft(
      dailyExpenses.totalCash - dailyExpenses.breakageCash - dailyExpenses.discount +
      dailyExpenses.canteenCash + dailyExpenses.ratedifference - 
      dailyExpenses.transportation - dailyExpenses.upiPayment -dailyExpenses.rent
    );
  }, [dailyExpenses]);

  useEffect(() => {
    async function  fetchdata  ()  {
    const result = await getStocks(shopName)  
    console.log({result});
    
    const updatedstock =result?.map((item:ItemType)=>({
      ...item,
      lastQuantity:item.quantity
    }))
      setStockData(updatedstock)
      
    }
    fetchdata()
  },[shopName])


  


  const handleDailyExpenses= (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name !== "totalCash" && name !== "totalBeerSale" && name !== "totalLiquorSale") {
    setDailyExpenses((prevExpenses) => ({
      ...prevExpenses,
      [name]: parseFloat(value),
    }));
}

  }


  const handleSubmit =async ()=>{
    const res = await addNewBillHistory(dailyExpenses,cashLeft,date,stockData,shopName)
      if(res===200){
      setIsConfirmDialogOpen(false)
      setIsMainDialogOpen(false); // Close the main dialog too
    }else{
      <div>Error in bill history</div>
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold"> {shopName} - Stock Management</h2>
        <div className="w-48">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id={id}
                variant={"outline"}
                className={cn(
                  "group w-full justify-between bg-background px-3 font-normal outline-offset-0 hover:bg-background focus-visible:border-ring focus-visible:outline-[3px] focus-visible:outline-ring/20",
                  !date && "text-muted-foreground",
                )}
              >
                <span className={cn("truncate", !date && "text-muted-foreground")}>
                  {date ? format(date, "PPP") : "Pick a date"}
                </span>
                <CalendarIcon
                  size={16}
                  strokeWidth={2}
                  className="shrink-0 text-muted-foreground/80 transition-colors group-hover:text-foreground"
                  aria-hidden="true"
                />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-2" align="start">
              <Calendar required mode="single" selected={date} onSelect={setDate} />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Inventory Stock</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>Product</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Opening Stock</TableHead>
                <TableHead>Closing Stock</TableHead>
                <TableHead>Sold</TableHead>
                <TableHead>Price (₹)</TableHead>
                <TableHead className="text-right">Total Sale (₹)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stockData && stockData.map((item) => {
                const newQuantity = newQuantities[item.id] !== undefined  ? newQuantities[item.id] : item.lastQuantity
                console.log(newQuantity);
                const soldQuantity = item.quantity - newQuantity
                const totalSale = soldQuantity * item.price

                return (
                  <TableRow key={item.id} className="border-b hover:bg-muted/30">
                    <TableCell className="py-3 font-medium">{item.product}</TableCell>
                    <TableCell className="py-3">{item.size}</TableCell>
                    <TableCell className="py-3">{item.quantity}</TableCell>
                    <TableCell className="py-3">
                      <Input
                        type="number"
                        min="0"
                        max={item.quantity}
                        value={newQuantities[item.id] ?? item.lastQuantity}
                        onChange={(e) => {
                          const rawValue = e.target.value;

                          const value = rawValue === " " ? item.lastQuantity : Number.parseInt(e.target.value, 10)
                          console.log(rawValue);
                          
                           setNewQuantities((prev) => ({ ...prev, [item.id]: value }))
                           item.lastQuantity=value
                          }
                        }
                        className="w-20"
                      />
                    </TableCell>
                    <TableCell className="py-3">{soldQuantity}</TableCell>
                    <TableCell className="py-3">{item.price}</TableCell>
                    <TableCell className="py-3 text-right font-medium">{totalSale}</TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Dialog open={isMainDialogOpen} onOpenChange={setIsMainDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setIsMainDialogOpen(true)}>Submit Daily Report</Button>
          </DialogTrigger>
          <DialogContent className="md:max-w-3xl">
            <DialogHeader>
              <DialogTitle>Daily Expenses & Sales Summary</DialogTitle>
              <DialogDescription>Review and adjust the daily expenses before final submission.</DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
              <div className="space-y-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Sales Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between">
                      <span>Total Sale:</span>
                      <span className="font-medium">₹{dailyExpenses.totalCash}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Beer Sale:</span>
                      <span>₹{dailyExpenses.totalBeerSale.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Country Liquor Sale:</span>
                      <span>₹{dailyExpenses.totalLiquorSale.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t">
                      <span className="font-medium">Cash Left:</span>
                      <span className="font-bold text-primary">₹{cashLeft.toFixed(2)}</span>
                    </div>
                  </CardContent>
                </Card>

                {cashLeft < 0 && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Warning</AlertTitle>
                    <AlertDescription>Cash balance is negative. Please verify your expenses.</AlertDescription>
                  </Alert>
                )}
              </div>

              <div className="space-y-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Daily Expenses</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Discount (₹):</label>
                        <Input
                          type="number"
                          name="discount"
                          value={dailyExpenses.discount}
                          onChange={handleDailyExpenses}
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">UPI Payment (₹):</label>
                        <Input
                          name="upiPayment"
                          type="number"
                          value={dailyExpenses.upiPayment}
                          onChange={handleDailyExpenses}
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">Canteen Cash (₹):</label>
                        <Input
                          name="canteenCash"
                          type="number"
                          value={dailyExpenses.canteenCash}
                          onChange={handleDailyExpenses}
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">Breakage Cash (₹):</label>
                        <Input
                          type="number"
                          name="breakageCash"
                          value={dailyExpenses.breakageCash}
                          onChange={handleDailyExpenses}
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">Rate Difference (₹):</label>
                        <Input
                          name="ratedifference"
                          type="number"
                          value={dailyExpenses.ratedifference}
                          onChange={handleDailyExpenses}
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">Transportation (₹):</label>
                        <Input
                          name="transportation"
                          type="number"
                          value={dailyExpenses.transportation}
                          onChange={handleDailyExpenses}
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">Rent (₹):</label>
                        <Input name="rent" type="number" value={dailyExpenses.rent} onChange={handleDailyExpenses} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            <DialogFooter className="flex justify-between items-center">
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Dialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
                <DialogTrigger asChild>
                  <Button>Confirm Submission</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Confirm Submission</DialogTitle>
                    <DialogDescription>
                      Are you sure you want to submit this daily report? This action cannot be undone.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="flex justify-end gap-2 pt-4">
                    <Button variant="outline" onClick={() => setIsConfirmDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleSubmit}>Submit</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

