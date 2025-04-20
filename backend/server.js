require('dotenv').config();
const express = require('express');
// const cors = require('cors');
const fetch = require('node-fetch');
const Groq = require("groq-sdk");

const app = express();
// app.use(cors());
app.use(express.json());

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

app.post('/api/ask', async (req, res) => {
    try {
        const messages = [
            {
                role: "system",
                content: "Вы медицинский помощник. Проанализируйте симптомы, предложите возможные причины и рекомендации. Предупредите, что это не замена врачу. Ответ на русском языке. Ответ:"
            },
            {
                role: "user",
                content: req.body.text,
            },
        ];

        const completion = await groq.chat.completions.create({
            messages,
            model: "llama-3.3-70b-versatile",
        });

        const reply = completion.choices[0]?.message?.content || 'Не удалось получить ответ';
        res.json({ reply });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Сервер работает: http://localhost:${PORT}`));