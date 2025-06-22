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
import { format, startOfYesterday } from "date-fns";
import { CalendarIcon } from "lucide-react";
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
import { Plus } from "lucide-react";
import { toast } from "sonner";
import AddNewRecord from "@/components/record/AddNewRecord";

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

export interface RecordType {
  id?: number;
  recordType: string;
  shop: string;
  message: string;
  amount: number;
  date: Date;
  paymentMethod: string;
}

export default function StockAdd({ shopName }: StockAddProps) {
  const id = useId();
  const [date, setDate] = useState<Date>(new Date(startOfYesterday()));
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
  const [isAddRecordDialogOpen, setIsAddRecordDialogOpen] = useState(false);
  const [addedRecords, setAddedRecords] = useState<RecordType[]>([]);

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
    // Calculate cash from added records (only cash payments)
    const cashRecordsDeduction = addedRecords
      .filter(record => record.paymentMethod === "Cash")
      .reduce((total, record) => total + record.amount, 0);
    
    setCashLeft(
      dailyExpenses.totalCash - dailyExpenses.breakageCash - dailyExpenses.discount +
      dailyExpenses.canteenCash + dailyExpenses.ratedifference - 
      dailyExpenses.transportation - dailyExpenses.upiPayment - dailyExpenses.rent - cashRecordsDeduction
    );
  }, [dailyExpenses, addedRecords]);

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

  
  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (!selectedDate) return;
    
    // Get current time components
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    
    // Create new date with selected date but current time
    const dateWithCurrentTime = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      selectedDate.getDate(),
      hours,
      minutes,
      seconds
    );
    
    setDate(dateWithCurrentTime);
  };

  

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
    const res = await addNewBillHistory(dailyExpenses,cashLeft,date,stockData,shopName,addedRecords)
      if(res===200){
        toast.success("Bill history added successfully")
      setIsConfirmDialogOpen(false)
      setIsMainDialogOpen(false)
      // Reset added records after successful submission
      setAddedRecords([])
    }else{
      toast.error("Error in bill history")
    }
  }

  const handleRecordAdded = (newRecord: RecordType) => {
    // Add the new record to the state
    setAddedRecords(prev => [...prev, newRecord]);
    
    // Close the add record dialog
    setIsAddRecordDialogOpen(false);
    
    // Show success message
    toast.success("Record added successfully! It will be reflected in your next report.");
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
              <Calendar required mode="single" selected={date} onSelect={handleDateSelect} />
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

                {/* Added Records Summary */}
                {addedRecords.length > 0 && (
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Added Records</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {addedRecords.map((record, index) => (
                        <div key={index} className="flex justify-between items-center py-1 border-b last:border-b-0">
                          <div className="flex-1">
                            <div className="font-medium text-sm">{record.recordType}</div>
                            <div className="text-xs text-muted-foreground">{record.message}</div>
                            <div className="text-xs text-muted-foreground">
                              {record.paymentMethod} • {format(record.date, "MMM dd")}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium text-red-600">-₹{record.amount}</div>
                          </div>
                        </div>
                      ))}
                      <div className="flex justify-between pt-2 border-t font-medium">
                        <span>Total Records Impact:</span>
                        <span className="text-red-600">
                          -₹{addedRecords.reduce((total, record) => total + record.amount, 0).toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>Cash Records Impact:</span>
                        <span className="text-red-600">
                          -₹{addedRecords
                            .filter(record => record.paymentMethod === "Cash")
                            .reduce((total, record) => total + record.amount, 0).toFixed(2)}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                )}

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
                  <CardHeader className="pb-2 flex flex-row items-center justify-between">
                    <CardTitle className="text-lg">Daily Expenses</CardTitle>
                    <Dialog open={isAddRecordDialogOpen} onOpenChange={setIsAddRecordDialogOpen}>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="ml-auto">
                          <Plus className="h-4 w-4 mr-2" />
                          Add Record
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Add Record</DialogTitle>
                          <DialogDescription>
                            Add a new financial record that will be reflected in your sales summary.
                          </DialogDescription>
                        </DialogHeader>
                        <AddNewRecord onRecordAdded={handleRecordAdded} />
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setIsAddRecordDialogOpen(false)}>
                            Close
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
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

