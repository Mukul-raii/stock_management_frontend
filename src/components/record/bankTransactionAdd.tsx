"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { bankTransaction } from "@/app/action/record";
import { Button } from "@/components/ui/button";
import { AlertCircle, CalendarIcon, CheckCircle2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from "sonner";
import { Calendar } from "../ui/calendar";
import { useDate } from "@/hooks/setDate";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useAuth } from "@clerk/nextjs";
const bankAccounts = [
  "Current Bank",
  "Saving Bank (Nana)",
  "Saving Bank (Pooja)",
];

export default function AddBankTransaction() {
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [message, setMessage] = useState("");
  const [transactionType, setTransactionType] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [selectedAccount, setSelectedAccount] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{
    status: "success" | "error" | null;
    message: string;
  }>({ status: null, message: "" });
  const structuredDate = useDate(date);
      const {getToken} = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFeedback({ status: null, message: "" });

    try {
      const token = await getToken();
      if (!token) {
        toast.error("Failed to retrieve token");
        setIsSubmitting(false);
        return;
      }

      const res = await bankTransaction(
        parseInt(amount),
        transactionType,
        selectedAccount,
        paymentMethod,
        message,
        structuredDate,
        token
      );

      if (res) {
        toast.success("Transaction completed successfully!");
        setFeedback({
          status: "success",
          message: "Transaction completed successfully!",
        });
        // Reset form
        setAmount("");
        setTransactionType("");
        setSelectedAccount("");
      } else {
        toast.error("Transaction failed. Please try again.");
        setFeedback({
          status: "error",
          message: "Transaction failed. Please try again.",
        });
      }
    } catch (error) {
      setFeedback({
        status: "error",
        message: "An error occurred while processing your transaction.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-start justify-center p-4 pt-8">
      <div className="w-full max-w-2xl">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Bank Transaction
        </h1>
        <p className="text-gray-600 mb-6">
          Record new bank transactions quickly and easily
        </p>

        <Card className="shadow-lg border-t-4 border-t-emerald-500">
          <CardContent className="p-6">
            {feedback.status && (
              <Alert
                variant={
                  feedback.status === "success" ? "default" : "destructive"
                }
                className={`mb-6 ${feedback.status === "success" ? "bg-emerald-50 text-emerald-800 border-emerald-200" : ""}`}
              >
                {feedback.status === "success" ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : (
                  <AlertCircle className="h-4 w-4" />
                )}
                <AlertTitle>
                  {feedback.status === "success" ? "Success" : "Error"}
                </AlertTitle>
                <AlertDescription>{feedback.message}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-5">
                <div className="space-y-2">
                  <Label htmlFor="amount" className="text-gray-700 font-medium">
                    Amount *
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                      ₹
                    </span>
                    <Input
                      id="amount"
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="Enter amount"
                      className="pl-8 focus-visible:ring-2 focus-visible:ring-gray-500 border-gray-300"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="transactionType"
                    className="text-gray-700 font-medium"
                  >
                    Transaction Type *
                  </Label>
                  <Select
                    value={transactionType}
                    onValueChange={setTransactionType}
                    required
                  >
                    <SelectTrigger className="w-full border-gray-300 focus:ring-gray-500">
                      <SelectValue placeholder="Select transaction type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="credit" className="text-emerald-600">
                        Credit (Deposit)
                      </SelectItem>
                      <SelectItem value="debit" className="text-rose-600">
                        Debit (Withdrawal)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="bankAccount"
                    className="text-gray-700 font-medium"
                  >
                    Bank Account *
                  </Label>
                  <Select
                    value={selectedAccount}
                    onValueChange={setSelectedAccount}
                    required
                  >
                    <SelectTrigger className="w-full border-gray-300 focus:ring-emerald-500">
                      <SelectValue placeholder="Select bank account" />
                    </SelectTrigger>
                    <SelectContent>
                      {bankAccounts.map((account) => (
                        <SelectItem key={account} value={account}>
                          {account}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="transactionType"
                    className="text-gray-700 font-medium"
                  >
                    Payment Method *
                  </Label>
                  <Select
                    value={paymentMethod}
                    onValueChange={setPaymentMethod}
                    required
                  >
                    <SelectTrigger className="w-full border-gray-300 focus:ring-emerald-500">
                      <SelectValue placeholder="Select transaction type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem
                        value="Current Bank"
                        className="text-blue-600"
                      >
                        By Current Bank
                      </SelectItem>
                      <SelectItem value="By Cash" className="text-blue-600">
                        By Cash{" "}
                      </SelectItem>
                      <SelectItem value="By None" className="text-blue-600">
                        By None
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="amount" className="text-gray-700 font-medium">
                    Message *
                  </Label>
                  <div className="relative">
                    <Input
                      id="message"
                      type="text"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Enter Message"
                      className=" focus-visible:ring-2 focus-visible:ring-emerald-500 border-gray-300"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date" className="text-gray-700 font-medium">
                    Date *
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "group w-full justify-between bg-background px-3 font-normal outline-offset-0 hover:bg-background focus-visible:border-ring focus-visible:outline-[3px] focus-visible:outline-ring/20",
                          !date && "text-muted-foreground"
                        )}
                      >
                        <span
                          className={cn(
                            "truncate",
                            !date && "text-muted-foreground"
                          )}
                        >
                          {date ? format(date, "PPP") : "Pick a date"}
                        </span>
                        <CalendarIcon
                          size={16}
                          strokeWidth={2}
                          className="shrink-0 text-muted-foreground/80 transition-colors group-hover:text-foreground"
                          aria-hidden="true"
                        />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-2" align="start">
                      <Calendar
                        required
                        mode="single"
                        selected={date}
                        onSelect={(selectedDate) => {
                          console.log("Selected Date:", selectedDate); // Log the selected date from the calendar
                          setDate(selectedDate); // Set the new date from calendar
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <CardFooter className="px-0 pt-2 pb-0">
                <Button
                  type="submit"
                  className={`w-full ${
                    transactionType === "credit"
                      ? "bg-emerald-600 hover:bg-emerald-700"
                      : transactionType === "debit"
                        ? "bg-rose-600 hover:bg-rose-700"
                        : "bg-gray-700 hover:bg-gray-500"
                  } text-white py-2 px-4 rounded-md transition-colors duration-200`}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Processing..." : "Submit Transaction"}
                </Button>
              </CardFooter>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
