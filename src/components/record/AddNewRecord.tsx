"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  CalendarIcon,
  CreditCard,
  MessageSquare,
  Store,
  FileText,
  DollarSign,
  CheckCircle2,
} from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { addNewRecord } from "@/app/action/record";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

const TypeRecordProps: string[] = [
  "Purchase Stock",
  "Excise Inspector Payment",
  "Direct Purchase Stock",
  "MMGD Payment",
  "Assesment Payment",
  "Salary",
  "Cash Handling Charge",
  "Others",
];

const shopName = ["Amariya", "Vamanpuri"];

interface AddNewRecordProps {
  onRecordAdded?: (record: {
    recordType: string;
    shop: string;
    message: string;
    amount: number;
    date: Date;
    paymentMethod: string;
  }) => void;
}

export default function AddNewRecord({ onRecordAdded }: AddNewRecordProps) {
  const [date, setDate] = useState<Date>(new Date());
  const [recordType, setRecordType] = useState("");
  const [selectedShop, setSelectedShop] = useState("");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
  const [message, setMessage] = useState("");
  const [amount, setAmount] = useState<number | string>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate required fields
    if (!recordType || !selectedPaymentMethod || !amount) {
      toast.error("Please fill in all required fields");
      setIsSubmitting(false);
      return;
    }

    // Capture record data before any async operations
    const recordData = {
      recordType,
      shop: selectedShop,
      message,
      amount: Number(amount),
      date,
      paymentMethod: selectedPaymentMethod,
    };

    console.log("Captured record data:", recordData);

    try {
      await addNewRecord(
        recordType,
        selectedShop || "",
        message,
        Number(amount),
        date,
        selectedPaymentMethod
      );

      // Reset form only after successful submission
      setRecordType("");
      setSelectedShop("");
      setMessage("");
      setAmount(0);
      setDate(new Date());
      setSelectedPaymentMethod("");

      toast.success("Record added successfully!");

      // Call the callback with the captured data
      if (onRecordAdded) {
        onRecordAdded(recordData);
      }
    } catch (error) {
      toast.error("Error adding record");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full">
      <Card className="border-none shadow-md">
        <CardHeader className="space-y-1 pb-6">
          <div className="flex items-center space-x-2">
            <FileText className="h-5 w-5 text-primary" />
            <CardTitle className="text-2xl font-bold">Add New Record</CardTitle>
          </div>
          <CardDescription>
            Enter the details below to create a new financial record
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="recordType" className="text-sm font-medium">
                  Record Type
                </Label>
                <Select
                  value={recordType}
                  onValueChange={setRecordType}
                  required
                >
                  <SelectTrigger id="recordType" className="w-full">
                    <SelectValue placeholder="Select Record Type" />
                  </SelectTrigger>
                  <SelectContent className="z-[9999]">
                    {TypeRecordProps.map((item, index) => (
                      <SelectItem key={index} value={item}>
                        <div className="flex items-center">
                          <FileText className="mr-2 h-4 w-4 text-muted-foreground" />
                          {item}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="shopName" className="text-sm font-medium">
                  Shop <span className="text-muted-foreground">(optional)</span>
                </Label>
                <Select value={selectedShop} onValueChange={setSelectedShop}>
                  <SelectTrigger id="shopName" className="w-full">
                    <SelectValue placeholder="Select Shop" />
                  </SelectTrigger>
                  <SelectContent className="z-[9999]">
                    {shopName.map((item, index) => (
                      <SelectItem key={index} value={item}>
                        <div className="flex items-center">
                          <Store className="mr-2 h-4 w-4 text-muted-foreground" />
                          {item}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="message" className="text-sm font-medium">
                Message
              </Label>
              <div className="relative">
                <MessageSquare className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Enter message or description"
                  className="pl-10"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="amount" className="text-sm font-medium">
                  Amount
                </Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="amount"
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Enter amount"
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 z-[9999]" align="start">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={(date) => date && setDate(date)}
                      initialFocus
                      className="rounded-md border"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label htmlFor="paymentMethod" className="text-sm font-medium">
                  Payment Method
                </Label>
                <Select
                  value={selectedPaymentMethod}
                  onValueChange={setSelectedPaymentMethod}
                  required
                >
                  <SelectTrigger id="paymentMethod" className="w-full">
                    <SelectValue placeholder="Select Payment Method" />
                  </SelectTrigger>
                  <SelectContent className="z-[9999]">
                    <SelectItem value="Cash">
                      <div className="flex items-center">
                        <CreditCard className="mr-2 h-4 w-4 text-muted-foreground" />
                        Cash
                      </div>
                    </SelectItem>
                    <SelectItem value="Current Bank">
                      <div className="flex items-center">
                        <CreditCard className="mr-2 h-4 w-4 text-muted-foreground" />
                        Current Bank Account
                      </div>
                    </SelectItem>
                    <SelectItem value="none">
                      <div className="flex items-center">
                        <CreditCard className="mr-2 h-4 w-4 text-muted-foreground" />
                        None
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-end pt-4">
          <Button
            type="submit"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full md:w-auto"
          >
            {isSubmitting ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Processing...
              </>
            ) : (
              <>
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Add Record
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
