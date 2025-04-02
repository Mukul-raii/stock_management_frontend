import axios from "axios";

export async function fetchBillBookData(shop: string) {
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_API}/billhistory/get_all_bill_history?Shop=${shop}`,
      {
        headers: {
          "Content-Type": "application/json",
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
