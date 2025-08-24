"use client";
import { useEffect, useState, useMemo, useCallback } from "react";
import { getDashboardData } from "./action/record";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import dynamic from "next/dynamic";

// Dynamically import ApexCharts with no SSR and loading component
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-80">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
    </div>
  ),
});
import {
  ArrowUpRight,
  ArrowDownRight,
  IndianRupee,
  Building2,
  Wallet,
  CreditCard,
} from "lucide-react";
import lastYearBills from "../../public/test.billhistories.json";
import { fetchBillBookData } from "./action/billhistory";
import { BillType } from "./billhistory/page";
import { useAuth } from "@clerk/nextjs";

// Define interfaces for historical bill data structure from JSON
interface HistoricalBillData {
  _id: { $oid: string };
  pdfDate: { $date: string };
  totalSale: number;
  upiPayment: number;
  discount: number;
  breakageCash: number;
  canteenCash: number;
  totalDesiSale: number;
  totalBeerSale: number;
  salary: number;
  shop: string;
  rateDiff?: number;
  rent: number;
  totalPaymentReceived: number;
  date: { $date: string };
  __v: number;
  transportation?: number;
  updatedStocks: unknown[];
}

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
  companyRecords: object;
  stockTotalCost: object;
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
  }).format(value || 0);
};

