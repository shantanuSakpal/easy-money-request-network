import { NextResponse } from "next/server";
import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY!,
});

export async function POST(req: Request) {
  try {
    const { message, taxdata } = await req.json();

    console.log("Received transaction data:", taxdata);
    console.log("User message:", message);

    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      messages: [
        {
          role: "system",
          content: `You are a friendly and helpful financial assistant specializing in personal finance, focusing on:
- Analyzing transaction data
- Providing tax insights
- Offering savings strategies
- Tracking and optimizing expenses

Your goals:
1. Help users understand their financial health
2. Provide actionable, personalized financial advice
3. Break down complex financial concepts
4. Suggest practical money management tips

Communication style:
- Be conversational and approachable
- Use clear, simple language
- Ask clarifying questions when needed
- Provide specific, actionable recommendations

Disclaimer: Advice is general. Always recommend consulting a professional financial advisor for personalized guidance.`
        },
        {
          role: "user",
          content: `I have the following transaction data to discuss: ${JSON.stringify(taxdata)}. My question is: ${message}`
        }
      ],
      max_tokens: 500,
      temperature: 0.7
    });

    const responseContent = completion.choices[0]?.message?.content || "I apologize, but I couldn't generate a helpful response. Could you please rephrase your question?";

    return NextResponse.json({
      message: responseContent,
    });
  } catch (error: any) {
    console.error("Financial Assistant API Error:", error);
    return NextResponse.json(
      {
        message: "I'm having trouble processing your request. Could you please try again?",
      },
      { status: 500 }
    );
  }
}