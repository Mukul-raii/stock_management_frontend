import axios from "axios";


export const addNewRecord= async  (
    recordType:string,
    selectedShop:string,
    message:string,
    amount: number,
    date:Date,
    selectedPaymentMethod:string
) =>{
    try {
        const res = await axios.post(`${process.env.NEXT_BACKEND_API}/record/new_record`,{recordType,selectedShop,message,amount,date,selectedPaymentMethod})
        
        return res.data

    } catch (error) {
        console.log(error);
        
        return null 
    }
}


export const getAllRecords=async () => {
    try {
        const res = await axios.get(`${process.env.NEXT_BACKEND_API}/record/get_all_records`)
        return res.data
    } catch (error) {
        return null
    }
}