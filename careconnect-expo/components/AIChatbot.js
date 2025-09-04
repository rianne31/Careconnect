import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Button, FlatList } from 'react-native';

function localResponder(input) {
  const text = input.trim().toLowerCase();
  if (!text) return 'How can I help with donations, auctions, or impact?';
  if (text.includes('donat')) return 'Consider recurring donations for stable support.';
  if (text.includes('impact')) return 'Check the Impact tab for real-time allocation and progress.';
  if (text.includes('auction')) return 'Explore current auctions in the Auctions tab.';
  return 'Thanks! I will pass this to our team. Meanwhile, see the Home and Impact tabs for suggestions.';
}

export default function AIChatbot() {
  const [messages, setMessages] = useState([
    { id: 'sys-1', role: 'assistant', text: 'Hi! I am your CareConnect assistant.' },
  ]);
  const [input, setInput] = useState('');

  const send = () => {
    const userText = input.trim();
    if (!userText) return;
    const reply = localResponder(userText);
    const next = [
      ...messages,
      { id: String(Date.now()), role: 'user', text: userText },
      { id: String(Date.now() + 1), role: 'assistant', text: reply },
    ];
    setMessages(next);
    setInput('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Chat Assistant</Text>
      <FlatList
        style={styles.list}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[styles.bubble, item.role === 'assistant' ? styles.assistant : styles.user]}>
            <Text style={styles.text}>{item.text}</Text>
          </View>
        )}
      />
      <View style={styles.composer}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="Type a message..."
        />
        <Button title="Send" onPress={send} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    marginBottom: 16,
    maxHeight: 380,
  },
  title: { fontSize: 18, fontWeight: 'bold', color: '#2d3436', marginBottom: 8 },
  list: { flexGrow: 0, maxHeight: 260 },
  bubble: { padding: 10, borderRadius: 10, marginBottom: 8 },
  assistant: { backgroundColor: '#dfe6e9', alignSelf: 'flex-start' },
  user: { backgroundColor: '#6c5ce7', alignSelf: 'flex-end' },
  text: { color: '#2d3436' },
  composer: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  input: { flex: 1, borderWidth: 1, borderColor: '#dfe6e9', borderRadius: 8, padding: 10 },
});


