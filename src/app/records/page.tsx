"use client"

import { useState } from "react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { FileText, ListFilter } from "lucide-react"
import ListRecord from "@/components/record/ListRecord"
import AddNewRecord from "@/components/record/AddNewRecord"

export default function Records() {
  const [selectedTab, setSelectedTab] = useState("Add New Record")

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Financial Records</h1>

        <Tabs value={selectedTab} onValueChange={(value) => setSelectedTab(value)} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger
              value="Add New Record"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <FileText className="mr-2 h-4 w-4" />
              Add New Record
            </TabsTrigger>
            <TabsTrigger
              value="List Record"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <ListFilter className="mr-2 h-4 w-4" />
              View Records
            </TabsTrigger>
          </TabsList>

          <TabsContent value={selectedTab} className="mt-0">
            {selectedTab === "Add New Record" ? <AddNewRecord /> : <ListRecord />}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

