import axios from "axios";

export async function fetchBillBookData(shop: string, token: string) {
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_API}/billhistory/get_all_bill_history?Shop=${shop}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      }
    );

    return res.data;
  } catch (error) {
    console.error("Error in fetchBillBookData:", error);
    return 404;
  }
}
