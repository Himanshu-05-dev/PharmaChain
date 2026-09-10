import React from 'react';
import { View, Text, StyleSheet, Platform, StyleProp, TextStyle, ViewStyle } from 'react-native';

interface MarkdownTextProps {
  content: string;
  isUser?: boolean;
  isError?: boolean;
  style?: StyleProp<TextStyle>;
}

/**
 * Renders inline markdown tokens:
 * - ***bold italic***
 * - **bold** or __bold__
 * - *italic* or _italic_
 * - `inline code`
 */
function renderInlineSegments(text: string, baseStyle: StyleProp<TextStyle>, isUser: boolean) {
  // Matches ***...***, **...**, __...__, *...*, _..._, `...`
  const tokenRegex = /(\*\*\*[^*]+\*\*\*|\*\*[^*]+\*\*|__[^_]+__|\*[^*]+\*|_[^_]+_|`[^`]+`)/g;
  const parts = text.split(tokenRegex);

  return parts.map((part, index) => {
    if (!part) return null;

    if (part.startsWith('***') && part.endsWith('***') && part.length > 6) {
      return (
        <Text key={index} style={[baseStyle, styles.bold, styles.italic]}>
          {part.slice(3, -3)}
        </Text>
      );
    }

    if ((part.startsWith('**') && part.endsWith('**') && part.length > 4) ||
        (part.startsWith('__') && part.endsWith('__') && part.length > 4)) {
      return (
        <Text key={index} style={[baseStyle, styles.bold, isUser ? styles.userBold : styles.assistantBold]}>
          {part.slice(2, -2)}
        </Text>
      );
    }

    if ((part.startsWith('*') && part.endsWith('*') && part.length > 2) ||
        (part.startsWith('_') && part.endsWith('_') && part.length > 2)) {
      return (
        <Text key={index} style={[baseStyle, styles.italic]}>
          {part.slice(1, -1)}
        </Text>
      );
    }

    if (part.startsWith('`') && part.endsWith('`') && part.length > 2) {
      return (
        <Text
          key={index}
          style={[
            baseStyle,
            styles.inlineCode,
            isUser ? styles.userInlineCode : styles.assistantInlineCode,
          ]}
        >
          {part.slice(1, -1)}
        </Text>
      );
    }

    return (
      <Text key={index} style={baseStyle}>
        {part}
      </Text>
    );
  });
}

export const MarkdownText: React.FC<MarkdownTextProps> = ({
  content,
  isUser = false,
  isError = false,
  style,
}) => {
  const baseTextStyle: StyleProp<TextStyle> = [
    styles.defaultText,
    isUser ? styles.userText : styles.assistantText,
    isError && styles.errorText,
    style,
  ];

  if (!content) return null;

  // Split into lines for block-level parsing
  const lines = content.replace(/\r\n/g, '\n').split('\n');
  const elements: React.ReactNode[] = [];
  let inCodeBlock = false;
  let codeBlockBuffer: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const trimmed = rawLine.trim();

    // Check for code block fences ```
    if (trimmed.startsWith('```')) {
      if (inCodeBlock) {
        // End of code block
        elements.push(
          <View
            key={`code-${i}`}
            style={[
              styles.codeBlockCard,
              isUser ? styles.userCodeBlock : styles.assistantCodeBlock,
            ]}
          >
            <Text
              style={[
                styles.codeBlockText,
                isUser ? styles.userCodeText : styles.assistantCodeText,
              ]}
            >
              {codeBlockBuffer.join('\n')}
            </Text>
          </View>
        );
        codeBlockBuffer = [];
        inCodeBlock = false;
      } else {
        // Start of code block
        inCodeBlock = true;
        codeBlockBuffer = [];
      }
      continue;
    }

    if (inCodeBlock) {
      codeBlockBuffer.push(rawLine);
      continue;
    }

    // Empty line (paragraph spacer)
    if (!trimmed) {
      // Don't add multiple spacers consecutively
      if (elements.length > 0 && i < lines.length - 1 && lines[i + 1].trim()) {
        elements.push(<View key={`spacer-${i}`} style={styles.paragraphSpacer} />);
      }
      continue;
    }

    // Horizontal Rule: ---, ***, ___
    if (/^(\-{3,}|\*{3,}|_{3,})$/.test(trimmed)) {
      elements.push(
        <View
          key={`hr-${i}`}
          style={[
            styles.hrLine,
            isUser ? styles.userHrLine : styles.assistantHrLine,
          ]}
        />
      );
      continue;
    }

    // Heading 1: # Heading
    if (trimmed.startsWith('# ')) {
      elements.push(
        <Text key={`h1-${i}`} style={[baseTextStyle, styles.h1]}>
          {renderInlineSegments(trimmed.slice(2), [baseTextStyle, styles.h1], isUser)}
        </Text>
      );
      continue;
    }

    // Heading 2: ## Heading
    if (trimmed.startsWith('## ')) {
      elements.push(
        <Text key={`h2-${i}`} style={[baseTextStyle, styles.h2]}>
          {renderInlineSegments(trimmed.slice(3), [baseTextStyle, styles.h2], isUser)}
        </Text>
      );
      continue;
    }

    // Heading 3: ### Heading
    if (trimmed.startsWith('### ')) {
      elements.push(
        <Text key={`h3-${i}`} style={[baseTextStyle, styles.h3]}>
          {renderInlineSegments(trimmed.slice(4), [baseTextStyle, styles.h3], isUser)}
        </Text>
      );
      continue;
    }

    // Blockquote: > text
    if (trimmed.startsWith('> ')) {
      elements.push(
        <View
          key={`quote-${i}`}
          style={[
            styles.blockquote,
            isUser ? styles.userBlockquote : styles.assistantBlockquote,
          ]}
        >
          <Text style={[baseTextStyle, styles.blockquoteText]}>
            {renderInlineSegments(trimmed.slice(2), [baseTextStyle, styles.blockquoteText], isUser)}
          </Text>
        </View>
      );
      continue;
    }

    // Numbered List: 1. item, 2. item, etc.
    const numberedMatch = trimmed.match(/^(\d+)\.\s+(.*)$/);
    if (numberedMatch) {
      const num = numberedMatch[1];
      const itemText = numberedMatch[2];
      elements.push(
        <View key={`num-${i}`} style={styles.listRow}>
          <Text
            style={[
              styles.listNumber,
              isUser ? styles.userListBullet : styles.assistantListBullet,
            ]}
          >
            {num}.
          </Text>
          <Text style={[baseTextStyle, styles.listContent]}>
            {renderInlineSegments(itemText, baseTextStyle, isUser)}
          </Text>
        </View>
      );
      continue;
    }

    // Bullet List: - item, * item, • item
    const bulletMatch = trimmed.match(/^[-*•]\s+(.*)$/);
    if (bulletMatch) {
      const itemText = bulletMatch[1];
      elements.push(
        <View key={`bullet-${i}`} style={styles.listRow}>
          <Text
            style={[
              styles.listBullet,
              isUser ? styles.userListBullet : styles.assistantListBullet,
            ]}
          >
            •
          </Text>
          <Text style={[baseTextStyle, styles.listContent]}>
            {renderInlineSegments(itemText, baseTextStyle, isUser)}
          </Text>
        </View>
      );
      continue;
    }

    // Regular text paragraph
    elements.push(
      <Text key={`p-${i}`} style={[baseTextStyle, styles.paragraph]}>
        {renderInlineSegments(trimmed, baseTextStyle, isUser)}
      </Text>
    );
  }

  // Flush any open code block
  if (inCodeBlock && codeBlockBuffer.length > 0) {
    elements.push(
      <View
        key="code-end"
        style={[
          styles.codeBlockCard,
          isUser ? styles.userCodeBlock : styles.assistantCodeBlock,
        ]}
      >
        <Text
          style={[
            styles.codeBlockText,
            isUser ? styles.userCodeText : styles.assistantCodeText,
          ]}
        >
          {codeBlockBuffer.join('\n')}
        </Text>
      </View>
    );
  }

  return <View style={styles.container}>{elements}</View>;
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  defaultText: {
    fontSize: 14.5,
    lineHeight: 21,
    letterSpacing: 0.1,
  },
  userText: {
    color: '#ffffff',
  },
  assistantText: {
    color: '#1f2937',
  },
  errorText: {
    color: '#b91c1c',
  },
  paragraph: {
    marginBottom: 3,
  },
  paragraphSpacer: {
    height: 6,
  },
  bold: {
    fontWeight: '700',
  },
  italic: {
    fontStyle: 'italic',
  },
  userBold: {
    color: '#ffffff',
    fontWeight: '800',
  },
  assistantBold: {
    color: '#111827',
    fontWeight: '700',
  },
  inlineCode: {
    fontSize: 13,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 4,
  },
  userInlineCode: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    color: '#ffffff',
  },
  assistantInlineCode: {
    backgroundColor: '#f3f4f6',
    color: '#ea580c',
    borderWidth: 0.5,
    borderColor: '#e5e7eb',
  },
  h1: {
    fontSize: 17,
    fontWeight: '800',
    marginTop: 6,
    marginBottom: 4,
    lineHeight: 23,
  },
  h2: {
    fontSize: 15.5,
    fontWeight: '700',
    marginTop: 5,
    marginBottom: 3,
    lineHeight: 22,
  },
  h3: {
    fontSize: 14.5,
    fontWeight: '700',
    marginTop: 4,
    marginBottom: 2,
    lineHeight: 20,
  },
  listRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginVertical: 2,
    paddingLeft: 2,
  },
  listBullet: {
    fontSize: 16,
    lineHeight: 21,
    marginRight: 6,
    fontWeight: '700',
  },
  listNumber: {
    fontSize: 13.5,
    lineHeight: 21,
    marginRight: 6,
    fontWeight: '700',
    minWidth: 16,
  },
  userListBullet: {
    color: '#ffffff',
  },
  assistantListBullet: {
    color: '#ff5a36',
  },
  listContent: {
    flex: 1,
  },
  blockquote: {
    borderLeftWidth: 3,
    paddingLeft: 10,
    paddingVertical: 4,
    marginVertical: 4,
    borderRadius: 2,
  },
  userBlockquote: {
    borderLeftColor: 'rgba(255, 255, 255, 0.6)',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  assistantBlockquote: {
    borderLeftColor: '#ff5a36',
    backgroundColor: '#fff7ed',
  },
  blockquoteText: {
    fontStyle: 'italic',
    fontSize: 13.5,
  },
  codeBlockCard: {
    borderRadius: 8,
    padding: 10,
    marginVertical: 6,
  },
  userCodeBlock: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  assistantCodeBlock: {
    backgroundColor: '#1e293b',
  },
  codeBlockText: {
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    fontSize: 12.5,
    lineHeight: 18,
  },
  userCodeText: {
    color: '#f8fafc',
  },
  assistantCodeText: {
    color: '#f1f5f9',
  },
  hrLine: {
    height: 1,
    marginVertical: 8,
  },
  userHrLine: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  assistantHrLine: {
    backgroundColor: '#e5e7eb',
  },
});

export default MarkdownText;
