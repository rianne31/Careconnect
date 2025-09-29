import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import Card from './ui/Card';

export default function DonationWidget({
  donationType,
  setDonationType,
  amount,
  setAmount,
  inkindDescription,
  setInkindDescription,
  paymentMethod,
  setPaymentMethod,
  quickAmounts = [25, 50, 100, 250, 500],
}) {
  const paymentMethods = useMemo(() => ([
    { id: 'card', name: 'Credit/Debit Card', icon: '💳' },
    { id: 'paypal', name: 'PayPal', icon: '🅿️' },
    { id: 'gcash', name: 'GCash', icon: '📱' },
    { id: 'maya', name: 'Maya', icon: '💚' },
  ]), []);

  return (
    <View>
      <Card style={styles.section}>
        <Text style={styles.sectionTitle}>Donation Type</Text>
        <View style={styles.typeButtons}>
          {[
            { id: 'money', label: 'Monetary', icon: '💰' },
            { id: 'inkind', label: 'In-kind', icon: '📦' },
          ].map((t) => (
            <TouchableOpacity
              key={t.id}
              style={[styles.typeButton, donationType === t.id && styles.activeTypeButton]}
              onPress={() => setDonationType(t.id)}
            >
              <Text style={styles.typeIcon}>{t.icon}</Text>
              <Text style={[styles.typeText, donationType === t.id && styles.activeTypeText]}>{t.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </Card>

      {donationType === 'money' ? (
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Donation Amount</Text>
          <View style={styles.quickAmounts}>
            {quickAmounts.map((qa) => (
              <TouchableOpacity
                key={qa}
                style={[styles.quickAmountButton, amount === String(qa) && styles.selectedQuickAmount]}
                onPress={() => setAmount(String(qa))}
              >
                <Text style={[styles.quickAmountText, amount === String(qa) && styles.selectedQuickAmountText]}>${qa}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.customAmountContainer}>
            <Text style={styles.inputLabel}>Custom Amount</Text>
            <View style={styles.amountInputContainer}>
              <Text style={styles.dollarSign}>$</Text>
              <TextInput
                style={styles.amountInput}
                placeholder="0.00"
                value={amount}
                onChangeText={setAmount}
                keyboardType="numeric"
                placeholderTextColor="#9ca3af"
              />
            </View>
          </View>
        </Card>
      ) : (
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>In-kind Description</Text>
          <TextInput
            style={styles.itemInput}
            placeholder="Describe the in-kind donation you'd like to make..."
            value={inkindDescription}
            onChangeText={setInkindDescription}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </Card>
      )}

      <Card style={styles.section}>
        <Text style={styles.sectionTitle}>Payment Method</Text>
        <View style={styles.paymentMethods}>
          {paymentMethods.map((method) => (
            <TouchableOpacity
              key={method.id}
              style={[styles.paymentMethod, paymentMethod === method.id && styles.selectedPaymentMethod]}
              onPress={() => setPaymentMethod(method.id)}
            >
              <Text style={styles.paymentIcon}>{method.icon}</Text>
              <Text style={[styles.paymentName, paymentMethod === method.id && styles.selectedPaymentText]}>
                {method.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  section: { marginBottom: 20 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#2d3436', marginBottom: 8 },
  typeButtons: { flexDirection: 'row', gap: 12 },
  typeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e1e5e9',
    backgroundColor: 'white',
  },
  activeTypeButton: { borderColor: '#3b82f6', backgroundColor: '#eff6ff' },
  typeIcon: { fontSize: 20, marginRight: 8 },
  typeText: { fontSize: 16, fontWeight: '600', color: '#6b7280' },
  activeTypeText: { color: '#3b82f6' },
  quickAmounts: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  quickAmountButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e1e5e9',
    backgroundColor: 'white',
  },
  selectedQuickAmount: { borderColor: '#3b82f6', backgroundColor: '#eff6ff' },
  quickAmountText: { fontSize: 14, fontWeight: '600', color: '#6b7280' },
  selectedQuickAmountText: { color: '#3b82f6' },
  customAmountContainer: { marginTop: 8 },
  inputLabel: { fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 8 },
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    backgroundColor: 'white',
    paddingHorizontal: 12,
  },
  dollarSign: { fontSize: 18, fontWeight: '600', color: '#6b7280', marginRight: 4 },
  amountInput: { flex: 1, fontSize: 18, fontWeight: '600', color: '#2d3436', paddingVertical: 12 },
  itemInput: { borderWidth: 1, borderColor: '#d1d5db', borderRadius: 8, padding: 12, fontSize: 16, backgroundColor: 'white', minHeight: 100 },
  paymentMethods: { gap: 8 },
  paymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e1e5e9',
    backgroundColor: 'white',
  },
  selectedPaymentMethod: { borderColor: '#3b82f6', backgroundColor: '#eff6ff' },
  paymentIcon: { fontSize: 20, marginRight: 12 },
  paymentName: { fontSize: 16, color: '#6b7280' },
  selectedPaymentText: { color: '#3b82f6', fontWeight: '600' },
});


