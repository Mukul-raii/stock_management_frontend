import { getStocks, receiveNewStock } from "@/app/action/stock";
import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogClose,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
  
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { AlertCircle, CheckCircle2, PackagePlus, Truck } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner";
import { useAuth } from "@clerk/nextjs";
interface ShopProps {
  shopName: string;
  stockData: any;
  refresh: (value: boolean) => void;
}

export default function ReceiveStockData({ shopName, stockData ,refresh}: ShopProps) {
  const [newQuantities, setNewQuantities] = useState<{ [key: number]: number }>({});
  const hasNewStock = Object.keys(newQuantities).length > 0
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
      const {getToken} = useAuth()



  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      const token = await getToken()
      if(!token){
        return;
      }
      const res = await receiveNewStock(shopName, newQuantities, token)
      setIsSuccess(true)
    toast.success("Stock received successfully")
      refresh(true)
      setNewQuantities({})
    } catch (error) {
  toast.error("Error receiving stock")
    } finally {
      setIsSubmitting(false)
      setIsDialogOpen(false)
    }
  }
  return (
    <div className="space-y-6">
    <div className="flex items-center justify-between">

      {hasNewStock && (
        <Badge variant="outline" className="px-3 py-1">
          <PackagePlus className="h-3.5 w-3.5 mr-1" />
          New items: {Object.keys(newQuantities).length}
        </Badge>
      )}
    </div>

    {isSuccess && (
      <Alert variant="default" className="bg-green-50 border-green-200 text-green-800">
        <CheckCircle2 className="h-4 w-4 text-green-600" />
        <AlertTitle>Stock received successfully</AlertTitle>
        <AlertDescription>The inventory has been updated with the new stock quantities.</AlertDescription>
      </Alert>
    )}

    <Card className="border-muted/60">
      <CardHeader className="pb-3 bg-muted/20">
        <CardTitle className="text-lg flex items-center">
          <Truck className="h-5 w-5 mr-2 text-primary" />
          Receive New Stock
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
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
              {stockData.map((item: any) => {
                const hasNewQuantity = newQuantities[item.id] !== undefined && newQuantities[item.id] > 0

                return (
                  <TableRow key={item.id} className={`border-b ${hasNewQuantity ? "bg-primary/5" : ""}`}>
                    <TableCell className="py-3 font-medium">{item.product}</TableCell>
                    <TableCell className="py-3">{item.size}</TableCell>
                    <TableCell className="py-3">{item.quantity}</TableCell>
                    <TableCell className="py-3">₹{item.price}</TableCell>
                    <TableCell className="py-3 text-right">
                      <div className="flex items-center justify-end">
                        <Input
                          type="number"
                          min="0"
                          placeholder="0"
                          value={newQuantities[item.id] || ""}
                          onChange={(e) => {
                            const value = e.target.value === "" ? 0 : Number.parseInt(e.target.value, 10)
                            if (value >= 0) {
                              setNewQuantities((prev) => ({ ...prev, [item.id]: value }))
                            }
                          }}
                          className="w-24 text-right"
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>

        <div className="p-4 flex justify-end">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button disabled={!hasNewStock || isSubmitting} className="px-4">
                <PackagePlus className="mr-2 h-4 w-4" />
                Receive Stock
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Confirm Stock Receipt</DialogTitle>
                <DialogDescription>
                  You are about to update the inventory with new stock. This action cannot be undone.
                </DialogDescription>
              </DialogHeader>

              <div className="py-4">
                <Alert variant="default" className="bg-muted/50">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Verification Required</AlertTitle>
                  <AlertDescription>
                    Please verify that all quantities are correct before proceeding.
                  </AlertDescription>
                </Alert>
              </div>

              <DialogFooter className="flex justify-between sm:justify-between">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isSubmitting}>
                  Cancel
                </Button>
                <Button onClick={handleSubmit} disabled={isSubmitting}>
                  {isSubmitting ? "Processing..." : "Confirm Receipt"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  </div>
)
}
