"use client"

import { useState } from "react"
import {format} from 'date-fns-tz'
import { BillType } from "@/app/billhistory/page"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Calendar, CreditCard, FileText, Search, TrendingUp, TrendingDown, Truck, Home, Beer, Wine, IndianRupee } from 'lucide-react'
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export default function BillhistoryData({ data }: { data: BillType[] }) {
  const [searchTerm, setSearchTerm] = useState("")

  // Calculate summary data
  const summaryData = data && data.length > 0 
    ? {
        totalSales: data.reduce((sum, item) => sum + item.totalSale, 0),
        totalCash: data.reduce((sum, item) => sum + item.totalCashReceived, 0),
        totalUpi: data.reduce((sum, item) => sum + item.upiPayment, 0),
        totalLiquor: data.reduce((sum, item) => sum + item.totalDesiSale, 0),
        totalBeer: data.reduce((sum, item) => sum + item.totalBeerSale, 0),
      }
    : null

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount)
  }

  // Format date for display
  const formatDate = (dateString: Date) => {
    return new Date(dateString).toLocaleDateString("en-US", { 
      year: "numeric", 
      month: "long", 
      day: "2-digit" 
    });
  }

  // Filter data based on search term
  const filteredData = data && data.length > 0
  ? data.filter(item => {
      const dateObj = new Date(item.pdfDate);
      return !isNaN(dateObj.getTime()) && 
        format(dateObj,"yyyy-MM-dd HH:mm:ss zzz",{ timeZone: 'Asia/Kolkata' }).includes(searchTerm)
    }): [];

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      {summaryData && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <Card className="bg-gradient-to-br from-blue-50 to-white border-none shadow-md">
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Sales</p>
                  <h3 className="text-2xl font-bold mt-1">{formatCurrency(summaryData.totalSales)}</h3>
                </div>
                <div className="bg-blue-100 p-2 rounded-full">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-green-50 to-white border-none shadow-md">
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Cash Received</p>
                  <h3 className="text-2xl font-bold mt-1">{formatCurrency(summaryData.totalCash)}</h3>
                </div>
                <div className="bg-green-100 p-2 rounded-full">
                  <IndianRupee className="h-5 w-5 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-purple-50 to-white border-none shadow-md">
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">UPI Payments</p>
                  <h3 className="text-2xl font-bold mt-1">{formatCurrency(summaryData.totalUpi)}</h3>
                </div>
                <div className="bg-purple-100 p-2 rounded-full">
                  <CreditCard className="h-5 w-5 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-amber-50 to-white border-none shadow-md">
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Liquor Sales</p>
                  <h3 className="text-2xl font-bold mt-1">{formatCurrency(summaryData.totalLiquor)}</h3>
                </div>
                <div className="bg-amber-100 p-2 rounded-full">
                  <Wine className="h-5 w-5 text-amber-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-yellow-50 to-white border-none shadow-md">
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Beer Sales</p>
                  <h3 className="text-2xl font-bold mt-1">{formatCurrency(summaryData.totalBeer)}</h3>
                </div>
                <div className="bg-yellow-100 p-2 rounded-full">
                  <Beer className="h-5 w-5 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Table */}
      <Card className="border-none shadow-md">
        <CardHeader className="pb-2">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle className="text-xl font-bold">Invoice History</CardTitle>
              <CardDescription>
                View and manage all your invoice records
              </CardDescription>
            </div>
            <div className="relative w-full md:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by date..."
                className="pl-8 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableCaption className="text-center text-muted-foreground py-4">
                  A comprehensive list of your recent invoices and financial records.
                </TableCaption>
        <TableHeader className="bg-muted/50">
                  <TableRow>
                    <TableHead className="font-medium whitespace-nowrap">Date</TableHead>
                    <TableHead className="font-medium whitespace-nowrap">Total Sale</TableHead>
                    <TableHead className="font-medium whitespace-nowrap">Cash Received</TableHead>
                    <TableHead className="font-medium whitespace-nowrap">UPI Payment</TableHead>
                    <TableHead className="font-medium whitespace-nowrap">Discount</TableHead>
                    <TableHead className="font-medium whitespace-nowrap">Liquor Sale</TableHead>
                    <TableHead className="font-medium whitespace-nowrap">Beer Sale</TableHead>
                    <TableHead className="font-medium whitespace-nowrap">Breakage Expense</TableHead>
                    <TableHead className="font-medium whitespace-nowrap">Canteen Income</TableHead>
                    <TableHead className="font-medium whitespace-nowrap">Rate Difference</TableHead>
                    <TableHead className="font-medium whitespace-nowrap">Rent</TableHead>
                    <TableHead className="font-medium whitespace-nowrap">Transportation</TableHead>
          <TableHead className="font-medium whitespace-nowrap">Invoice PDF</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.length > 0 ? (
                    filteredData.map((invoice) => (
                      <TableRow key={invoice.id} className="hover:bg-muted/50 transition-colors">
                        <TableCell className="font-medium whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            {invoice.date ? formatDate((invoice.pdfDate)) : "Invalid Date"}
                          </div>
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          <Badge variant="outline" className="bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200">
                            {formatCurrency(invoice.totalSale)}
                          </Badge>
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            {formatCurrency(invoice.totalCashReceived)}
                          </div>
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <CreditCard className="h-4 w-4 text-purple-500" />
                            {formatCurrency(invoice.upiPayment)}
                          </div>
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          {invoice?.discount ? (
                            <div className="flex items-center gap-2">
                              <TrendingDown className="h-4 w-4 text-red-500" />
                              {formatCurrency(invoice.discount)}
                            </div>
                          ) : (
                            <span className="text-muted-foreground">₹ 0</span>
                          )}
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <Wine className="h-4 w-4 text-amber-500" />
                            {formatCurrency(invoice.totalDesiSale)}
                          </div>
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <Beer className="h-4 w-4 text-yellow-500" />
                            {formatCurrency(invoice.totalBeerSale)}
                          </div>
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          {invoice.breakageCash ? (
                            <span className="text-red-600">{formatCurrency(invoice.breakageCash)}</span>
                          ) : (
                            <span className="text-muted-foreground">₹ 0</span>
                          )}
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          {invoice.canteenCash ? (
                            <span className="text-green-600">{formatCurrency(invoice.canteenCash)}</span>
                          ) : (
                            <span className="text-muted-foreground">₹ 0</span>
                          )}
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          <span className={invoice.rateDiff > 0 ? "text-green-600" : "text-red-600"}>
                            {formatCurrency(invoice.rateDiff)}
                          </span>
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <Home className="h-4 w-4 text-muted-foreground" />
                            {formatCurrency(invoice.rent)}
                          </div>
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <Truck className="h-4 w-4 text-muted-foreground" />
                            {formatCurrency(invoice.transportation)}
                          </div>
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          <a
                            href={`${process.env.NEXT_PUBLIC_BACKEND_API}/billhistory/pdf/${invoice.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="View invoice PDF"
                          >
                            <Button variant="outline" size="sm" className="gap-2">
                              <FileText className="h-4 w-4" />
                              View PDF
                            </Button>
                          </a>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={13} className="h-60 text-center">
                        <div className="flex flex-col items-center justify-center py-8">
                          <div className="rounded-full bg-muted p-3 mb-3">
                            <FileText className="h-10 w-10 text-muted-foreground" />
                          </div>
                          <h3 className="text-lg font-medium">No invoice data available</h3>
                          <p className="text-sm text-muted-foreground mt-1 max-w-md">
                            {searchTerm 
                              ? "No results match your search criteria. Try adjusting your search terms."
                              : "Please select a different shop or check back later when more data is available."}
                          </p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
          {filteredData.length > 0 && (
            <div className="mt-4 text-sm text-muted-foreground">
              Showing {filteredData.length} of {data?.length || 0} invoices
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
