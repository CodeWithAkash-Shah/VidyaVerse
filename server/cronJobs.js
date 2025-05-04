const cron = require('node-cron');
const Answer = require('./models/Answer');
const Doubt = require('./models/Doubt');
const Student = require('./models/Student');
const axios = require('axios');
const ollamalocalhost = process.env.OLLAMA_LOCALHOST || 'http://127.0.0.1:11434';

// Cron job running every 10 seconds
cron.schedule('*/10 * * * * *', async () => {
    try {
        console.log("Cron job started: Checking for unanswered doubts...");

        const doubts = await Doubt.find({
            hasAiResponse: false,
            isProcessingByAI: { $ne: true },
            createdAt: { $lt: new Date(Date.now() - 10000) },
        });
        
        for (const doubt of doubts) {
            // Lock this doubt for processing
            const locked = await Doubt.findOneAndUpdate(
                { _id: doubt._id, isProcessingByAI: { $ne: true } },
                { isProcessingByAI: true },
                { new: true }
            );
        
            if (!locked) {
                console.log(`Doubt ID ${doubt._id} is already being processed by another job.`);
                continue;
            }
        
            const response = await Answer.findOne({ doubt: doubt._id });
            if (response) {
                console.log(`Doubt ID ${doubt._id} already has a student response.`);
                await Doubt.findByIdAndUpdate(doubt._id, { isProcessingByAI: false });
                continue;
            }
        
            const student = await Student.findById(doubt.author);
        
            const customPrompt = `
        You're a friendly AI buddy who chats like a close friend. The student’s name is ${student.username}, 
        likes learning explained ${student.preferences?.style || "in a simple way"}.
        
        Limit response to 100 characters.
        
        Student's Question: "${doubt.title}"
        "${doubt.body}"
        "${doubt.subject}"
        "${doubt.topic}"
            `;
        
            axios.post(`${ollamalocalhost}/api/generate`, {
                model: "llama3",
                prompt: customPrompt,
                stream: false,
            }).then(async (aiResponse) => {
                const limitedResponse = aiResponse.data.response.slice(0, 300);
        
                await Answer.create({
                    doubt: doubt._id,
                    content: limitedResponse,
                    answered_by: null,
                    is_ai: true,
                });
        
                await Doubt.findByIdAndUpdate(doubt._id, {
                    hasAiResponse: true,
                    isProcessingByAI: false
                });
        
                console.log(`✅ AI answered doubt: ${doubt._id}`);
            }).catch(async (err) => {
                console.error("❌ AI generation failed:", err.message);
                await Doubt.findByIdAndUpdate(doubt._id, { isProcessingByAI: false });
            });
        }
        

        console.log("Cron job finished. Waiting for the next run...");
    } catch (error) {
        console.error("Error with cron job:", error);
    }
});
