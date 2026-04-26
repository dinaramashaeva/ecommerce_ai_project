export async function getAIRecommendation(userPrompt, products) {
  const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
  const OPENROUTER_KEY = process.env.OPENROUTER_API_KEY;

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

  // Try GitHub Models first
  try {
    console.log("Trying GitHub Models GPT-4o-mini...");
    const response = await fetch(
      "https://models.inference.ai.azure.com/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${GITHUB_TOKEN}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userMessage },
          ],
          temperature: 0.3,
          max_tokens: 2000,
        }),
      }
    );

    const data = await response.json();

    if (!data.error) {
      const aiResponseText = data?.choices?.[0]?.message?.content?.trim() || "";
      if (aiResponseText) {
        const cleanedText = aiResponseText.replace(/```json/g, "").replace(/```/g, "").trim();
        const parsedProducts = JSON.parse(cleanedText);
        console.log("GitHub Models succeeded!");
        return { success: true, products: parsedProducts };
      }
    }
    console.log("GitHub Models failed, trying OpenRouter...");
  } catch (error) {
    console.log("GitHub Models error:", error.message);
  }

  // Fallback to OpenRouter
  const models = [
    "meta-llama/llama-3.3-70b-instruct:free",
    "google/gemma-3-27b-it:free",
    "nvidia/nemotron-3-super:free",
    "openrouter/auto",
  ];

  let lastError = null;

  for (const model of models) {
    try {
      console.log(`Trying OpenRouter model: ${model}`);
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENROUTER_KEY}`,
          "HTTP-Referer": "https://buywise-client.vercel.app",
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
        lastError = data.error.message;
        continue;
      }

      const aiResponseText = data?.choices?.[0]?.message?.content?.trim() || "";
      if (!aiResponseText) continue;

      const cleanedText = aiResponseText.replace(/```json/g, "").replace(/```/g, "").trim();

      try {
        const parsedProducts = JSON.parse(cleanedText);
        console.log(`OpenRouter model ${model} succeeded!`);
        return { success: true, products: parsedProducts };
      } catch {
        lastError = "Failed to parse AI response";
        continue;
      }
    } catch (error) {
      lastError = error.message;
      continue;
    }
  }

  throw new Error(lastError || "All AI models failed. Please try again later.");
}