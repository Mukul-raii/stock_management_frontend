import { BillType } from "@/app/billhistory/page";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";


export default function BillhistoryData(data:BillType[]) {

console.log(data.data);

return (
    <div className="container mx-auto px-4 py-8">
      <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-md">
        <Table className="min-w-full">
          <TableCaption className="text-center text-gray-500 py-4">
            A list of your recent invoices.
          </TableCaption>
          <TableHeader className="bg-gray-100">
            <TableRow>
              <TableHead className="px-4 py-3 text-left text-sm font-medium text-gray-700">Date</TableHead>
              <TableHead className="px-4 py-3 text-left text-sm font-medium text-gray-700">Total Sale</TableHead>
              <TableHead className="px-4 py-3 text-left text-sm font-medium text-gray-700">Cash Received</TableHead>
              <TableHead className="px-4 py-3 text-left text-sm font-medium text-gray-700">UPI Payment</TableHead>
              <TableHead className="px-4 py-3 text-left text-sm font-medium text-gray-700">Discount</TableHead>
              <TableHead className="px-4 py-3 text-left text-sm font-medium text-gray-700">Liquor Sale</TableHead>
              <TableHead className="px-4 py-3 text-left text-sm font-medium text-gray-700">Beer Sale</TableHead>
              <TableHead className="px-4 py-3 text-left text-sm font-medium text-gray-700">Breakage Expense</TableHead>
              <TableHead className="px-4 py-3 text-left text-sm font-medium text-gray-700">Canteen Income</TableHead>
              <TableHead className="px-4 py-3 text-left text-sm font-medium text-gray-700">Rate Difference</TableHead>
              <TableHead className="px-4 py-3 text-left text-sm font-medium text-gray-700">Rent</TableHead>
              <TableHead className="px-4 py-3 text-left text-sm font-medium text-gray-700">Transportation</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.data && data.data.length > 0 ? (
              data.data.map((invoice) => (
                <TableRow key={invoice.id} className="border-t hover:bg-gray-50">
                  <TableCell className="px-4 py-3 text-sm text-gray-700">
                    {invoice.date instanceof Date ? invoice.date.toLocaleDateString() : 'Invalid date'}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-sm font-medium text-gray-900">₹ {invoice.totalSale.toLocaleString()}</TableCell>
                  <TableCell className="px-4 py-3 text-sm text-gray-700">₹ {invoice.totalCashReceived.toLocaleString()}</TableCell>
                  <TableCell className="px-4 py-3 text-sm text-gray-700">₹ {invoice.upiPayment.toLocaleString()}</TableCell>
                  <TableCell className="px-4 py-3 text-sm text-gray-700">
                    {invoice.discount ? `₹ ${invoice.discount.toLocaleString()}` : '₹ 0'}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-sm text-gray-700">₹ {invoice.totalDesiSale.toLocaleString()}</TableCell>
                  <TableCell className="px-4 py-3 text-sm text-gray-700">₹ {invoice.totalBeerSale.toLocaleString()}</TableCell>
                  <TableCell className="px-4 py-3 text-sm text-gray-700">
                    {invoice.breakageCash ? `₹ ${invoice.breakageCash.toLocaleString()}` : '₹ 0'}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-sm text-gray-700">
                    {invoice.canteenCash ? `₹ ${invoice.canteenCash.toLocaleString()}` : '₹ 0'}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-sm text-gray-700">₹ {invoice.rateDiff.toLocaleString()}</TableCell>
                  <TableCell className="px-4 py-3 text-sm text-gray-700">₹ {invoice.rent.toLocaleString()}</TableCell>
                  <TableCell className="px-4 py-3 text-sm text-gray-700">₹ {invoice.transportation.toLocaleString()}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={12} className="text-center py-8 text-gray-500">
                  <div className="flex flex-col items-center justify-center">
                    <svg className="w-12 h-12 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                    <p className="text-lg font-medium">No invoice data available</p>
                    <p className="text-sm">Please select a different shop or check back later</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}