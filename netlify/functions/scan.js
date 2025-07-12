const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Set this in Netlify dashboard
});

exports.handler = async function (event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Only POST allowed" };
  }

  try {
    const { imageBase64 } = JSON.parse(event.body);

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
              image_url: { url: "https://i.imgur.com/XxYyZzA.png" },
            },
          ],
        },
      ],
    });

    const text = response.choices[0].message.content;

    // Optional: log for debugging
    console.log("GPT-4o raw response:", text);

    return {
      statusCode: 200,
      body: JSON.stringify({ names: JSON.parse(text) }),
    };
  } catch (error) {
    console.error("Error in scan function:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
