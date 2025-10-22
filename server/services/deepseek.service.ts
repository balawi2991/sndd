import axios from 'axios';

const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';

interface BotPersonality {
  botName?: string;
  botRole?: string;
  language: 'ar' | 'en' | 'both';
  tone: 'formal' | 'friendly' | 'professional';
  greeting?: string;
  companyName?: string;
  specialInstructions?: string;
}

interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

// Build personality-aware system prompt
const buildSystemPrompt = (context: string, personality?: BotPersonality): string => {
  // Tone mapping
  const toneInstructions = {
    formal: 'Be formal, respectful, and use professional language. Avoid casual expressions.',
    friendly: 'Be warm, approachable, and conversational. Use a friendly tone while remaining helpful.',
    professional: 'Be professional, clear, and efficient. Balance friendliness with expertise.',
  };

  // Language instructions
  const languageInstructions = {
    ar: 'Always respond in Arabic (العربية). Use proper Arabic grammar and expressions.',
    en: 'Always respond in English. Use clear and proper English.',
    both: 'Respond in the same language as the user\'s question. If Arabic, respond in Arabic. If English, respond in English.',
  };

  // Build identity section
  const identitySection = personality?.botName
    ? `Your name is "${personality.botName}".`
    : 'You are an AI assistant.';

  const roleSection = personality?.botRole
    ? `Your role is: ${personality.botRole}.`
    : 'Your role is to provide customer support.';

  const companySection = personality?.companyName
    ? `You represent "${personality.companyName}".`
    : 'You represent the company/organization that deployed you.';

  // Build base personality
  const basePersonality = `${identitySection} ${roleSection} ${companySection}

CORE IDENTITY:
- You are an AI-powered assistant, not a human
- You understand that you are a chatbot designed to help users
- You know your limitations and capabilities
- You are knowledgeable, helpful, and reliable

COMMUNICATION STYLE:
- ${toneInstructions[personality?.tone || 'professional']}
- ${languageInstructions[personality?.language || 'both']}
- Be concise and clear in your responses
- Use proper formatting when needed

BEHAVIOR GUIDELINES:
- Answer questions accurately based on the provided knowledge base
- If you don't know something, admit it honestly - say "I don't have information about this"
- Never make up information or hallucinate facts
- Always prioritize verified information from the knowledge base
- Stay in character and maintain your defined personality
- Be helpful and solution-oriented`;

  // Add special instructions if provided
  const specialSection = personality?.specialInstructions
    ? `\n\nSPECIAL INSTRUCTIONS:\n${personality.specialInstructions}`
    : '';

  // Build final prompt with or without context
  if (context) {
    return `${basePersonality}${specialSection}

KNOWLEDGE BASE CONTEXT:
${context}

CRITICAL INSTRUCTIONS FOR USING CONTEXT:
1. The context above contains VERIFIED information from the company's knowledge base
2. You MUST prioritize this context when answering questions
3. If the answer is in the context, use it EXACTLY as provided
4. The context is your PRIMARY source of truth
5. Only use general knowledge if the context doesn't contain the answer
6. When using context, be specific and direct
7. Reference the knowledge base when relevant

Remember: You are representing this specific company. Use their knowledge base first!`;
  } else {
    return `${basePersonality}${specialSection}

Note: No specific knowledge base context is available for this query. Provide a helpful general response while staying in character. If the question requires specific company information that you don't have, politely explain that you need more information to answer accurately.`;
  }
};

export const callDeepSeek = async (
  userMessage: string,
  context: string,
  personality?: BotPersonality,
  conversationHistory?: Message[]
): Promise<string> => {
  try {
    const apiKey = process.env.DEEPSEEK_API_KEY;
    
    if (!apiKey) {
      throw new Error('DeepSeek API key not configured');
    }

    // Build personality-aware system prompt
    const systemPrompt = buildSystemPrompt(context, personality);

    // Build messages array with conversation history
    const messages: Message[] = [
      {
        role: 'system',
        content: systemPrompt,
      },
    ];

    // Add conversation history (last 5 messages for context)
    if (conversationHistory && conversationHistory.length > 0) {
      const recentHistory = conversationHistory.slice(-5);
      messages.push(...recentHistory);
    }

    // Add current user message
    messages.push({
      role: 'user',
      content: userMessage,
    });

    const response = await axios.post(
      DEEPSEEK_API_URL,
      {
        model: 'deepseek-chat',
        messages,
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
