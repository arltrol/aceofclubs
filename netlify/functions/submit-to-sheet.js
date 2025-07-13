// /netlify/functions/submit-to-sheet.js

const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

exports.handler = async function(event) {
  const targetUrl = "https://script.google.com/macros/s/AKfycbzdZ2NpXCOAg3YVaxVaa7YaVvvZtWP9d5ZBGhhFlAc5bu0VfN6z787ZBd0hB6QjVuA/exec";

  try {
    const data = JSON.parse(event.body);

    const formData = new URLSearchParams();
    for (let key in data) {
      formData.append(key, data[key]);
    }

    const googleResponse = await fetch(targetUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: formData.toString()
    });

    const text = await googleResponse.text();
    console.log("Raw Google Sheet response:", text);

    return {
      statusCode: 200,
      body: text,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Content-Type": "text/plain"
      }
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: `Failed to forward: ${err.message}`
    };
  }
};
