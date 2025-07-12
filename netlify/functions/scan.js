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
            { type: "text", text: "Extract the handwritten names from this registration form image. Return them as a clean JSON array of names." },
            {
              type: "image_url",
              image_url: { url: imageBase64 },
            },
          ],
        },
      ],
    });

    const text = response.choices[0].message.content;
    return {
      statusCode: 200,
      body: JSON.stringify({ names: JSON.parse(text) }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
