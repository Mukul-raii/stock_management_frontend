import axios from "axios";



export async function fetchBillBookData(shop:string) {
try {
    const res = await axios.get(`http://localhost:3000/billhistory/get_all_bill_history?Shop=${shop}`)

    return res.data
} catch (error) {
    console.error("Error in fetchBillBookData:", error);
    return 404
}
}