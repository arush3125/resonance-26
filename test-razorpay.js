// Test Razorpay API directly
const testRazorpay = async () => {
  const RAZORPAY_KEY_ID = "rzp_test_RkhqAGBTAiI34s";
  const RAZORPAY_KEY_SECRET = "oi1YnUv5uagU6AAL2MT37gEb";
  
  try {
    const auth = btoa(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`);
    
    const response = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Basic ${auth}`,
      },
      body: JSON.stringify({
        amount: 10000, // 100 rupees in paise
        currency: "INR",
        receipt: `test_${Date.now()}`,
        notes: {
          test: "direct_api_test"
        },
      }),
    });

    if (response.ok) {
      const order = await response.json();
      console.log("✅ Razorpay API working:", order);
    } else {
      const error = await response.text();
      console.error("❌ Razorpay API failed:", response.status, error);
    }
  } catch (error) {
    console.error("❌ Test failed:", error);
  }
};

testRazorpay();
