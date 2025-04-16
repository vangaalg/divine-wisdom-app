require('dotenv').config();
const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

async function testOpenAI() {
  try {
    console.log('Testing OpenAI connection...');
    
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that provides spiritual guidance."
        },
        {
          role: "user",
          content: "What is the meaning of life?"
        }
      ],
      temperature: 0.7,
      max_tokens: 150
    });

    console.log('✅ OpenAI connection successful!');
    console.log('Response:', response.choices[0].message.content);
  } catch (error) {
    console.error('❌ OpenAI connection failed:', error.message);
    if (error.response) {
      console.error('Error details:', error.response.data);
    }
  }
}

testOpenAI(); 