import { Router } from 'express';
import axios from 'axios';

const router = Router();
const MISTRAL_API_URL = 'https://api.mistral.ai/v1/chat/completions';

/**
 * POST /api/consumer/chat
 * Securely proxies chat completion requests to Mistral AI using the MISTRAL_API_KEY
 * injected from Kubernetes consumer-auth-secret (secrets.yml).
 */
router.post('/', async (req, res, next) => {
  try {
    const { messages, temperature = 0.25, max_tokens = 850 } = req.body;

    const apiKey =
      process.env.MISTRAL_API_KEY ||
      process.env.EXPO_PUBLIC_MISTRAL_API_KEY ||
      req.headers['x-mistral-api-key'];

    if (!apiKey) {
      return res.status(503).json({
        status: 'error',
        message: 'MISTRAL_API_KEY is not configured in server/k8s/secrets.yml',
        isConfigMissing: true,
      });
    }

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({
        status: 'error',
        message: 'Request body must include a "messages" array.',
      });
    }

    const model =
      process.env.MISTRAL_MODEL ||
      process.env.EXPO_PUBLIC_MISTRAL_MODEL ||
      'open-mistral-7b';

    let response;
    try {
      response = await axios.post(
        MISTRAL_API_URL,
        {
          model,
          messages,
          temperature,
          max_tokens,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
          },
          timeout: 25000,
        }
      );
    } catch (apiErr) {
      // If 429 rate limit on a specific model, fallback to open-mistral-7b
      if (apiErr?.response?.status === 429 && model !== 'open-mistral-7b') {
        console.warn(`[chat.routes] Model ${model} rate-limited. Falling back to open-mistral-7b...`);
        response = await axios.post(
          MISTRAL_API_URL,
          {
            model: 'open-mistral-7b',
            messages,
            temperature,
            max_tokens,
          },
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${apiKey}`,
            },
            timeout: 25000,
          }
        );
      } else {
        throw apiErr;
      }
    }

    const reply = response.data?.choices?.[0]?.message?.content;
    if (!reply) {
      return res.status(502).json({
        status: 'error',
        message: 'Empty response received from Mistral AI.',
      });
    }

    return res.status(200).json({
      status: 'success',
      reply: reply.trim(),
    });
  } catch (error) {
    console.error('[consumer-service/chat error]:', error?.response?.data || error.message);

    if (error?.response?.status) {
      return res.status(error.response.status).json({
        status: 'error',
        message: error.response.data?.message || 'Mistral AI API error',
      });
    }

    next(error);
  }
});

export default router;
