import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, FlatList } from 'react-native';

export default function FloatingChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: '1', role: 'assistant', text: "Hi! I'm your CareConnect assistant. How can I help you today?" },
  ]);
  const [input, setInput] = useState('');
  const listRef = useRef(null);

  const send = () => {
    const text = input.trim();
    if (!text) return;
    setMessages((prev) => [...prev, { id: String(Date.now()), role: 'user', text }]);
    setInput('');
    setTimeout(() => {
      const canned = [
        'You can donate in the Donate tab. We accept monetary and item donations.',
        'Your gift supports pediatric care and family assistance. Thank you!',
        'See Impact tab for real-time allocation and progress.',
      ];
      const reply = canned[Math.floor(Math.random() * canned.length)];
      setMessages((prev) => [...prev, { id: String(Date.now() + 1), role: 'assistant', text: reply }]);
      listRef.current?.scrollToEnd?.({ animated: true });
    }, 800);
  };

  return (
    <View pointerEvents="box-none" style={styles.root}>
      {open && (
        <View style={styles.panel}>
          <View style={styles.header}>
            <Text style={styles.headerText}>🤖 CareConnect Assistant</Text>
            <TouchableOpacity onPress={() => setOpen(false)} accessibilityRole="button"><Text style={styles.headerText}>×</Text></TouchableOpacity>
          </View>
          <FlatList
            ref={listRef}
            data={messages}
            keyExtractor={(m) => m.id}
            contentContainerStyle={{ padding: 12, gap: 8 }}
            renderItem={({ item }) => (
              <View style={[styles.bubble, item.role === 'assistant' ? styles.assistant : styles.user]}>
                <Text style={item.role === 'assistant' ? styles.assistantText : styles.userText}>{item.text}</Text>
              </View>
            )}
          />
          <View style={styles.composer}>
            <TextInput
              style={styles.input}
              placeholder="Type a message..."
              value={input}
              onChangeText={setInput}
              onSubmitEditing={send}
              returnKeyType="send"
            />
            <TouchableOpacity style={styles.sendBtn} onPress={send} accessibilityRole="button">
              <Text style={styles.sendText}>Send</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      <TouchableOpacity style={styles.fab} onPress={() => setOpen((v) => !v)} accessibilityRole="button">
        <Text style={styles.fabText}>💬</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { position: 'absolute', bottom: 20, right: 20, left: 20 },
  panel: {
    position: 'absolute', bottom: 80, right: 0, width: 320, maxHeight: 420,
    backgroundColor: '#ffffff', borderRadius: 12, overflow: 'hidden',
    shadowColor: '#000', shadowOpacity: 0.16, shadowRadius: 20, shadowOffset: { width: 0, height: 10 },
    borderWidth: 1, borderColor: '#e5e7eb'
  },
  header: { backgroundColor: '#2563eb', padding: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerText: { color: '#ffffff', fontWeight: '700' },
  bubble: { padding: 10, borderRadius: 10, maxWidth: '85%' },
  assistant: { backgroundColor: '#f1f5f9', alignSelf: 'flex-start' },
  user: { backgroundColor: '#2563eb', alignSelf: 'flex-end' },
  assistantText: { color: '#1f2937' },
  userText: { color: '#ffffff' },
  composer: { flexDirection: 'row', alignItems: 'center', padding: 8, gap: 8, borderTopWidth: 1, borderTopColor: '#e5e7eb' },
  input: { flex: 1, borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 999, paddingHorizontal: 12, paddingVertical: 8 },
  sendBtn: { backgroundColor: '#2563eb', paddingVertical: 8, paddingHorizontal: 14, borderRadius: 999 },
  sendText: { color: '#ffffff', fontWeight: '700' },
  fab: { position: 'absolute', bottom: 0, right: 0, width: 56, height: 56, borderRadius: 28, backgroundColor: '#2563eb', alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOpacity: .16, shadowRadius: 20, shadowOffset: { width:0, height:10 } },
  fabText: { color: '#ffffff', fontSize: 22 },
});


