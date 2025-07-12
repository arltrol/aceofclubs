import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function handler(event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Only POST allowed" };
  }

  try {
    const { imageUrl } = JSON.parse(event.body);

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `You are a helpful assistant. The user has uploaded a photo of a paper registration form used for sign-ins. Your task is to extract only the handwritten full names (first and last if available). Return just the list of names as a JSON array, nothing else. Example: ["Jane Smith", "John Doe", "Ella K."]`,
            },
            {
              type: "image_url",
              image_url: { url: imageUrl },
            },
          ],
        },
      ],
    });

    const raw = response.choices[0].message.content;
    let names;

    try {
      names = JSON.parse(raw);
    } catch (err) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Failed to parse GPT response", raw }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ names }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
}
