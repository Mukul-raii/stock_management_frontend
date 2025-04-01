
import StockAdd from "@/components/stock_add";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface TabsProps {
  toogleShop: (shopId:string)=>void;
  children: React.ReactNode
  selectedShop: string;
}

export default function Shop_Tab({toogleShop, children,selectedShop}:TabsProps) {
    
    return(
        <Tabs value={selectedShop}
        onValueChange={(value) =>{
            if(value==="Amariya") toogleShop("Amariya")
            if(value==="Vamanpuri") toogleShop("Vamanpuri")

        }}>
        <TabsList className="relative h-auto w-full gap-0.`5 bg-transparent p-0 before:absolute before:inset-x-0 before:bottom-0 before:h-px before:bg-border">
          <TabsTrigger
            value="Amariya"
            className="overflow-hidden rounded-b-none border-x border-t border-border bg-muted py-2 data-[state=active]:z-10 data-[state=active]:shadow-none">
            Amariya
          </TabsTrigger>
          <TabsTrigger
            value="Vamanpuri"
            className="overflow-hidden rounded-b-none border-x border-t border-border bg-muted py-2 data-[state=active]:z-10 data-[state=active]:shadow-none">
                Vamanpuri
          </TabsTrigger>
        </TabsList>
                  {children}
       
      </Tabs>
    )
}