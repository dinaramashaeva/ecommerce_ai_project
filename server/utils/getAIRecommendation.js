export async function getAIRecommendation(userPrompt, products) {
  const API_KEY = process.env.OPENROUTER_API_KEY;

  const systemPrompt = `You are a multilingual product search assistant for an e-commerce store called BuyWise.
  You will receive a list of products and a user request in ANY language (English, Russian, Kyrgyz, Chinese, Arabic, German, French, Spanish, Turkish, and more).
  You must understand the request regardless of language and find matching products.
  You must return ONLY a valid JSON array of matching products from the provided list.
  No explanation, no markdown, no code blocks, no extra text. Just a raw JSON array.
  If no products match the request, return an empty array [].`;

  const userMessage = `
    Here is the list of available products:
    ${JSON.stringify(products, null, 2)}

    User request: "${userPrompt}"

    Return only the matching products as a raw JSON array. Keep all original product fields intact.
  `;

  const response = await fetch(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
        "HTTP-Referer": "http://localhost:5173",
        "X-Title": "BuyWise",
      },
      body: JSON.stringify({
        model: "meta-llama/llama-3.2-3b-instruct:free",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userMessage },
        ],
      }),
    }
  );

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
    throw new Error("Failed to parse AI response.");
  }

  return { success: true, products: parsedProducts };
}