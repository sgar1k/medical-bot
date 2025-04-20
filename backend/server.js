require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
app.use(cors());
app.use(express.json());

// 🔑 Ваш ключ от Hugging Face (ШАГ 3)
const HF_API_KEY = process.env.HF_API_KEY;
const MODEL_URL = 'https://api-inference.huggingface.co/models/sberbank-ai/rugpt3medium_based_on_gpt2';

app.post('/api/ask', async (req, res) => {
    try {
        const prompt = `
            Вы медицинский помощник. Пациент сообщает: "${req.body.text}".
            Проанализируйте симптомы, предложите возможные причины и рекомендации.
            Предупредите, что это не замена врачу. Ответ на русском языке.
            Ответ:
        `;

        const response = await fetch(MODEL_URL, {
            method: 'POST',
            headers: { 
                'Authorization': `Bearer ${HF_API_KEY}`,
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify({ inputs: prompt })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Ошибка ИИ');
        }

        const data = await response.json();
        const reply = data[0]?.generated_text || 'Не удалось получить ответ';
        res.json({ reply: reply.split('Ответ:')[1]?.trim() || reply });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Сервер работает: http://localhost:${PORT}`));