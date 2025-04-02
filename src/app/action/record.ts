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
        const res = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_API}/record/new_record`,{recordType,selectedShop,message,amount,date,selectedPaymentMethod}, {
            headers:{'Content-Type': 'application/json' }
            })
        
        return res.data

    } catch (error) {
        console.log(error);
        
        return null 
    }
}


export const getAllRecords=async () => {
    try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_API}/record/get_all_records`, {
            headers:{'Content-Type': 'application/json' }
            })
        return res.data
    } catch (error) {
        return null
    }
}



export const bankTransaction =async(amount:number,transactionType:string,selectedAccount:string)=>{
    try {
        
        const res = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_API}/record/bank_transaction`,{amount,transactionType,selectedAccount}, {
            headers:{'Content-Type': 'application/json' }
            })
        console.log(res);
        
        if (res.status===200 ) return true
    } catch (error) {
        console.log(error);
        
        return null
    }
}


export const getDashboardData= async()=>{
    try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_API}/record/dashboard`, {
            headers:{'Content-Type': 'application/json' }
            })
        return res.data
    } catch (error) {
        return null
    }
}