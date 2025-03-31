"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { add_new_stock} from "@/app/action/stock";



export default function AddNewStock() {
    const [formData, setFormData] = useState({
        product: "",
        size: 0,
        quantity:0,
        price:0,
        shop:""
    });

    const handleChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } =e.target;
        
        const parsedValue = name==='size' || name==='quantity' || name==='price' ? parseInt(value) : value

        setFormData((prevData) => ({
            ...prevData,
            [name]: parsedValue,
        }));
        
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log(formData);
        const res = await add_new_stock(formData)
        console.log(res);
        
    };

    return (
        <div className="container mx-auto py-10 px-4 md:px-6">
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
                  type='number'
                  placeholder="Enter size"
                  value={formData.size}
                  onChange={handleChange}
                  required
                />
              </div>
  
              <div className="space-y-2">
                <label htmlFor="quantity">Quantity</label>
                <Input
                  id="quantity"
                  name="quantity"
                  type="number"
                  placeholder="Enter quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  required
                />
              </div>
  
  
              <div className="space-y-2">
                <label htmlFor="price">Price</label>
             
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
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
                  <Input
                    id="shop"
                    name="shop"
                    type="string"
                    className="pl-8"
                    value={formData.shop}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <Button type="submit" className="w-full mt-6">Add Stock</Button>

            </form>
      </div>
    );
}