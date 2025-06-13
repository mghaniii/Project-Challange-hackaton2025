

const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const textAnalytics_pkg = require("@azure/ai-text-analytics");

const app = express();
// BENAR
app.use(cors({
  origin: 'https://euphonious-granita-571447.netlify.app'
}));
app.use(express.json());

const TextAnalyticsClient = textAnalytics_pkg.TextAnalyticsClient;
const AzureKeyCredential = textAnalytics_pkg.AzureKeyCredential;

const textAnalyticsClient = new TextAnalyticsClient(
    process.env.AZURE_LANGUAGE_ENDPOINT, 
    new AzureKeyCredential(process.env.AZURE_LANGUAGE_KEY)
);

const getSystemPrompt = (mode, sentiment) => {
    let basePrompt = "";
    let sentimentInstruction = "";
    if (sentiment === 'negative') {
        sentimentInstruction = "Penting: Pengguna sedang merasa negatif, jadi berikan respons yang lebih hati-hati, sabar, dan empatik. ";
    }
    switch (mode) {
        case 'lawak':
            basePrompt = "Kamu adalah Lawak AI, seorang komedian stand-up digital dari Indonesia yang jenaka dan cerdas. Tugasmu adalah membuat pengguna tertawa dengan lelucon pendek atau observasi lucu. ";
            if (sentiment === 'negative') sentimentInstruction += "Coba hibur pengguna dengan lelucon ringan yang menyemangati, bukan mengejek.";
            break;
        case 'roasting':
            basePrompt = "Kamu adalah Roasting AI. Tugasmu adalah me-roasting pengguna dengan gaya komedi yang cerdas, sarkastik, dan menyindir, tapi tetap lucu dan tidak melewati batas. ";
            if (sentiment === 'negative') sentimentInstruction += "Karena pengguna sedang sedih, roasting-nya jangan terlalu pedas, lebih ke arah candaan ringan untuk mencairkan suasana.";
            break;
        case 'gombal':
            basePrompt = "Kamu adalah Gombalan AI. Tugasmu adalah merayu pengguna dengan gombalan maut yang manis, puitis, atau sedikit norak tapi tetap romantis. ";
            break;
        default:
            basePrompt = "Kamu adalah asisten AI yang ramah, membantu kesehatan mental dan suportif. Kemudian mengatahui cara kerja yang selalu kalah dalam judi online ";
            break;
    }
    return basePrompt + sentimentInstruction;
};

app.post('/api/chat-cerdas', async (req, res) => {
    try {
        const { message, mode } = req.body;
        if (!message) return res.status(400).json({ error: "Pesan tidak boleh kosong." });

        const sentimentInput = [message];
        const sentimentResult = await textAnalyticsClient.analyzeSentiment(sentimentInput, 'id');
        const detectedSentiment = sentimentResult[0].sentiment;
        console.log(`Mode Diterima: ${mode}, Sentimen Terdeteksi: ${detectedSentiment}`);

        const systemPrompt = getSystemPrompt(mode, detectedSentiment);
        
        // === BAGIAN YANG DIPERBAIKI DENGAN .trim() ===
        const endpoint = process.env.AZURE_OPENAI_ENDPOINT.trim();
        const deploymentName = process.env.AZURE_OPENAI_DEPLOYMENT_NAME.trim();
        const apiKey = process.env.AZURE_OPENAI_KEY.trim();
        // ===========================================

        const apiVersion = "2024-02-15-preview";
        const url = `${endpoint}openai/deployments/${deploymentName}/chat/completions?api-version=${apiVersion}`;
        
        const headers = {
            'Content-Type': 'application/json',
            'api-key': apiKey
        };

        const body = {
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: message }
            ],
            max_tokens: 400,
            temperature: 0.75,
        };

        const response = await axios.post(url, body, { headers: headers });
        const aiReply = response.data.choices[0].message.content;
        
        res.json({ 
            reply: aiReply,
            sentiment: detectedSentiment
        });

    } catch (error) {
        console.error("Terjadi error di server:", error.response ? error.response.data : error.message);
        res.status(500).json({ error: "Maaf, ada masalah di pihak server AI kami." });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend cerdas siap beraksi di http://localhost:${PORT}`);
});