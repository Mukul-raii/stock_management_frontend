"use client";
import { useState } from "react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { FileText, ListFilter } from "lucide-react"
import { ListBankTransaction } from "@/components/record/listBankTransaction";
import AddBankTransaction from "@/components/record/bankTransactionAdd";


export default function BankTransaction() {
  const [selectedTab, setSelectedTab] = useState("Add New Transaction")

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Manage Bank</h1>

        <Tabs value={selectedTab} onValueChange={(value) => setSelectedTab(value)} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger
              value="Add New Transaction"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <FileText className="mr-2 h-4 w-4" />
              Add New Transaction
            </TabsTrigger>
            <TabsTrigger
              value="List Transaction"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <ListFilter className="mr-2 h-4 w-4" />
              View Transaction
            </TabsTrigger>
          </TabsList>

          <TabsContent value={selectedTab} className="mt-0">
            {selectedTab === "Add New Transaction" ? <AddBankTransaction /> : <ListBankTransaction />}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
