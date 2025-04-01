import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ReceiveStock from "@/components/stock/ReceiveStock";
import AddNewStock from "@/components/stock/addNewStock";

export default function AddStock() {
  return (
    
    <div className="p-6 bg-gray-50  min-h-screen  w-screen flex justify-center items-start">
      <div className=" p-2 w-[800px] flex flex-col justify-center items-center">

      <h1 className="text-2xl font-bold text-gray-800 mb-6">Manage Stock</h1>
      <Tabs defaultValue="tab-1" className="w-full bg-white shadow-md rounded-lg">
        <TabsList className="flex border-b border-gray-200">
          <TabsTrigger
            value="tab-1"
            className="flex-1 text-center py-3 text-gray-600 hover:text-gray-800 hover:bg-gray-100 transition-colors data-[state=active]:text-blue-600 data-[state=active]:border-b-2 data-[state=active]:border-blue-600"
          >
            Receive Stock
          </TabsTrigger>
          <TabsTrigger
            value="tab-2"
            className="flex-1 text-center py-3 text-gray-600 hover:text-gray-800 hover:bg-gray-100 transition-colors data-[state=active]:text-blue-600 data-[state=active]:border-b-2 data-[state=active]:border-blue-600"
          >
            Add New Stock Brand
          </TabsTrigger>
        </TabsList>
        <TabsContent value="tab-1" className="p-6">
          <ReceiveStock />
        </TabsContent>
        <TabsContent value="tab-2" className="p-6">
          <AddNewStock />
        </TabsContent>
      </Tabs>
      </div>

    </div>
  );
}
