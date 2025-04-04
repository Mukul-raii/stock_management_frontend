"use client"
import { useEffect, useState } from "react";
import { getDashboardData } from "./action/record";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts"
import { ArrowUpRight, ArrowDownRight, IndianRupee, Building2, Wallet, CreditCard } from "lucide-react"

// Define TypeScript interfaces for your data structure
interface LocationData {
  totalSale: number;
  totalCashReceived: number;
  totalUpiPayment: number;
  totalBreakageCash: number;
  totalTransportation: number;
  totalRent: number;
}

interface RecordData {
  Cash: number;
  CurrentBank: number;
  none: number;
}

interface BankTransactionData {
  credit: number;
  debit: number;
}

interface DashboardData {
  TotalCash: {
    [location: string]: LocationData;
  };
  Record: {
    [category: string]: RecordData;
  };
  BankTransactions: {
    [bank: string]: BankTransactionData;
  };
  MoneyCalculation: {
    TotalCash: number;
    TotalBank: number;
  };
}

          
interface LocationData {
  totalSale: number;
  totalCashReceived: number;
  totalUpiPayment: number;
  totalBreakageCash: number;
  totalTransportation: number;
  totalRent: number;
}


const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value || 0)
}

export default function Home() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [upiPayment ,setUpiPayment ]= useState<number>(0)


  useEffect(() => {
    async function fetchData() {
      try {
        const res = await getDashboardData()
        console.log(res);
        setDashboardData(res)

        if (res && res.TotalCash) {
          const totalUpi = Object.values(res.TotalCash).reduce(
            (sum:number, location) => sum + ((location as LocationData).totalUpiPayment || 0),
            0
          );
          setUpiPayment(totalUpi);
        }

      } catch (error) {
        console.error("Error fetching dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  // If data is still loading or not available, show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-8 flex items-center justify-center">
        <p>Loading dashboard data...</p>
      </div>
    )
  }

  if (!dashboardData) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-8 flex items-center justify-center">
        <p>No dashboard data available. Please try again later.</p>
      </div>
    )
  }

  const locationData = Object.entries(dashboardData?.TotalCash || {}).map(([location, data]) => ({
    name: location,
    totalSale: data.totalSale || 0,
    totalCashReceived: data.totalCashReceived || 0,
  }))

  const recordData = Object.entries(dashboardData?.Record || {})
    .map(([category, data]) => ({
      name: category,
      Cash: data.Cash || 0,
      CurrentBank: data.CurrentBank || 0,
      None: data.none || 0,
      total: (data.Cash || 0) + (data.CurrentBank || 0) + (data.none || 0),
    }))
    .filter((item) => item.total > 0)

  const bankTransactionData = Object.entries(dashboardData?.BankTransactions || {}).map(([bank, data]) => ({
    name: bank,
    credit: data.credit || 0,
    debit: data.debit || 0,
    balance: (data.credit || 0) - (data.debit || 0),
  }))

  // Calculate totals - with safety checks
  const totalSales = locationData.reduce((sum, location) => sum + (location.totalSale || 0), 0)
  const totalCashReceived = locationData.reduce((sum, location) => sum + (location.totalCashReceived || 0), 0)

  // Colors for charts
  const COLORS = ["#10b981", "#3b82f6", "#f97316", "#8b5cf6", "#ec4899"]

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Financial Dashboard</h1>
        <p className="text-gray-600 mb-8">Overview of your financial data and transactions</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="shadow-md border-t-4 border-t-emerald-500">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Total Sales</CardTitle>
              <IndianRupee className="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(totalSales)}</div>
              <p className="text-xs text-gray-500 mt-1">From all locations</p>
            </CardContent>
          </Card>
          
          <Card className="shadow-md border-t-4 border-t-blue-500">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Cash Received</CardTitle>
              <Wallet className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(dashboardData.MoneyCalculation.TotalCash)}</div>
              <p className="text-xs text-gray-500 mt-1">
                {totalSales > 0 ? ((totalCashReceived / totalSales) * 100).toFixed(1) : "0"}% of total sales
              </p>
            </CardContent>
          </Card>
          
          <Card className="shadow-md border-t-4 border-t-purple-500">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Bank Balance</CardTitle>
              <Building2 className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {dashboardData.MoneyCalculation.TotalBank}
              </div>
              <p className="text-xs text-gray-500 mt-1">Across all bank accounts</p>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="locations" className="mb-8">
          <TabsList className="mb-4">
            <TabsTrigger value="locations">Locations</TabsTrigger>
            <TabsTrigger value="records">Records</TabsTrigger>
            <TabsTrigger value="banks">Bank Accounts</TabsTrigger>
          </TabsList>
          
          <TabsContent value="locations" className="space-y-6">
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle>Sales by Location</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={locationData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip formatter={(value)=>formatCurrency(Number(value))}></Tooltip>
                      <Bar dataKey="totalSale" name="Total Sales" fill="#10b981" />
                      <Bar dataKey="totalCashReceived" name="Cash Received" fill="#3b82f6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries(dashboardData?.TotalCash || {}).map(([location, data]) =>(
                <Card key={location} className="shadow-md">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{location} Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Total Sales:</span>
                        <span className="font-medium">{formatCurrency(data.totalSale)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Cash Received:</span>
                        <span className="font-medium">{formatCurrency(data.totalCashReceived)}</span>
                      </div>
                      {(data.totalUpiPayment > 0) && (
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">UPI Payments:</span>
                          <span className="font-medium">{formatCurrency(data.totalUpiPayment)}</span>
                        </div>
                      )}
                      {(data.totalBreakageCash > 0) && (
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Breakage Cash:</span>
                          <span className="font-medium">{formatCurrency(data.totalBreakageCash)}</span>
                        </div>
                      )}
                      {(data.totalTransportation > 0) && (
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Transportation:</span>
                          <span className="font-medium">{formatCurrency(data.totalTransportation)}</span>
                        </div>
                      )}
                      {(data.totalRent > 0) && (
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Rent:</span>
                          <span className="font-medium">{formatCurrency(data.totalRent)}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="records">
            {recordData.length > 0 ? (
              <Card className="shadow-md">
                <CardHeader>
                  <CardTitle>Expense Records</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={recordData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="total"
                            nameKey="name"
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          >
                            {recordData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="space-y-4">
                      <h3 className="font-semibold text-lg">Record Details</h3>
                      <div className="space-y-3">
                        {recordData.map((record, index) => (
                          <div key={record.name} className="border-b pb-2">
                            <div className="flex justify-between items-center">
                              <span className="font-medium" style={{ color: COLORS[index % COLORS.length] }}>
                                {record.name}
                              </span>
                              <span className="font-bold">{formatCurrency(record.total)}</span>
                            </div>
                            <div className="text-sm text-gray-500 mt-1">
                              {record.Cash > 0 && <span className="mr-3">Cash: {formatCurrency(record.Cash)}</span>}
                              {record.CurrentBank > 0 && (
                                <span className="mr-3">Bank: {formatCurrency(record.CurrentBank)}</span>
                              )}
                              {record.None > 0 && <span>Other: {formatCurrency(record.None)}</span>}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="text-center py-8">No record data available</div>
            )}
          </TabsContent>
          
          <TabsContent value="banks">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {bankTransactionData.map((bank) => (
                <Card key={bank.name} className="shadow-md">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <CreditCard className="h-5 w-5" />
                      {bank.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Current Balance:</span>
                        <span className={`font-bold ${bank.balance >= 0 ? "text-emerald-600" : "text-rose-600"}`}>
                          {bank.name==="Current Bank" ? `${formatCurrency(dashboardData.MoneyCalculation.TotalBank)}` :`${formatCurrency(bank.credit)}` }

                          
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-emerald-50 p-3 rounded-lg">
                          <div className="flex items-center text-emerald-600 mb-1">
                            <ArrowUpRight className="h-4 w-4 mr-1" />
                            <span className="text-xs font-medium">Credits</span>
                          </div>
                          <div className="text-lg font-bold text-emerald-700">
                          {bank.name==="Current Bank" ? `${formatCurrency(bank.balance +upiPayment)}` :`${formatCurrency(bank.balance)}` }
                            </div>
                        </div>
                        <div className="bg-rose-50 p-3 rounded-lg">
                          <div className="flex items-center text-rose-600 mb-1">
                            <ArrowDownRight className="h-4 w-4 mr-1" />
                            <span className="text-xs font-medium">Debits</span>
                          </div>
                          <div className="text-lg font-bold text-rose-700">{formatCurrency(bank.debit)}</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}