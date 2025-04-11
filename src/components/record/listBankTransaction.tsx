'use client'
import { getAllBankTransaction } from '@/app/action/record'
import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Search, DollarSign, Calendar, Store, FileText, CreditCard, Landmark } from "lucide-react"





interface RecordType {
  id: number
  amount: number
  bank: string
  transaction: "credit" | "debit"
  paymentMethod: string | null
  message: string | null
}



export const ListBankTransaction = () => {
  const [searchTerm, setSearchTerm] = useState("")
const [loading ,setLoading]=useState(false)
const [data, setData] = useState<RecordType[]>([])
const [error, setError] = useState("")

   useEffect(() => {
      async function fetchData() {
        try {
          setLoading(true)
          const res = await getAllBankTransaction()
          setData(res)
        } catch (err) {
          setError("Failed to load records. Please try again later.")
          console.error(err)
        } finally {
          setLoading(false)
        }
      }
      fetchData()
    }, [])

    const filteredData = data.filter(
      (item) =>
        item.bank.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.transaction.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.message?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.paymentMethod?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  

    const formatCurrency = (amount: number) =>
      new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
      }).format(amount)

      return (
    <div className="space-y-4">
      <Card className="border-none shadow-md">
        <CardHeader className="pb-2">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle className="text-2xl font-bold">Records</CardTitle>
              <CardDescription>View and manage all your transaction records</CardDescription>
            </div>
            <div className="relative w-full md:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search records..."
                className="pl-8 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {error ? (
            <div className="flex justify-center items-center h-40 text-red-500">{error}</div>
          ) : loading ? (
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <Skeleton className="h-12 w-full" />
                </div>
              ))}
            </div>
          ) : filteredData.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 text-center">
              <FileText className="h-12 w-12 text-muted-foreground mb-2" />
              <p className="text-muted-foreground">No records found</p>
              {searchTerm && <p className="text-sm text-muted-foreground mt-1">Try adjusting your search term</p>}
            </div>
          ) : (
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow>
                    <TableHead>Bank</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Message</TableHead>
                    <TableHead>Payment Method</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.map((item) => (
                    <TableRow key={item.id} className="hover:bg-muted/50 transition-colors">
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Landmark className="h-4 w-4 text-muted-foreground" />
                          {item.bank}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={item.transaction === "credit" ? "default" : "outline"} className="capitalize">
                          {item.transaction}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {formatCurrency(item.amount)}
                        </div>
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate" title={item.message ?? "N/A"}>
                        {item.message || "N/A"}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <CreditCard className="h-4 w-4 text-muted-foreground" />
                          <Badge variant="outline">{item.paymentMethod || "N/A"}</Badge>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
          <div className="mt-4 text-sm text-muted-foreground">
            Showing {filteredData.length} of {data.length} records
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
