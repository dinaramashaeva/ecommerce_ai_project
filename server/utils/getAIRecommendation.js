export async function getAIRecommendation(userPrompt, products) {
  const API_KEY = process.env.OPENROUTER_API_KEY;

  const systemPrompt = `You are a multilingual product search assistant for an e-commerce store called BuyWise.
  You will receive a list of products and a user request in ANY language (English, Russian, Kyrgyz, etc).
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

  const models = [
    "meta-llama/llama-3.3-70b-instruct:free",
    "google/gemma-3-27b-it:free",
    "nvidia/nemotron-3-super:free",
    "openrouter/auto",
  ];

  let lastError = null;

  for (const model of models) {
    try {
      console.log(`Trying model: ${model}`);

      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_KEY}`,
          "HTTP-Referer": "http://localhost:5173",
          "X-Title": "BuyWise",
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userMessage },
          ],
        }),
      });

      const data = await response.json();

      if (data.error) {
        console.log(`Model ${model} failed:`, data.error.message);
        lastError = data.error.message;
        continue;
      }

      const aiResponseText =
        data?.choices?.[0]?.message?.content?.trim() || "";

      if (!aiResponseText) {
        console.log(`Model ${model} returned empty response`);
        continue;
      }

      const cleanedText = aiResponseText
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

      let parsedProducts;
      try {
        parsedProducts = JSON.parse(cleanedText);
        console.log(`Model ${model} succeeded!`);
        return { success: true, products: parsedProducts };
      } catch (error) {
        console.log(`Model ${model} returned invalid JSON`);
        lastError = "Failed to parse AI response";
        continue;
      }

    } catch (error) {
      console.log(`Model ${model} threw error:`, error.message);
      lastError = error.message;
      continue;
    }
  }

  throw new Error(lastError || "All AI models failed. Please try again later.");
}