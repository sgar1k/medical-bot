// Default
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: "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" });

async function main() {
  const completion = await groq.chat.completions
    .create({
      messages: [
        {
            role: "system",
            content: "Вы медицинский помощник. Проанализируйте симптомы, предложите возможные причины и рекомендации. Предупредите, что это не замена врачу. Ответ на русском языке. Ответ:"
        },
        {
          role: "user",
          content: "пяткаа чешется",
        },
      ],
      model: "llama-3.3-70b-versatile",
    })
    .then((chatCompletion) => {
      console.log(chatCompletion.choices[0]?.message?.content || "");
    });
}

main();