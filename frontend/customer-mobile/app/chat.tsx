import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Animated,
  Easing,
  Modal,
  Alert,
  Keyboard,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  Send,
  Bot,
  Sparkles,
  ShieldCheck,
  RotateCcw,
  Trash2,
  Key,
  Info,
  ChevronRight,
  Pill,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react-native';
import { useChatStore } from '../src/store/chatStore';
import { useCustomerStore } from '../src/store/customerStore';
import { useAuthStore } from '../src/store/authStore';
import { ChatMessageItem, getMistralApiKey } from '../src/services/ai/mistral';
import { MEDICAL_DISCLAIMER } from '../src/services/ai/guardrails';
import { MarkdownText } from '../src/components/MarkdownText';

const SUGGESTED_PROMPTS = [
  'Check my expiring medicines',
  'Explain my latest scan result',
  'How should I store insulin and antibiotics?',
  'How do I spot fake medicine packaging?',
  'What should I do if a medicine is recalled?',
];

export default function ChatScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const flatListRef = useRef<FlatList>(null);

  const { messages, isLoading, sendMessage, retryLastMessage, clearChat, customApiKey, setCustomApiKey } =
    useChatStore();
  const { savedMedicines, scanHistory } = useCustomerStore();
  const { user } = useAuthStore();

  const [inputText, setInputText] = useState('');
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState(customApiKey || '');

  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  // Monitor keyboard show/hide to smoothly shift layout and scroll to bottom
  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const showSub = Keyboard.addListener(showEvent, () => {
      setKeyboardVisible(true);
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    });

    const hideSub = Keyboard.addListener(hideEvent, () => {
      setKeyboardVisible(false);
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  // Dot bounce animations for typing indicator
  const dot1Anim = useRef(new Animated.Value(0)).current;
  const dot2Anim = useRef(new Animated.Value(0)).current;
  const dot3Anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isLoading) {
      const animateDot = (anim: Animated.Value, delay: number) => {
        return Animated.loop(
          Animated.sequence([
            Animated.delay(delay),
            Animated.timing(anim, {
              toValue: -6,
              duration: 250,
              easing: Easing.inOut(Easing.quad),
              useNativeDriver: true,
            }),
            Animated.timing(anim, {
              toValue: 0,
              duration: 250,
              easing: Easing.inOut(Easing.quad),
              useNativeDriver: true,
            }),
            Animated.delay(500 - delay),
          ])
        );
      };

      const l1 = animateDot(dot1Anim, 0);
      const l2 = animateDot(dot2Anim, 150);
      const l3 = animateDot(dot3Anim, 300);

      l1.start();
      l2.start();
      l3.start();

      return () => {
        l1.stop();
        l2.stop();
        l3.stop();
      };
    }
  }, [isLoading]);

  // Auto scroll to bottom when messages update
  useEffect(() => {
    const timer = setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 120);
    return () => clearTimeout(timer);
  }, [messages.length, isLoading]);

  const activeContext = {
    userName: (user as any)?.displayName || user?.name || 'Verified Patient',
    savedMedicines,
    scanHistory,
  };

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || inputText;
    if (!query.trim() || isLoading) return;

    setInputText('');
    await sendMessage(query, activeContext);
  };

  const handleSaveApiKey = () => {
    const trimmed = apiKeyInput.trim();
    setCustomApiKey(trimmed || null);
    setShowKeyModal(false);
    Alert.alert(
      'Mistral Key Saved',
      trimmed
        ? 'Your custom Mistral API key has been saved for this session.'
        : 'Reverted to default environment key.'
    );
  };

  const hasConfiguredKey = !!(customApiKey || getMistralApiKey());

  const renderMessage = ({ item }: { item: ChatMessageItem }) => {
    const isUser = item.role === 'user';

    return (
      <View
        style={[
          styles.messageRow,
          isUser ? styles.messageRowUser : styles.messageRowAssistant,
        ]}
      >
        {!isUser && (
          <View style={styles.assistantAvatar}>
            <Bot size={18} color="#ffffff" />
          </View>
        )}

        <View
          style={[
            styles.messageBubble,
            isUser ? styles.userBubble : styles.assistantBubble,
            item.isError && styles.errorBubble,
          ]}
        >
          {!isUser && (
            <View style={styles.assistantHeaderRow}>
              <View style={styles.botBadge}>
                <Sparkles size={11} color="#ff5a36" />
                <Text style={styles.botBadgeText}>PharmaBot AI</Text>
              </View>
              <Text style={styles.messageTime}>{item.timestamp}</Text>
            </View>
          )}

          <MarkdownText
            content={item.content}
            isUser={isUser}
            isError={item.isError}
          />

          {isUser && (
            <Text style={styles.userMessageTime}>{item.timestamp}</Text>
          )}

          {item.isError && (
            <TouchableOpacity
              style={styles.retryButton}
              onPress={() => retryLastMessage(activeContext)}
              activeOpacity={0.8}
            >
              <RotateCcw size={14} color="#dc2626" />
              <Text style={styles.retryButtonText}>Retry Response</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* 1. Header Bar */}
      <View
        style={[
          styles.header,
          { paddingTop: Math.max(insets.top, 20) + 6 },
        ]}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          activeOpacity={0.7}
        >
          <ArrowLeft size={22} color="#1f2937" />
        </TouchableOpacity>

        <View style={styles.headerTitleWrap}>
          <View style={styles.titleRow}>
            <Text style={styles.headerTitle}>PharmaBot AI</Text>
            <View style={styles.onlinePill}>
              <View style={styles.onlineDot} />
              <Text style={styles.onlineText}>Active</Text>
            </View>
          </View>
          <Text style={styles.headerSubtitle}>
            Medicine Safety & Activity Assistant
          </Text>
        </View>

        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.headerIconBtn}
            onPress={() => setShowKeyModal(true)}
            activeOpacity={0.7}
          >
            <Key size={18} color={hasConfiguredKey ? '#059669' : '#9ca3af'} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.headerIconBtn}
            onPress={() => {
              Alert.alert(
                'Clear Conversation',
                'Are you sure you want to reset your chat history?',
                [
                  { text: 'Cancel', style: 'cancel' },
                  { text: 'Clear', style: 'destructive', onPress: clearChat },
                ]
              );
            }}
            activeOpacity={0.7}
          >
            <Trash2 size={18} color="#6b7280" />
          </TouchableOpacity>
        </View>
      </View>

      {/* 2. Grounded Context Strip */}
      <View style={styles.contextStrip}>
        <View style={styles.contextItem}>
          <ShieldCheck size={13} color="#059669" />
          <Text style={styles.contextText}>
            CDSCO Verified Node • {savedMedicines.length} Saved Meds • {scanHistory.length} Scans
          </Text>
        </View>
      </View>

      {/* 3. Messages List */}
      <KeyboardAvoidingView
        style={styles.chatArea}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? insets.top + 8 : 0}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderMessage}
          contentContainerStyle={[
            styles.listContent,
            { paddingBottom: 16 },
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          onContentSizeChange={() => {
            flatListRef.current?.scrollToEnd({ animated: true });
          }}
          ListFooterComponent={
            isLoading ? (
              <View style={styles.typingContainer}>
                <View style={styles.assistantAvatar}>
                  <Bot size={18} color="#ffffff" />
                </View>
                <View style={styles.typingBubble}>
                  <Text style={styles.typingLabel}>PharmaBot is thinking</Text>
                  <View style={styles.dotsRow}>
                    <Animated.View
                      style={[
                        styles.dot,
                        { transform: [{ translateY: dot1Anim }] },
                      ]}
                    />
                    <Animated.View
                      style={[
                        styles.dot,
                        { transform: [{ translateY: dot2Anim }] },
                      ]}
                    />
                    <Animated.View
                      style={[
                        styles.dot,
                        { transform: [{ translateY: dot3Anim }] },
                      ]}
                    />
                  </View>
                </View>
              </View>
            ) : null
          }
        />

        {/* 4. Suggested Prompts Chips */}
        {messages.length <= 2 && (
          <View style={styles.suggestionsContainer}>
            <Text style={styles.suggestionsTitle}>Quick Inquiries</Text>
            <FlatList
              horizontal
              data={SUGGESTED_PROMPTS}
              keyExtractor={(item) => item}
              showsHorizontalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={styles.suggestionsList}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.suggestionChip}
                  onPress={() => handleSend(item)}
                  activeOpacity={0.8}
                >
                  <Sparkles size={12} color="#ea580c" />
                  <Text style={styles.suggestionText}>{item}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        )}

        {/* 5. Medical Safety Footnote */}
        <View style={styles.disclaimerFootnote}>
          <Info size={12} color="#9ca3af" />
          <Text style={styles.disclaimerText}>
            Educational guidance only. Not a substitute for a doctor's diagnosis.
          </Text>
        </View>

        {/* 6. Input Bar */}
        <View
          style={[
            styles.inputContainer,
            {
              paddingBottom: isKeyboardVisible
                ? (Platform.OS === 'ios' ? 10 : 12)
                : Math.max(insets.bottom, 12) + 4,
            },
          ]}
        >
          <TextInput
            style={styles.textInput}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Ask about your medicines, scans, or storage..."
            placeholderTextColor="#9ca3af"
            multiline
            maxLength={600}
            returnKeyType="default"
          />

          <TouchableOpacity
            style={[
              styles.sendButton,
              (!inputText.trim() || isLoading) && styles.sendButtonDisabled,
            ]}
            onPress={() => handleSend()}
            disabled={!inputText.trim() || isLoading}
            activeOpacity={0.85}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#ffffff" />
            ) : (
              <Send size={18} color="#ffffff" />
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      {/* 7. Mistral API Key Modal */}
      <Modal
        visible={showKeyModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowKeyModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Key size={22} color="#ff5a36" />
              <Text style={styles.modalTitle}>Mistral AI API Key</Text>
            </View>
            <Text style={styles.modalDesc}>
              PharmaBot connects to Mistral AI (`mistral-small-latest`) for real-time natural language reasoning. You can set or override your API key below:
            </Text>

            <TextInput
              style={styles.modalInput}
              value={apiKeyInput}
              onChangeText={setApiKeyInput}
              placeholder="Enter your Mistral API Key"
              placeholderTextColor="#9ca3af"
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalCancelBtn}
                onPress={() => setShowKeyModal(false)}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalSaveBtn}
                onPress={handleSaveApiKey}
              >
                <Text style={styles.modalSaveText}>Save Key</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 3,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  headerTitleWrap: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111827',
  },
  onlinePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ecfdf5',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 10,
    gap: 4,
  },
  onlineDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10b981',
  },
  onlineText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#059669',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 1,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  headerIconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contextStrip: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  contextItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  contextText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#4b5563',
  },
  chatArea: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  messageRow: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-start',
  },
  messageRowUser: {
    justifyContent: 'flex-end',
  },
  messageRowAssistant: {
    justifyContent: 'flex-start',
  },
  assistantAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#ff5a36',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    marginTop: 2,
    shadowColor: '#ff5a36',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 2,
  },
  messageBubble: {
    maxWidth: '86%',
    borderRadius: 18,
    paddingHorizontal: 15,
    paddingVertical: 12,
  },
  userBubble: {
    backgroundColor: '#ff5a36',
    borderBottomRightRadius: 4,
    shadowColor: '#ff5a36',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  assistantBubble: {
    backgroundColor: '#ffffff',
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  errorBubble: {
    backgroundColor: '#fef2f2',
    borderColor: '#fecaca',
  },
  assistantHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  botBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  botBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#ff5a36',
  },
  messageTime: {
    fontSize: 10,
    color: '#9ca3af',
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
  },
  userMessageText: {
    color: '#ffffff',
    fontWeight: '500',
  },
  assistantMessageText: {
    color: '#1f2937',
  },
  errorMessageText: {
    color: '#991b1b',
  },
  userMessageTime: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.75)',
    textAlign: 'right',
    marginTop: 4,
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    gap: 6,
    alignSelf: 'flex-start',
    backgroundColor: '#fee2e2',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  retryButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#dc2626',
  },
  typingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 12,
  },
  typingBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    gap: 8,
  },
  typingLabel: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
  },
  dotsRow: {
    flexDirection: 'row',
    gap: 4,
    alignItems: 'center',
    height: 12,
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#ff5a36',
  },
  suggestionsContainer: {
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  suggestionsTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#9ca3af',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  suggestionsList: {
    gap: 8,
  },
  suggestionChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#fed7aa',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
    shadowColor: '#ff5a36',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 1,
  },
  suggestionText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#9a3412',
  },
  disclaimerFootnote: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 4,
    gap: 5,
  },
  disclaimerText: {
    fontSize: 10,
    color: '#9ca3af',
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingTop: 10,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
    gap: 10,
  },
  textInput: {
    flex: 1,
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingVertical: Platform.OS === 'ios' ? 10 : 8,
    fontSize: 14,
    color: '#111827',
    maxHeight: 90,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#ff5a36',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#ff5a36',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.28,
    shadowRadius: 6,
    elevation: 3,
  },
  sendButtonDisabled: {
    backgroundColor: '#d1d5db',
    shadowOpacity: 0,
    elevation: 0,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  modalCard: {
    width: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 22,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  modalDesc: {
    fontSize: 13,
    color: '#6b7280',
    lineHeight: 18,
    marginBottom: 16,
  },
  modalInput: {
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: '#111827',
    marginBottom: 18,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },
  modalCancelBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#f3f4f6',
  },
  modalCancelText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4b5563',
  },
  modalSaveBtn: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#ff5a36',
  },
  modalSaveText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#ffffff',
  },
});
