import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateText } from "ai";
import "dotenv/config";

const google = createGoogleGenerativeAI();

async function test() {
  console.log("Testing API key...");
  console.log("Key starts with:", process.env.GOOGLE_GENERATIVE_AI_API_KEY?.substring(0, 10) + "...");

  // Try gemini-2.0-flash first (widely available)
  const models = ["gemini-2.0-flash", "gemini-1.5-flash", "gemini-2.5-flash"];
  
  for (const modelName of models) {
    try {
      console.log(`\nTrying model: ${modelName}...`);
      const result = await generateText({
        model: google(modelName),
        prompt: "Say hello in one word.",
      });
      console.log(`✅ ${modelName} works! Response: "${result.text}"`);
      return;
    } catch (error: any) {
      console.log(`❌ ${modelName} failed: ${error.message?.substring(0, 100)}`);
    }
  }
  
  console.log("\n❌ All models failed. Your API key or project may have issues.");
}

test();
