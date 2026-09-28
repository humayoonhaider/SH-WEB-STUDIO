import { Router, Request, Response } from 'express';
import { generateStudioChatReply, ChatMessage } from '../utils/geminiChat.js';

const router = Router();

// POST /api/chat - Multi-turn conversational endpoint for SH Web Studio AI Assistant
router.post('/', async (req: Request, res: Response) => {
  try {
    const { messages, message } = req.body;

    let chatHistory: ChatMessage[] = [];
    if (Array.isArray(messages)) {
      chatHistory = messages;
    } else if (typeof message === 'string' && message.trim().length > 0) {
      chatHistory = [{ role: 'user', content: message.trim() }];
    }

    if (chatHistory.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'A message or message history is required.',
      });
    }

    const reply = await generateStudioChatReply(chatHistory, typeof message === 'string' ? message : undefined);

    return res.status(200).json({
      success: true,
      role: 'assistant',
      reply,
      data: {
        role: 'assistant',
        reply,
        timestamp: new Date().toISOString(),
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('[ChatAPI] Error handling chat message:', error);
    const fallbackReply = 'Hello! I am here to help you with SH Web Studio services, pricing plans ($99, $199, $399), custom web apps, MERN stack projects, and our client referral program. How can I assist you today?';
    return res.status(200).json({
      success: true,
      role: 'assistant',
      reply: fallbackReply,
      data: {
        role: 'assistant',
        reply: fallbackReply,
        timestamp: new Date().toISOString(),
      },
    });
  }
});

export default router;
