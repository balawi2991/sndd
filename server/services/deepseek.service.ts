import axios from 'axios';

const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';

export const callDeepSeek = async (
  userMessage: string,
  context: string
): Promise<string> => {
  try {
    const apiKey = process.env.DEEPSEEK_API_KEY;
    
    if (!apiKey) {
      throw new Error('DeepSeek API key not configured');
    }

    // Build system prompt with context
    const systemPrompt = context
      ? `You are a helpful AI assistant. You MUST use the following context to answer the user's question. The context contains specific information that you should prioritize over your general knowledge.

Context from knowledge base:
${context}

IMPORTANT Instructions:
- ALWAYS check the context first before answering
- If the answer is in the context, use it directly
- Be specific and use exact information from the context
- If the context doesn't contain the answer, then provide a general response
- Be concise, clear, and friendly`
      : 'You are a helpful AI assistant. Provide clear, concise, and friendly responses.';

    const response = await axios.post(
      DEEPSEEK_API_URL,
      {
        model: 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content: systemPrompt,
          },
          {
            role: 'user',
            content: userMessage,
          },
        ],
        temperature: 0.7,
        max_tokens: 500,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        timeout: 30000, // 30 seconds
      }
    );

    const assistantMessage = response.data.choices[0]?.message?.content;
    
    if (!assistantMessage) {
      throw new Error('No response from DeepSeek');
    }

    return assistantMessage.trim();
  } catch (error: any) {
    console.error('DeepSeek API error:', error.response?.data || error.message);
    
    // Fallback response
    if (error.response?.status === 401) {
      throw new Error('API authentication failed');
    } else if (error.response?.status === 429) {
      throw new Error('Rate limit exceeded, please try again later');
    } else {
      throw new Error('Failed to get AI response, please try again');
    }
  }
};
