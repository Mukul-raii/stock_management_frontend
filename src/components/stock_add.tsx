"use client"
import { getStocks } from "@/app/action/stock";
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
import { CalendarIcon } from "lucide-react";
import { useId } from "react";

  
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

export default function StockAdd({ shopName }: StockAddProps) {
  const id = useId();
  const [date, setDate] = useState<Date | undefined>();
  const [stockData ,setStockData ]= useState([
    {
      id: 0,
      product: "",
      size: 0,
      quantity:0,
      price:0,
      shop:"",
      lastQuantity:0
    }
  ])
  const [newQuantities, setNewQuantities] = useState<{[key:number]: number}>({});


  useEffect(() => {
    async function  fetchdata  ()  {
    const result = await getStocks(shopName)  
    const updatedstock =result.map((item:ItemType)=>({
      ...item,
      lastQuantity:item.quantity
    }))
      setStockData(updatedstock)
      
    }
    fetchdata()
  },[shopName])

    return (
        <div>
          <div>
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
            <Calendar mode="single" selected={date} onSelect={setDate} />
          </PopoverContent>
        </Popover>
      </div>
            <Table>
          <TableHeader className="bg-red-100">
            <TableRow className="hover:bg-transparent">
              <TableHead>Product</TableHead>
              <TableHead>Size</TableHead>
              <TableHead>Opening Stock</TableHead>
              <TableHead>Closing Stock</TableHead>
              <TableHead>Sold</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Total sale</TableHead>
            </TableRow>
          </TableHeader>
          <tbody aria-hidden="true" className="table-row h-2"></tbody>
          <TableBody className="[&_td:first-child]:rounded-l-lg [&_td:last-child]:rounded-r-lg">
            { stockData.map((item) => {
              
              const newQuantity =newQuantities[item.id] !== undefined ? newQuantities[item.id] : item.lastQuantity
              const soldQuantity = item.quantity - newQuantity
              console.log(newQuantities);
              const totalSale = soldQuantity * item.price
                return(

              <TableRow
                key={item.id}
                className="border-none odd:bg-muted/50 hover:bg-transparent odd:hover:bg-muted/50"
              >
                <TableCell className="py-2.5 font-medium">{item.product}</TableCell>
                <TableCell className="py-2.5">{item.size}</TableCell>
                <TableCell className="py-2.5">{item.quantity}</TableCell>
                <TableCell className="py-2.5"><input type="number "
                value={newQuantities[item.id] || ""}
                onChange={(e) => {
                const value = e.target.value === "" ? item.lastQuantity : parseInt(e.target.value, 10);
                setNewQuantities((prev: { [key: number]: number }) => ({ ...prev, [item.id]: value

                  }));
                }}/> </TableCell>
                <TableCell className="py-2.5">{soldQuantity} </TableCell>
                <TableCell className="py-2.5">{item.price}</TableCell>
                <TableCell className="py-2.5 text-right">{totalSale}</TableCell>
              </TableRow>
              )
})}
          </TableBody>
          <tbody aria-hidden="true" className="table-row h-2"></tbody>
        </Table>
        <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Submit</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share link</DialogTitle>
          <DialogDescription>
            Anyone who has this link will be able to view this.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2">
          <div className="grid flex-1 gap-2">
            <Label htmlFor="link" className="sr-only">
              Link
            </Label>
            <Input
              id="link"
              defaultValue="https://ui.shadcn.com/docs/installation"
              readOnly
            />
          </div>
          <Button type="submit" size="sm" className="px-3">
            <span className="sr-only">Copy</span>
            <Copy />
          </Button>
        </div>
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
            </div>
    )
}




