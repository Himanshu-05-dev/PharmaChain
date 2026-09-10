/**
 * Mistral AI API Service
 * Connects to Mistral API (mistral-small-latest) for intelligent, guardrailed chat completions.
 */

import axios from 'axios';
import { checkPromptSafety } from './guardrails';
import { consumerApiClient } from '../api/client';

export interface ChatMessageItem {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  isError?: boolean;
}

const MISTRAL_API_URL = 'https://api.mistral.ai/v1/chat/completions';
const DEFAULT_MODEL = process.env.EXPO_PUBLIC_MISTRAL_MODEL || 'open-mistral-7b';

export function getMistralApiKey(): string | null {
  return process.env.EXPO_PUBLIC_MISTRAL_API_KEY || null;
}

/**
 * Executes a chat completion request.
 * Primary: Proxies through Kubernetes backend (/api/consumer/chat) using secrets.yml.
 * Fallback: Direct client call if user provides custom key or direct API key is present.
 */
export async function sendChatMessageToMistral(
  history: ChatMessageItem[],
  systemPrompt: string,
  userApiKey?: string | null
): Promise<string> {
  const lastUserMessage = history[history.length - 1];
  if (!lastUserMessage || lastUserMessage.role !== 'user') {
    throw new Error('Last message must be from user.');
  }

  // 1. Run Pre-flight Guardrail Check
  const safetyCheck = checkPromptSafety(lastUserMessage.content);
  if (!safetyCheck.isSafe && safetyCheck.refusalMessage) {
    return safetyCheck.refusalMessage;
  }

  // 2. Format messages
  const formattedMessages = [
    { role: 'system', content: systemPrompt },
    ...history.map((m) => ({
      role: m.role,
      content: m.content,
    })),
  ];

  // 3. Attempt to call consumer-service backend endpoint (/api/consumer/chat)
  // which holds the MISTRAL_API_KEY from Kubernetes secrets.yml
  try {
    const headers: Record<string, string> = {};
    if (userApiKey) {
      headers['x-mistral-api-key'] = userApiKey;
    }

    const response = await consumerApiClient.post(
      '/chat',
      {
        messages: formattedMessages,
        temperature: 0.25,
        max_tokens: 850,
      },
      {
        headers,
        timeout: 25000,
      }
    );

    if (response.data?.reply) {
      return response.data.reply.trim();
    }
  } catch (backendErr: any) {
    console.warn(
      '[Backend Chat Route failed or unavailable, falling back]:',
      backendErr?.response?.data || backendErr.message
    );

    // If backend explicitly says the key is not in secrets.yml and no local key exists
    const apiKey = userApiKey || getMistralApiKey();
    if (!apiKey && (backendErr?.response?.data?.isConfigMissing || backendErr?.response?.status === 503)) {
      return generateOfflineGroundedResponse(lastUserMessage.content, systemPrompt);
    }

    // If client has a key, try direct Mistral API call as secondary fallback
    if (apiKey) {
      try {
        const directRes = await axios.post(
          MISTRAL_API_URL,
          {
            model: DEFAULT_MODEL,
            messages: formattedMessages,
            temperature: 0.25,
            max_tokens: 850,
          },
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${apiKey}`,
            },
            timeout: 20000,
          }
        );

        const reply = directRes.data?.choices?.[0]?.message?.content;
        if (reply) return reply.trim();
      } catch (directErr: any) {
        console.error('[Direct Mistral API Error]:', directErr?.response?.data || directErr.message);
      }
    }

    // If backend failed and no direct key, provide offline response or rethrow
    if (!apiKey) {
      return generateOfflineGroundedResponse(lastUserMessage.content, systemPrompt);
    }

    throw new Error(
      backendErr?.response?.data?.message ||
        backendErr?.message ||
        'Unable to reach PharmaChain AI assistant.'
    );
  }

  return generateOfflineGroundedResponse(lastUserMessage.content, systemPrompt);
}

/**
 * Fallback grounded assistant when Mistral API key is not yet set in environment.
 * Ensures the app and user remain functional and can inspect their medicines.
 */
function generateOfflineGroundedResponse(userQuery: string, systemPrompt: string): string {
  const lower = userQuery.toLowerCase();

  if (lower.includes('expir') || lower.includes('shelf life')) {
    return (
      "📋 **Medicine Expiry Status:**\n\n" +
      "According to your PharmaChain cabinet records:\n" +
      "• If you have saved medicines, always check for any flagged as *'Expiring Soon'* or *'Needs Attention'*.\n" +
      "• Expired medications should never be consumed as active compounds degrade and may become toxic.\n\n" +
      "💡 *Tip: Ensure MISTRAL_API_KEY is active in Kubernetes secrets.yml or app settings to enable full dynamic AI reasoning!*"
    );
  }

  if (lower.includes('scan') || lower.includes('verify') || lower.includes('fake') || lower.includes('counterfeit')) {
    return (
      "🔍 **Authentication Guidance:**\n\n" +
      "• PharmaChain authenticates medicines by verifying their unique 2D DataMatrix QR code against the CDSCO Hyperledger Fabric blockchain.\n" +
      "• Each authentic pack features a cryptographic hash and manufacturer signature.\n" +
      "• If packaging has peeling foil, misaligned fonts, or an unrecognized QR code, do not ingest the medicine and submit a report via the Reports tab.\n\n" +
      "💡 *Tip: Ensure MISTRAL_API_KEY is active in Kubernetes secrets.yml to unlock full Mistral AI capabilities!*"
    );
  }

  if (lower.includes('stor') || lower.includes('temperature') || lower.includes('fridge')) {
    return (
      "🌡️ **Standard Storage Guidelines:**\n\n" +
      "• **Room Temperature**: 15°C to 25°C in a dry area away from direct sunlight.\n" +
      "• **Cold Chain**: 2°C to 8°C in a refrigerator (never freeze insulin, biologics, or reconstituted suspensions).\n" +
      "• **Bathroom Cabinets**: Avoid storing medications in humid bathrooms where moisture accelerates degradation.\n\n" +
      "⚠️ *Always verify the packaging label instructions for specific storage requirements.*"
    );
  }

  return (
    "👋 Hello! I am **PharmaBot**, your PharmaChain safety assistant.\n\n" +
    "I can help you review your saved medicines, explain your recent scan results, and provide basic drug storage and safety advice.\n\n" +
    "⚠️ *Note: To connect to live Mistral AI completions, please configure `MISTRAL_API_KEY` in `server/k8s/secrets.yml` or the in-app key manager (🔑).* "
  );
}
