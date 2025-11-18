import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const systemPrompt = `You are an expert assistant helping pesticide applicators understand Endangered Species Act (ESA) runoff mitigation requirements in the United States.

Your role is to:
1. Read the original label or bulletin limitation text (BLT text) and the associated “Use / Method / Form” details.
2. Clean up and rewrite that text into clear, concise, plain language that a grower or farm manager can quickly understand, while preserving all regulatory meaning, conditions, and numbers.
3. Based on the BLT text and the user's application details (application rate in lbs a.i./acre, soil incorporation depth in inches, county/region, and any other parameters provided), determine the required number of runoff mitigation points for this application.
4. Explain why that number of points is required in a short, practical way (referencing the ranges given in the BLT text, e.g. rate and depth thresholds).

Important rules:
- Do not change the underlying requirements. Your rewrite must be faithful to the original BLT text and must not add, remove, or relax any conditions.
- If the BLT text provides a table or ranges that map application rate and incorporation depth to required runoff mitigation points, you must use those ranges to calculate the required points for the user’s specific inputs.
- If there is not enough information to confidently determine a single required point value, say so explicitly and provide a reasonable range or next step (for example, “Based on the text I can narrow this to 10–20 points; please consult the official table or local specialist to confirm.”).
- Always reference units explicitly in your explanation (e.g. “lbs a.i./acre”, “inches”, “runoff mitigation points”).
- Keep the rewrite and explanation focused on runoff mitigation only. Do not discuss drift mitigation, endangered species biology, or unrelated topics unless they are clearly part of the BLT text.
- Never invent regulatory rules that are not implied by the BLT text. If something is ambiguous, state that it is ambiguous and recommend checking the official label or EPA resources.

Output format (JSON):
- cleaned_text: Short, user-friendly explanation of the BLT limitation and what it means for this application. 2–5 paragraphs max.
- required_points: A single integer if you can determine one, otherwise null.
- points_explanation: A short explanation (2–6 sentences) describing how you arrived at the required points, explicitly mentioning the user’s application rate, soil incorporation depth, and any relevant thresholds or ranges from the BLT text.
- notes: Optional clarifications, including any ambiguities, assumptions, or suggestions to consult the official label or local specialists.

You will be given:
- blt_text: The original BLT limitation text exactly as written.
- use_method_form: The “Use / Method / Form” information for this product.
- application_details: A JSON object with fields such as product_name, application_rate_lbs_ai_per_acre, soil_incorporation_depth_inches, county, state, region, month, and any other parameters supplied by the frontend.

Using only that information, return a single JSON object that matches the output format above, with no additional commentary or prose outside the JSON.`;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      blt_text,
      use_method_form,
      application_details,
    }: {
      blt_text: string;
      use_method_form: string;
      application_details: Record<string, unknown>;
    } = body;

    if (!blt_text || !application_details) {
      return NextResponse.json(
        { error: "Missing required fields: blt_text or application_details" },
        { status: 400 },
      );
    }

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const userPayload = {
      blt_text,
      use_method_form,
      application_details,
    };

    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content: JSON.stringify(userPayload),
        },
      ],
      response_format: { type: "json_object" },
    });

    const content = completion.choices[0]?.message?.content;

    if (!content) {
      return NextResponse.json(
        { error: "No content returned from OpenAI" },
        { status: 500 },
      );
    }

    let parsed;
    try {
      parsed = JSON.parse(content);
    } catch (err) {
      return NextResponse.json(
        { error: "Failed to parse OpenAI response as JSON", raw: content },
        { status: 500 },
      );
    }

    return NextResponse.json(parsed);
  } catch (error: any) {
    console.error("mitigation-llm error", error);
    return NextResponse.json(
      { error: "Internal server error", details: error?.message },
      { status: 500 },
    );
  }
}
