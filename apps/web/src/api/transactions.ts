export const getAllTransactions = async () => {
  try {
    const req = await fetch("http://localhost:3000/api/transactions", {
      headers: {
        "content-type": "applications/json",
      },
    });
    const res = await req.json();
    console.log(res);
  } catch (error) {
    console.log(error);
  }
};
