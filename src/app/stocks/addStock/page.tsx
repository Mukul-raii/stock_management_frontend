import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ReceiveStock from "@/components/stock/ReceiveStock";
import AddNewStock from "@/components/stock/addNewStock";




export default function AddStock() {
    return (
        <div>
    <Tabs defaultValue="tab-1">
      <TabsList className="relative h-auto w-full gap-0.5 bg-transparent p-0 before:absolute before:inset-x-0 before:bottom-0 before:h-px before:bg-border">
        <TabsTrigger
          value="tab-1"
          className="overflow-hidden rounded-b-none border-x border-t border-border bg-muted py-2 data-[state=active]:z-10 data-[state=active]:shadow-none"
        >
          Receive Stock 
        </TabsTrigger>
        <TabsTrigger
          value="tab-2"
          className="overflow-hidden rounded-b-none border-x border-t border-border bg-muted py-2 data-[state=active]:z-10 data-[state=active]:shadow-none"
        >
          Add New Stock Brand
        </TabsTrigger>
      </TabsList>
      <TabsContent value="tab-1">
       <ReceiveStock/>
      </TabsContent>
      <TabsContent value="tab-2">
      <AddNewStock />
      </TabsContent>
    </Tabs>
        </div>
    );
}