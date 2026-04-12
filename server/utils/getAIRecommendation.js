export async function getAIRecommendation(userPrompt, products) {
  const API_KEY = process.env.OPENROUTER_API_KEY;

  const systemPrompt = `You are a product search assistant. You will be given a list of products and a user request. 
  You must return ONLY a valid JSON array of matching products from the list. 
  No explanation, no markdown, no code blocks. Just a raw JSON array.
  If no products match, return an empty array [].`;

  const userMessage = `
    Here is the list of available products:
    ${JSON.stringify(products, null, 2)}

    User request: "${userPrompt}"

    Return only the matching products as a raw JSON array.
  `;

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${API_KEY}`,
      "HTTP-Referer": "http://localhost:5173",
      "X-Title": "BuyWise",
    },
    body: JSON.stringify({
      model: "google/gemini-2.0-flash-lite-001",  // still Google's model but through OpenRouter
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage },
      ],
    }),
  });

  const data = await response.json();

  console.log("OpenRouter response:", JSON.stringify(data, null, 2));

  if (data.error) {
    throw new Error(`AI error: ${data.error.message}`);
  }

  const aiResponseText =
    data?.choices?.[0]?.message?.content?.trim() || "";

  console.log("AI response text:", aiResponseText);

  const cleanedText = aiResponseText
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  if (!cleanedText) {
    throw new Error("AI response is empty or invalid.");
  }

  let parsedProducts;
  try {
    parsedProducts = JSON.parse(cleanedText);
  } catch (error) {
    console.log("Parse error:", error.message);
    throw new Error("Failed to parse AI response.");
  }

  return { success: true, products: parsedProducts };
}