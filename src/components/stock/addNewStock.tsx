"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { add_new_stock } from "@/app/action/stock";
import { LucideArrowDownToDot } from "lucide-react";
import { toast } from "sonner";

export default function AddNewStock() {
  const [formData, setFormData] = useState({
    product: "",
    size: 0,
    price: 0,
    shop: "",
  });

 
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    const parsedValue =
      name === "size" || name === "price" ? parseInt(value) : value.trim();

    setFormData((prevData) => ({
      ...prevData,
      [name]: parsedValue,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await add_new_stock(formData);
    console.log(res);
    if (res === 200) {
      toast.success("Stock added successfully");
    }else{
      toast.success("Error adding stock")
    }
  };

  return (
    <div className="container mx-auto py-10 px-4 md:px-6">
      <div className="flex items-center space-x-4">
        <div className="p-2 bg-primary/10 rounded-full">
          <LucideArrowDownToDot className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">New Stock</h1>
          <p className="text-muted-foreground">
            Manage new stock inventory for your shops
          </p>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="product">Product</label>
          <Input
            id="product"
            name="product"
            placeholder="Enter product name"
            value={formData.product}
            onChange={handleChange}
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="size">Size</label>
          <Input
            id="size"
            name="size"
            type="number"
            placeholder="Enter size"
            value={formData.size}
            onChange={handleChange}
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="price">Price</label>

          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
              $
            </span>
            <Input
              id="price"
              name="price"
              type="number"
              step="0.01"
              placeholder="0.00"
              className="pl-8"
              value={formData.price}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="price">Shop</label>
          <div className="relative">
            <select
              id="shop"
              name="shop"
              value={formData.shop}
              onChange={handleChange}
              className="w-full border rounded p-2"
            >
              <option value="">Select a shop</option>
              <option value="Amariya">Amariya</option>
              <option value="Vamanpuri">Vamanpuri</option>
            </select>
          </div>
        </div>

        <Button type="submit" className="w-full mt-6">
          Add Stock
        </Button>
      </form>
    </div>
  );
}
