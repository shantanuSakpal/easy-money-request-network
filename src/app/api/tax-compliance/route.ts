import { NextResponse } from "next/server";
import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY!,
});

export async function POST(req: Request) {
  try {
    const { jsonData, message } = await req.json();

    console.log("jsonData is ", jsonData);
    console.log("message is ", message);

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `
                        You are a financial and tax compliance assistant. 
                        Your job is to analyze the provided transaction data and return:
                        1. A JSON object summarizing key financial insights, structured as follows:
                           - totalTransactions: Total number of transactions.
                           - totalAmount: Total amount transacted (in ETH or specified currency).
                           - taxesToPay: Estimated taxes based on a 10% tax rate (default) or any tax rules inferred from the data.
                           - payerSummary: A summary for each payer with their respective totals and tax liabilities.
                           - payeeSummary: A summary for each payee with their respective totals.
                        2. Additional financial notes or insights in clear, simple language.
                        
                        Ensure the JSON structure is well-formed and easy to parse.
                    `,
        },
        {
          role: "user",
          content: `Here is the JSON transaction data: ${JSON.stringify(
            jsonData
          )}`,
        },
      ],
    });

    const responseContent = completion.choices[0]?.message?.content;

    // // Parse the response to check if it contains JSON.
    // const jsonStartIndex = responseContent?.indexOf("{");
    // const jsonEndIndex = responseContent?.lastIndexOf("}");
    // let jsonResponse: any;
    // if (jsonStartIndex !== -1 && jsonEndIndex !== -1) {
    //     jsonResponse = JSON.parse(responseContent.slice(jsonStartIndex, jsonEndIndex + 1));
    // }
    return NextResponse.json({
      message: responseContent,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        error:
          error.message || "An error occurred while processing the request.",
      },
      { status: 500 }
    );
  }
}
