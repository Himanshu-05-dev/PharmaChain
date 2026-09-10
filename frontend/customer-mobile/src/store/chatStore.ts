/**
 * Chat Store
 * Manages conversation history, loading states, and AI integration for PharmaBot.
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ChatMessageItem, sendChatMessageToMistral } from '../services/ai/mistral';
import { buildSystemPromptWithContext, UserContextParams } from '../services/ai/contextBuilder';

interface ChatState {
  messages: ChatMessageItem[];
  isLoading: boolean;
  error: string | null;
  customApiKey: string | null;
  setCustomApiKey: (key: string | null) => void;
  sendMessage: (text: string, context: UserContextParams) => Promise<void>;
  retryLastMessage: (context: UserContextParams) => Promise<void>;
  clearChat: () => void;
}

const INITIAL_WELCOME_MESSAGE: ChatMessageItem = {
  id: 'welcome-0',
  role: 'assistant',
  content:
    "👋 Hello! I'm **PharmaBot**, your PharmaChain safety and medication assistant.\n\nI can help you review your saved medicine cabinet, explain recent verification scan results, and provide basic medical guidance and storage rules.\n\nAsk me anything about your medicines or safety precautions!",
  timestamp: 'Just now',
};

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      messages: [INITIAL_WELCOME_MESSAGE],
      isLoading: false,
      error: null,
      customApiKey: null,

      setCustomApiKey: (key: string | null) => set({ customApiKey: key }),

      sendMessage: async (text: string, context: UserContextParams) => {
        const trimmed = text.trim();
        if (!trimmed) return;

        const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const userMsg: ChatMessageItem = {
          id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          role: 'user',
          content: trimmed,
          timestamp: timeStr,
        };

        const updatedHistory = [...get().messages, userMsg];
        set({ messages: updatedHistory, isLoading: true, error: null });

        try {
          const systemPrompt = buildSystemPromptWithContext(context);
          const replyText = await sendChatMessageToMistral(
            updatedHistory,
            systemPrompt,
            get().customApiKey
          );

          const assistantMsg: ChatMessageItem = {
            id: `msg-${Date.now() + 1}`,
            role: 'assistant',
            content: replyText,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          };

          set((state) => ({
            messages: [...state.messages, assistantMsg],
            isLoading: false,
            error: null,
          }));
        } catch (err: any) {
          const errorMsg = err.message || 'Failed to get response from PharmaBot.';
          const errorAssistantMsg: ChatMessageItem = {
            id: `msg-err-${Date.now()}`,
            role: 'assistant',
            content: `⚠️ **Error**: ${errorMsg}\n\nPlease try asking again or verify your connection.`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isError: true,
          };

          set((state) => ({
            messages: [...state.messages, errorAssistantMsg],
            isLoading: false,
            error: errorMsg,
          }));
        }
      },

      retryLastMessage: async (context: UserContextParams) => {
        const state = get();
        if (state.isLoading) return;

        // Find last user message
        const lastUserIdx = [...state.messages].reverse().findIndex((m) => m.role === 'user');
        if (lastUserIdx === -1) return;

        const actualIdx = state.messages.length - 1 - lastUserIdx;
        const lastUserMsg = state.messages[actualIdx];

        // Prune any error message after it
        const pruned = state.messages.slice(0, actualIdx + 1);
        set({ messages: pruned, isLoading: true, error: null });

        try {
          const systemPrompt = buildSystemPromptWithContext(context);
          const replyText = await sendChatMessageToMistral(
            pruned,
            systemPrompt,
            get().customApiKey
          );

          const assistantMsg: ChatMessageItem = {
            id: `msg-${Date.now()}`,
            role: 'assistant',
            content: replyText,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          };

          set((s) => ({
            messages: [...s.messages, assistantMsg],
            isLoading: false,
            error: null,
          }));
        } catch (err: any) {
          const errorMsg = err.message || 'Retry failed.';
          const errorAssistantMsg: ChatMessageItem = {
            id: `msg-err-${Date.now()}`,
            role: 'assistant',
            content: `⚠️ **Error**: ${errorMsg}`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isError: true,
          };

          set((s) => ({
            messages: [...s.messages, errorAssistantMsg],
            isLoading: false,
            error: errorMsg,
          }));
        }
      },

      clearChat: () => {
        set({
          messages: [INITIAL_WELCOME_MESSAGE],
          isLoading: false,
          error: null,
        });
      },
    }),
    {
      name: 'pharmachain-chat-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        messages: state.messages.slice(-30), // keep recent 30 messages
        customApiKey: state.customApiKey,
      }),
    }
  )
);