export default function Home() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null
  );
  const [latestData, setLatestData] = useState<{
    AmariyaData: BillType[];
    VamanpuriData: BillType[];
  }>({
    AmariyaData: [],
    VamanpuriData: [],
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [upiPayment, setUpiPayment] = useState<number>(0);
  const [expandedRecords, setExpandedRecords] = useState<
    Record<string, boolean>
  >({});
  const [tab, setTab] = useState("Vamanpuri");
      const {getToken} = useAuth()

  // Memoize computed data
  const locationData = useMemo(
    () =>
      Object.entries(dashboardData?.TotalCash || {}).map(
        ([location, data]) => ({
          name: location,
          totalSale: data.totalSale || 0,
          totalCashReceived: data.totalCashReceived || 0,
        })
      ),
    [dashboardData?.TotalCash]
  );

  const stockData = useMemo(
    () =>
      Object.entries(dashboardData?.stockTotalCost || {}).map(
        ([location, data]) => ({
          shop: location,
          shopName: data.shop,
          totalPrice: data.TotalPrice || 0,
        })
      ),
    [dashboardData?.stockTotalCost]
  );

  const groupedByShop = useMemo(() => {
    const grouped: { [shopName: string]: number } = {};
    stockData.forEach((item) => {
      if (grouped[item.shopName]) {
        grouped[item.shopName] += item.totalPrice;
      } else {
        grouped[item.shopName] = item.totalPrice;
      }
    });
    return grouped;
  }, [stockData]);

  const recordData = useMemo(
    () =>
      Object.entries(dashboardData?.Record || {})
        .map(([category, data]) => ({
          name: category,
          Cash: data.Cash || 0,
          CurrentBank: data.CurrentBank || 0,
          None: data.none || 0,
          total: (data.Cash || 0) + (data.CurrentBank || 0) + (data.none || 0),
        }))
        .filter((item) => item.total > 0),
    [dashboardData?.Record]
  );

  const bankTransactionData = useMemo(
    () =>
      Object.entries(dashboardData?.BankTransactions || {}).map(
        ([bank, data]) => ({
          name: bank,
          credit: data.credit || 0,
          debit: data.debit || 0,
          balance: (data.credit || 0) - (data.debit || 0),
        })
      ),
    [dashboardData?.BankTransactions]
  );

  const companyRecordsData = useMemo(
    () =>
      Object.entries(dashboardData?.companyRecords || {}).map(
        ([companyName, companyData]) => ({
          companyName,
          ...(companyData as {
            records: { recordName: string; amount: number }[];
            totalAmount: number;
          }),
        })
      ),
    [dashboardData?.companyRecords]
  );

  // Calculate totals - with safety checks
  const totalSales = useMemo(
    () =>
      locationData.reduce(
        (sum, location) => sum + (location.totalSale || 0),
        0
      ),
    [locationData]
  );

  const totalCashReceived = useMemo(
    () =>
      locationData.reduce(
        (sum, location) => sum + (location.totalCashReceived || 0),
        0
      ),
    [locationData]
  );

  // Colors for charts
  const COLORS = useMemo(
    () => ["#10b981", "#3b82f6", "#f97316", "#8b5cf6", "#ec4899"],
    []
  );

  // Memoize chart options and data to prevent unnecessary re-renders
  const barChartOptions = useMemo(
    () => ({
      chart: {
        type: "bar" as const,
        height: 320,
        toolbar: {
          show: false,
        },
        animations: {
          enabled: true,
          easing: "easeinout",
          speed: 300,
        },
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "55%",
          borderRadius: 4,
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        show: true,
        width: 2,
        colors: ["transparent"],
      },
      xaxis: {
        categories: locationData.map((item) => item.name),
      },
      yaxis: {
        title: {
          text: "Amount (₹)",
        },
        labels: {
          formatter: (value: number) => formatCurrency(value),
        },
      },
      fill: {
        opacity: 1,
      },
      tooltip: {
        y: {
          formatter: (val: number) => formatCurrency(val),
        },
      },
      colors: ["#10b981", "#3b82f6"],
    }),
    [locationData]
  );

  const barChartSeries = useMemo(
    () => [
      {
        name: "Total Sales",
        data: locationData.map((item) => item.totalSale),
      },
      {
        name: "Cash Received",
        data: locationData.map((item) => item.totalCashReceived),
      },
    ],
    [locationData]
  );

  // Memoize pie chart options
  const pieChartOptions = useMemo(
    () => ({
      chart: {
        type: "pie" as const,
        height: 320,
        animations: {
          enabled: true,
          easing: "easeinout",
          speed: 300,
        },
      },
      labels: recordData.map((item) => item.name),
      colors: COLORS,
      legend: {
        position: "bottom" as const,
      },
      tooltip: {
        y: {
          formatter: (val: number) => formatCurrency(val),
        },
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200,
            },
            legend: {
              position: "bottom" as const,
            },
          },
        },
      ],
    }),
    [recordData, COLORS]
  );

  const pieChartSeries = useMemo(
    () => recordData.map((item) => item.total),
    [recordData]
  );

  // Memoize chart data function
  const chartData = useCallback(
    (shopName: string) => {
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth();
      const currentDay = currentDate.getDate();

      // Create daily sales maps for both years
      const dailySalesMap2024: { [key: string]: { beer: number; desi: number } } = {};
      const dailySalesMap2025: { [key: string]: { beer: number; desi: number } } = {};

      // Filter and aggregate data for 2024 from lastYearBills (Financial Year 2024-25: Apr 2024 to Mar 2025)
      const data2024 = Array.isArray(lastYearBills)
        ? (lastYearBills as HistoricalBillData[]).filter((bill) => {
            if (!bill?.pdfDate?.$date || !bill?.shop) return false;
            try {
              const billDate = new Date(bill.pdfDate.$date);
              const billYear = billDate.getFullYear();
              const billMonth = billDate.getMonth();

              // Financial Year 2024-25: April 2024 to March 2025
              const isInFY2024 =
                (billYear === 2024 && billMonth >= 3) ||
                (billYear === 2025 && billMonth < 3);

              return (
                bill.shop.toLowerCase() === shopName.toLowerCase() &&
                isInFY2024 &&
                !isNaN(billDate.getTime())
              );
            } catch {
              return false;
            }
          })
        : [];

      // Filter and aggregate data for 2025 from current latestData (Financial Year 2025-26: Apr 2025 onwards)
      const allCurrentData = [
        ...(latestData?.AmariyaData || []),
        ...(latestData?.VamanpuriData || []),
      ];
      const data2025 = allCurrentData.filter((bill) => {
        if (!bill?.pdfDate || !bill?.shop) return false;
        try {
          const billDate = new Date(bill.pdfDate);
          const billYear = billDate.getFullYear();
          const billMonth = billDate.getMonth();

          // Financial Year 2025-26: April 2025 onwards (exclude Jan-Mar 2025)
          const isInFY2025 = billYear === 2025 && billMonth >= 3;

          return (
            bill.shop.toLowerCase() === shopName.toLowerCase() &&
            isInFY2025 &&
            !isNaN(billDate.getTime())
          );
        } catch {
          return false;
        }
      });

      // Aggregate totalBeerSale and totalDesiSale per day for 2024
      data2024.forEach((bill) => {
        if (bill.pdfDate?.$date) {
          try {
            const billDate = new Date(bill.pdfDate.$date);
            const month = billDate.getMonth();
            const day = billDate.getDate();
            const financialMonth = month >= 3 ? month - 2 : month + 10;
            const dateKey = `${financialMonth}/${day}`;
            dailySalesMap2024[dateKey] = dailySalesMap2024[dateKey] || { beer: 0, desi: 0 };
            dailySalesMap2024[dateKey].beer += bill.totalBeerSale || 0;
            dailySalesMap2024[dateKey].desi += bill.totalDesiSale || 0;
          } catch {
            // Skip invalid dates
          }
        }
      });

      // Aggregate totalBeerSale and totalDesiSale per day for 2025
      data2025.forEach((bill) => {
        if (bill.pdfDate) {
          try {
            const billDate = new Date(bill.pdfDate);
            const month = billDate.getMonth();
            const day = billDate.getDate();
            const financialMonth = month >= 3 ? month - 2 : month + 10;
            const dateKey = `${financialMonth}/${day}`;
            dailySalesMap2025[dateKey] = dailySalesMap2025[dateKey] || { beer: 0, desi: 0 };
            dailySalesMap2025[dateKey].beer += bill.totalBeerSale || 0;
            dailySalesMap2025[dateKey].desi += bill.totalDesiSale || 0;
          } catch {
            // Skip invalid dates
          }
        }
      });

      // Generate all days for the financial year (April to March)
      const allDays: {
        date: string;
        dayOfYear: number;
        month: string;
        day: number;
        displayDate: string;
        isFuture: boolean;
        "2024": { beer: number; desi: number };
        "2025": { beer: number; desi: number };
        needsUpdate?: boolean;
      }[] = [];

      const financialYearMonths = [3, 4, 5, 6, 7, 8, 9, 10, 11, 0, 1, 2]; // April to March
      const monthNames = [
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
        "Jan",
        "Feb",
        "Mar",
      ];

      financialYearMonths.forEach((month, financialMonthIndex) => {
        const financialMonth = financialMonthIndex + 1;
        const year = month >= 3 ? 2025 : 2026;
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        for (let day = 1; day <= daysInMonth; day++) {
          const dateKey = `${financialMonth}/${day}`;
          const monthName = monthNames[financialMonthIndex];
          const dayOfYear = financialMonthIndex * 31 + day;

          const currentFYMonth =
            currentMonth >= 3 ? currentMonth - 2 : currentMonth + 10;

          const isFutureDate =
            financialMonth > currentFYMonth ||
            (financialMonth === currentFYMonth && day > currentDay);

          const value2025 = isFutureDate
            ? { beer: 0, desi: 0 }
            : dailySalesMap2025[dateKey] || { beer: 0, desi: 0 };

          allDays.push({
            date: dateKey,
            dayOfYear,
            month: monthName,
            day,
            displayDate: `${monthName} ${day}`,
            isFuture: isFutureDate,
            "2024": dailySalesMap2024[dateKey] || { beer: 0, desi: 0 },
            "2025": value2025,
            needsUpdate: isFutureDate,
          });
        }
      });

      // Return all days to show complete financial year progression
      return allDays;
    },
    [latestData]
  );

  // Memoize area chart options
  const areaChartOptions = useCallback(
    (shopName: string) => {
      const data = chartData(shopName);
      return {
        chart: {
          type: "area" as const,
          height: 400,
          zoom: {
            enabled: true,
          },
          toolbar: {
            show: true,
          },
          animations: {
            enabled: true,
            easing: "easeinout",
            speed: 300,
          },
        },
        dataLabels: {
          enabled: false,
        },
        stroke: {
          curve: "smooth" as const,
          width: 2,
        },
        fill: {
          type: "gradient",
          gradient: {
            shadeIntensity: 1,
            opacityFrom: 0.7,
            opacityTo: 0.3,
            stops: [0, 90, 100],
          },
        },
        xaxis: {
          categories: data.map((item) => item.displayDate),
          labels: {
            show: true,
            maxHeight: 50,
            style: {
              fontSize: "10px",
            },
            formatter: (
              value: string,
              timestamp?: number,
              opts?: { dataPointIndex?: number }
            ) => {
              const dataIndex = opts?.dataPointIndex;
              if (dataIndex !== undefined) {
                const dataPoint = data[dataIndex];
                if (dataPoint?.day === 1 || dataIndex === data.length - 1) {
                  return value;
                }
              }
              return "";
            },
          },
        },
        yaxis: {
          title: {
            text: "Sales (₹)",
          },
          labels: {
            formatter: (value: number) =>
              `₹${value?.toLocaleString("en-IN") || 0}`,
          },
        },
        tooltip: {
          custom: ({
            series,
            seriesIndex,
            dataPointIndex,
            w,
          }: {
            series: number[][];
            seriesIndex: number;
            dataPointIndex: number;
            w: { globals: { seriesNames: string[]; colors: string[] } };
          }) => {
            const data = chartData(shopName);
            const dataPoint = data[dataPointIndex];
            if (!dataPoint) return "";

            const value = series[seriesIndex][dataPointIndex];
            const year = w.globals.seriesNames[seriesIndex];

            return `
            <div class="bg-white p-3 border rounded shadow-lg">
              <p class="font-medium">${dataPoint.displayDate}</p>
              <p style="color: ${w.globals.colors[seriesIndex]}">${year}: ₹${(value || 0).toLocaleString("en-IN")}</p>
            </div>
          `;
          },
        },
        colors: ["#22c55e", "#ef4444", "#3b82f6", "#f97316"], // Colors for Beer and Desi sales
        legend: {
          show: true,
          position: "top" as const,
        },
      };
    },
    [chartData]
  );

  const areaChartSeries = useCallback(
    (shopName: string) => {
      const data = chartData(shopName);
      return [
        {
          name: "2025 Beer",
          data: data.map((item) => item["2025"].beer),
        },
        {
          name: "2025 Desi",
          data: data.map((item) => item["2025"].desi),
        },
        {
          name: "2024 Beer",
          data: data.map((item) => item["2024"].beer),
        },
        {
          name: "2024 Desi",
          data: data.map((item) => item["2024"].desi),
        },
      ];
    },
    [chartData]
  );

  const toggleRecordExpand = useCallback((recordName: string) => {
    setExpandedRecords((prev) => ({
      ...prev,
      [recordName]: !prev[recordName],
    }));
  }, []);

  // Fixing performanceComparison logic to ensure correct stats calculation
  const performanceComparison = useMemo(() => {
    const calculateShopPerformance = (shopName: string) => {
      const data = chartData(shopName);

      // Find June 1st in the data (financial month 3, day 1)
      const june1Index = data.findIndex(
        (item) => item.month === "Jun" && item.day === 1
      );

      if (june1Index === -1) return null;

      // Get data from June 1st onwards
      const dataFromJune1 = data.slice(june1Index);

      // Find the last non-zero/non-undefined value for 2025 (beer sales)
      let lastValidIndex = -1;
      for (let i = dataFromJune1.length - 1; i >= 0; i--) {
        if (dataFromJune1[i]["2025"].beer > 0 || dataFromJune1[i]["2025"].desi > 0) {
          lastValidIndex = i;
          break;
        }
      }

      if (lastValidIndex === -1) return null;

      // Calculate totals from June 1st to the last valid 2025 data point
      const relevantData = dataFromJune1.slice(0, lastValidIndex + 1);

      const total2024Beer = relevantData.reduce(
        (sum, item) => sum + item["2024"].beer,
        0
      );
      const total2025Beer = relevantData.reduce(
        (sum, item) => sum + item["2025"].beer,
        0
      );

      const total2024Desi = relevantData.reduce(
        (sum, item) => sum + item["2024"].desi,
        0
      );
      const total2025Desi = relevantData.reduce(
        (sum, item) => sum + item["2025"].desi,
        0
      );

      const differenceBeer = total2025Beer - total2024Beer;
      const percentageChangeBeer =
        total2024Beer > 0 ? (differenceBeer / total2024Beer) * 100 : 0;

      const differenceDesi = total2025Desi - total2024Desi;
      const percentageChangeDesi =
        total2024Desi > 0 ? (differenceDesi / total2024Desi) * 100 : 0;

      return {
        total2024Beer,
        total2025Beer,
        differenceBeer,
        percentageChangeBeer,
        total2024Desi,
        total2025Desi,
        differenceDesi,
        percentageChangeDesi,
        isAhead: differenceBeer > 0 || differenceDesi > 0,
        periodEnd: relevantData[relevantData.length - 1]?.displayDate || "",
        daysAnalyzed: relevantData.length,
      };
    };

    return {
      Vamanpuri: calculateShopPerformance("Vamanpuri"),
      Amariya: calculateShopPerformance("Amariya"),
    };
  }, [chartData]);

  useEffect(() => {
    async function fetchData() {
      try {
        const token = await getToken();
        if(!token){
          console.error("Failed to retrieve token");
          setLoading(false);
          return;
        }
        const res = await getDashboardData(token);
        const AmariyaData = await fetchBillBookData("Amariya", token);
        const VamanpuriData = await fetchBillBookData("Vamanpuri", token);
        setLatestData({ AmariyaData, VamanpuriData });
        setDashboardData(res);

        if (res && res.TotalCash) {
          const totalUpi = Object.values(res.TotalCash).reduce(
            (sum: number, location) =>
              sum + ((location as LocationData).totalUpiPayment || 0),
            0
          );
          setUpiPayment(totalUpi);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // If data is still loading or not available, show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-8 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        <p className="ml-4">Loading dashboard data...</p>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-8 flex items-center justify-center">
        <p>No dashboard data available. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-18">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Financial Dashboard
        </h1>
        <p className="text-gray-600 mb-8">
          Overview of your financial data and transactions
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="shadow-md border-t-4 border-t-emerald-500">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                Total Sales
              </CardTitle>
              <IndianRupee className="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(totalSales)}
              </div>
              <p className="text-xs text-gray-500 mt-1">From all locations</p>
            </CardContent>
          </Card>

          <Card className="shadow-md border-t-4 border-t-blue-500">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                Cash Received
              </CardTitle>
              <Wallet className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(dashboardData.MoneyCalculation.TotalCash)}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {totalSales > 0
                  ? ((totalCashReceived / totalSales) * 100).toFixed(1)
                  : "0"}
                % of total sales
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-md border-t-4 border-t-purple-500">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                Bank Balance
              </CardTitle>
              <Building2 className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(dashboardData.MoneyCalculation.TotalBank)}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Across all bank accounts
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="locations" className="mb-8">
          <TabsList className="mb-4">
            <TabsTrigger value="locations">Locations</TabsTrigger>
            <TabsTrigger value="records">Records</TabsTrigger>
            <TabsTrigger value="banks">Bank Accounts</TabsTrigger>
            <TabsTrigger value="stats">Stats</TabsTrigger>
          </TabsList>

          <TabsContent value="locations" className="space-y-6">
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle>Sales by Location</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ReactApexChart
                    options={barChartOptions}
                    series={barChartSeries}
                    type="bar"
                    height={320}
                  />
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries(groupedByShop).map(([shopName]) => (
                <div key={shopName}>
                  <h2 className="text-xl font-bold mb-4">{shopName}</h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {Object.entries(dashboardData?.TotalCash || {})
                      .filter(([location]) => location === shopName)
                      .map(([location, data]) => (
                        <Card key={location} className="shadow-md">
                          <CardHeader className="pb-2">
                            <CardTitle className="text-lg">
                              {location} Details
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-2">
                              <div className="flex justify-between items-center">
                                <span className="text-gray-600">
                                  Total Stock:
                                </span>
                                <span className="font-medium">
                                  {formatCurrency(groupedByShop[location])}
                                </span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-gray-600">
                                  Total Sales:
                                </span>
                                <span className="font-medium">
                                  {formatCurrency(data.totalSale)}
                                </span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-gray-600">
                                  Cash Received:
                                </span>
                                <span className="font-medium">
                                  {formatCurrency(data.totalCashReceived)}
                                </span>
                              </div>
                              {data.totalUpiPayment > 0 && (
                                <div className="flex justify-between items-center">
                                  <span className="text-gray-600">
                                    UPI Payments:
                                  </span>
                                  <span className="font-medium">
                                    {formatCurrency(data.totalUpiPayment)}
                                  </span>
                                </div>
                              )}
                              {data.totalBreakageCash > 0 && (
                                <div className="flex justify-between items-center">
                                  <span className="text-gray-600">
                                    Breakage Cash:
                                  </span>
                                  <span className="font-medium">
                                    {formatCurrency(data.totalBreakageCash)}
                                  </span>
                                </div>
                              )}
                              {data.totalTransportation > 0 && (
                                <div className="flex justify-between items-center">
                                  <span className="text-gray-600">
                                    Transportation:
                                  </span>
                                  <span className="font-medium">
                                    {formatCurrency(data.totalTransportation)}
                                  </span>
                                </div>
                              )}
                              {data.totalRent > 0 && (
                                <div className="flex justify-between items-center">
                                  <span className="text-gray-600">Rent:</span>
                                  <span className="font-medium">
                                    {formatCurrency(data.totalRent)}
                                  </span>
                                </div>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                  </div>
                </div>
              ))}

              {/* {Object.entries(dashboardData?.TotalCash || {}).map(
                  ([location, data]) => (
                    <Card key={location} className="shadow-md">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">
                          {location} Details
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600">Total Stock:</span>
                            <span className="font-medium">
                            {formatCurrency(groupedByShop[location].)}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Total Sales:</span>
                            <span className="font-medium">
                              {formatCurrency(data.totalSale)}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Cash Received:</span>
                            <span className="font-medium">
                              {formatCurrency(data.totalCashReceived)}
                            </span>
                          </div>
                          {data.totalUpiPayment > 0 && (
                            <div className="flex justify-between items-center">
                              <span className="text-gray-600">UPI Payments:</span>
                              <span className="font-medium">
                                {formatCurrency(data.totalUpiPayment)}
                              </span>
                            </div>
                          )}
                          {data.totalBreakageCash > 0 && (
                            <div className="flex justify-between items-center">
                              <span className="text-gray-600">
                                Breakage Cash:
                              </span>
                              <span className="font-medium">
                                {formatCurrency(data.totalBreakageCash)}
                              </span>
                            </div>
                          )}
                          {data.totalTransportation > 0 && (
                            <div className="flex justify-between items-center">
                              <span className="text-gray-600">
                                Transportation:
                              </span>
                              <span className="font-medium">
                                {formatCurrency(data.totalTransportation)}
                              </span>
                            </div>
                          )}
                          {data.totalRent > 0 && (
                            <div className="flex justify-between items-center">
                              <span className="text-gray-600">Rent:</span>
                              <span className="font-medium">
                                {formatCurrency(data.totalRent)}
                              </span>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )
                } */}
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
                      <ReactApexChart
                        options={pieChartOptions}
                        series={pieChartSeries}
                        type="pie"
                        height={320}
                      />
                    </div>
                    <div className="space-y-4">
                      <h3 className="font-semibold text-lg">Record Details</h3>
                      <div className="space-y-3">
                        {recordData.map((record, index) => (
                          <div key={record.name} className="border-b pb-2">
                            <div
                              className="flex justify-between items-center cursor-pointer"
                              onClick={() =>
                                toggleRecordExpand(`record-${record.name}`)
                              }
                            >
                              <span
                                className="font-medium"
                                style={{ color: COLORS[index % COLORS.length] }}
                              >
                                {record.name}
                              </span>
                              <div className="flex items-center gap-2">
                                <span className="font-bold">
                                  {formatCurrency(record.total)}
                                </span>
                                <span className="text-gray-400 text-sm">
                                  {expandedRecords[`record-${record.name}`]
                                    ? "▲"
                                    : "▼"}
                                </span>
                              </div>
                            </div>
                            {expandedRecords[`record-${record.name}`] && (
                              <div className="text-sm text-gray-500 mt-1 pl-2">
                                {record.Cash > 0 && (
                                  <div className="flex justify-between py-1">
                                    <span>Cash:</span>
                                    <span>{formatCurrency(record.Cash)}</span>
                                  </div>
                                )}
                                {record.CurrentBank > 0 && (
                                  <div className="flex justify-between py-1">
                                    <span>Bank:</span>
                                    <span>
                                      {formatCurrency(record.CurrentBank)}
                                    </span>
                                  </div>
                                )}
                                {record.None > 0 && (
                                  <div className="flex justify-between py-1">
                                    <span>Other:</span>
                                    <span>{formatCurrency(record.None)}</span>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        ))}

                        {companyRecordsData.map((company, index) => (
                          <div
                            key={company.companyName}
                            className="border-b pb-2"
                          >
                            <div
                              className="flex justify-between items-center cursor-pointer"
                              onClick={() =>
                                toggleRecordExpand(
                                  `company-${company.companyName}`
                                )
                              }
                            >
                              <span
                                className="font-medium"
                                style={{ color: COLORS[index % COLORS.length] }}
                              >
                                {company.companyName.charAt(0).toUpperCase() +
                                  company.companyName.slice(1)}
                              </span>
                              <div className="flex items-center gap-2">
                                <span className="font-bold">
                                  {formatCurrency(company.totalAmount)}
                                </span>
                                <span className="text-gray-400 text-sm">
                                  {expandedRecords[
                                    `company-${company.companyName}`
                                  ]
                                    ? "▲"
                                    : "▼"}
                                </span>
                              </div>
                            </div>
                            {expandedRecords[
                              `company-${company.companyName}`
                            ] && (
                              <div className="text-sm text-gray-500 mt-1 pl-2 space-y-1">
                                {company.records.map((record, idx) => (
                                  <div
                                    key={idx}
                                    className="flex justify-between py-1"
                                  >
                                    <span>{record.recordName}</span>
                                    <span>{formatCurrency(record.amount)}</span>
                                  </div>
                                ))}
                              </div>
                            )}
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
                        <span
                          className={`font-bold ${
                            bank.balance >= 0
                              ? "text-emerald-600"
                              : "text-rose-600"
                          }`}
                        >
                          {bank.name === "Current Bank"
                            ? `${formatCurrency(dashboardData.MoneyCalculation.TotalBank)}`
                            : `${formatCurrency(bank.credit)}`}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-emerald-50 p-3 rounded-lg">
                          <div className="flex items-center text-emerald-600 mb-1">
                            <ArrowUpRight className="h-4 w-4 mr-1" />
                            <span className="text-xs font-medium">Credits</span>
                          </div>
                          <div className="text-lg font-bold text-emerald-700">
                            {bank.name === "Current Bank"
                              ? `${formatCurrency(bank.balance + upiPayment)}`
                              : `${formatCurrency(bank.balance)}`}
                          </div>
                        </div>
                        <div className="bg-rose-50 p-3 rounded-lg">
                          <div className="flex items-center text-rose-600 mb-1">
                            <ArrowDownRight className="h-4 w-4 mr-1" />
                            <span className="text-xs font-medium">Debits</span>
                          </div>
                          <div className="text-lg font-bold text-rose-700">
                            {formatCurrency(bank.debit)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="stats">
            <Tabs
              defaultValue="Vamanpuri"
              onValueChange={setTab}
              className="mb-8"
            >
              <TabsList className="mb-4">
                <TabsTrigger value="Vamanpuri">Vamanpuri</TabsTrigger>
                <TabsTrigger value="Amariya">Amariya</TabsTrigger>
              </TabsList>

              {/* Performance Comparison Card */}
              {performanceComparison[
                tab as keyof typeof performanceComparison
              ] && (
                <Card className="shadow-md mb-6">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      Performance vs Last Year (June 1st onwards) - {tab}
                      {performanceComparison[
                        tab as keyof typeof performanceComparison
                      ]?.isAhead ? (
                        <span className="text-green-600">↗️</span>
                      ) : (
                        <span className="text-red-600">↘️</span>
                      )}
                    </CardTitle>
                    <CardDescription>
                      Comparison from June 1st to{" "}
                      {
                        performanceComparison[
                          tab as keyof typeof performanceComparison
                        ]?.periodEnd
                      }{" "}
                      (
                      {
                        performanceComparison[
                          tab as keyof typeof performanceComparison
                        ]?.daysAnalyzed
                      }{" "}
                      days analyzed)
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <div className="text-sm text-blue-600 font-medium">
                          2024 Beer Sales
                        </div>
                        <div className="text-2xl font-bold text-blue-800">
                          {formatCurrency(
                            performanceComparison[
                              tab as keyof typeof performanceComparison
                            ]?.total2024Beer || 0
                          )}
                        </div>
                      </div>

                      <div className="bg-green-50 p-4 rounded-lg">
                        <div className="text-sm text-green-600 font-medium">
                          2025 Beer Sales
                        </div>
                        <div className="text-2xl font-bold text-green-800">
                          {formatCurrency(
                            performanceComparison[
                              tab as keyof typeof performanceComparison
                            ]?.total2025Beer || 0
                          )}
                        </div>
                      </div>

                      <div className="bg-blue-50 p-4 rounded-lg">
                        <div className="text-sm text-blue-600 font-medium">
                          2024 Desi Sales
                        </div>
                        <div className="text-2xl font-bold text-blue-800">
                          {formatCurrency(
                            performanceComparison[
                              tab as keyof typeof performanceComparison
                            ]?.total2024Desi || 0
                          )}
                        </div>
                      </div>

                      <div className="bg-green-50 p-4 rounded-lg">
                        <div className="text-sm text-green-600 font-medium">
                          2025 Desi Sales
                        </div>
                        <div className="text-2xl font-bold text-green-800">
                          {formatCurrency(
                            performanceComparison[
                              tab as keyof typeof performanceComparison
                            ]?.total2025Desi || 0
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">
                        <strong>Summary:</strong> {tab} is currently{" "}
                        <span
                          className={
                            performanceComparison[
                              tab as keyof typeof performanceComparison
                            ]?.isAhead
                              ? "text-green-600 font-semibold"
                              : "text-red-600 font-semibold"
                          }
                        >
                          {performanceComparison[
                            tab as keyof typeof performanceComparison
                          ]?.isAhead
                            ? "ahead"
                            : "behind"}
                        </span>{" "}
                        compared to the same period last year by{" "}
                        <span className="font-semibold">
                          {formatCurrency(
                            Math.abs(
                              performanceComparison[
                                tab as keyof typeof performanceComparison
                              ]?.differenceBeer || 0
                            )
                          )}
                        </span>{" "}
                        (
                        {Math.abs(
                          performanceComparison[
                            tab as keyof typeof performanceComparison
                          ]?.percentageChangeBeer || 0
                        ).toFixed(1)}
                        % Beer Sales, {Math.abs(
                          performanceComparison[
                            tab as keyof typeof performanceComparison
                          ]?.percentageChangeDesi || 0
                        ).toFixed(1)}% Desi Sales).
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}

              <Card>
                <CardHeader>
                  <CardTitle>Daily Beer Sales Comparison - {tab}</CardTitle>
                  <CardDescription>
                    Comparing daily beer sales data between FY 2024-25 and FY
                    2025-26 (April to March) • Future dates show &quot;Update
                    Needed&quot;
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-96">
                    <ReactApexChart
                      options={areaChartOptions(tab)}
                      series={areaChartSeries(tab)}
                      type="area"
                      height={400}
                    />
                  </div>
                </CardContent>
              </Card>
            </Tabs>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
