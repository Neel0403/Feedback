import OpenAI from 'openai';
import { NextResponse } from 'next/server';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export const runtime = 'edge';

export async function POST(req: Request) {
    try {
        const prompt =
            "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.";

        const response = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [{ role: "user", content: prompt }],
            max_tokens: 400,
            stream: true,
        });

        const stream = new ReadableStream({
            async start(controller) {
                for await (const chunk of response) {
                    const { choices } = chunk;
                    if (choices && choices.length > 0) {
                        const text = choices[0].delta?.content || "";
                        controller.enqueue(text);
                    }
                }
                controller.close();
            }
        });
 
        return new Response(stream, {
            headers: { "Content-Type": "text/plain" },
        });
    } catch (error) {
        if (error instanceof OpenAI.APIError) {
            // OpenAI API error handling
            const { name, status, headers, message } = error;
            return NextResponse.json({ name, status, headers, message }, { status });
        } else {
            console.error('An unexpected error occurred:', error);
            throw error;
        }
    }
}