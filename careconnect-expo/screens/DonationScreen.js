import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, ScrollView, TouchableOpacity, Dimensions, Linking } from 'react-native';
import Card from '../components/ui/Card';
import PrimaryButton from '../components/ui/PrimaryButton';
import DonationWidget from '../components/DonationWidget';
import { useSelector } from 'react-redux';
import { donationService, paymentService } from '../services/apiService';

const { width } = Dimensions.get('window');

export default function DonationScreen({ navigation, route }) {
  const [donationType, setDonationType] = useState('money');
  const [amount, setAmount] = useState('');
  const [inkindDescription, setInkindDescription] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [addMessage, setAddMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [confirmation, setConfirmation] = useState(null);
  const [paymentInfo, setPaymentInfo] = useState(null); // { id, checkout_url, qr_image_url }

  const user = useSelector((state) => state.user.user);

  const quickAmounts = [25, 50, 100, 250, 500];
  const paymentMethods = [
    { id: 'card', name: 'Credit/Debit Card', icon: '💳', url: null },
    { id: 'paypal', name: 'PayPal', icon: '🅿️', url: 'https://www.paypal.com' },
    { id: 'gcash', name: 'GCash', icon: '📱', url: 'https://www.gcash.com' },
    { id: 'maya', name: 'Maya', icon: '💚', url: 'https://www.maya.ph' }
  ];

  // Prefill from patient code if navigated from PatientNeeds
  useEffect(() => {
    const patientCode = route?.params?.patientCode;
    if (patientCode) {
      setSelectedPatient({ code: patientCode });
    }
  }, [route?.params?.patientCode]);

  const featuredPatients = [
    {
      id: 1,
      name: 'Sarah',
      age: 8,
      condition: 'Leukemia',
      progress: 65,
      goal: 50000,
      raised: 32500,
      image: '👧',
      story: 'Sarah loves painting and dreams of becoming an artist. She needs help with her treatment costs.'
    },
    {
      id: 2,
      name: 'Michael',
      age: 12,
      condition: 'Brain Tumor',
      progress: 40,
      goal: 75000,
      raised: 30000,
      image: '👦',
      story: 'Michael is a talented soccer player who wants to get back on the field after his treatment.'
    },
    {
      id: 3,
      name: 'Emma',
      age: 6,
      condition: 'Neuroblastoma',
      progress: 80,
      goal: 40000,
      raised: 32000,
      image: '👧',
      story: 'Emma loves animals and wants to be a veterinarian when she grows up.'
    }
  ];

  const donationCategories = [
    {
      id: 'medical',
      name: 'Medical Treatment',
      description: 'Help cover treatment costs',
      icon: '🏥',
      color: '#ef4444'
    },
    {
      id: 'research',
      name: 'Research Fund',
      description: 'Support cancer research',
      icon: '🔬',
      color: '#3b82f6'
    },
    {
      id: 'family',
      name: 'Family Support',
      description: 'Help families with expenses',
      icon: '👨‍👩‍👧‍👦',
      color: '#10b981'
    },
    {
      id: 'general',
      name: 'General Fund',
      description: 'Where it\'s needed most',
      icon: '💝',
      color: '#8b5cf6'
    }
  ];

  const handleDonate = async () => {
    if (donationType === 'money' && !amount) {
      Alert.alert('Error', 'Please enter an amount');
      return;
    }
    if (donationType === 'inkind' && !inkindDescription) {
      Alert.alert('Error', 'Please describe the in-kind donation');
      return;
    }

    try {
      setSubmitting(true);
      const payload = donationType === 'money'
        ? {
            type: 'monetary',
            amount: parseFloat(amount),
            item: null,
            note: addMessage || undefined,
            recipient_code: selectedPatient?.code,
          }
        : {
            type: 'inkind',
            item: inkindDescription,
            amount: null,
            note: addMessage || undefined,
            recipient_code: selectedPatient?.code,
          };

      const created = await donationService.createDonation(payload);

      if (donationType === 'money' && paymentMethod === 'gcash') {
        // Create GCash payment intent
        const intent = await paymentService.createGcashIntent({
          amount: parseFloat(amount),
          currency: 'PHP',
          description: `Donation ${created?.id || ''}`,
          donation_id: created?.id,
        });
        setPaymentInfo(intent);

        if (intent.checkout_url) {
          Linking.openURL(intent.checkout_url).catch(() => {});
        }

        // Poll for payment status
        let attempts = 0;
        const maxAttempts = 30; // ~2.5 minutes if 5s interval
        const poll = setInterval(async () => {
          attempts += 1;
          try {
            const status = await paymentService.getPaymentStatus(intent.id);
            if (status.status === 'paid') {
              clearInterval(poll);
              setConfirmation({
                id: created?.id || intent.id,
                amount: amount,
                type: donationType,
                method: 'GCash',
              });
            } else if (status.status === 'failed') {
              clearInterval(poll);
              Alert.alert('Payment Failed', 'Your GCash payment did not complete. You can try again.');
            }
            if (attempts >= maxAttempts) clearInterval(poll);
          } catch (_) {
            if (attempts >= maxAttempts) clearInterval(poll);
          }
        }, 5000);
      }

      setConfirmation({
        id: created?.id || Math.random().toString(36).slice(2, 10),
        amount: donationType === 'money' ? amount : undefined,
        type: donationType,
        method: paymentMethods.find(m => m.id === paymentMethod)?.name,
      });
    } catch (e) {
      Alert.alert('Error', 'Could not process your donation. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const renderDonationType = () => (
    <Card style={styles.section}>
      <Text style={styles.sectionTitle}>Donation Type</Text>
      <View style={styles.typeButtons}>
        <TouchableOpacity
          style={[styles.typeButton, donationType === 'money' && styles.activeTypeButton]}
          onPress={() => setDonationType('money')}
        >
          <Text style={styles.typeIcon}>💰</Text>
          <Text style={[styles.typeText, donationType === 'money' && styles.activeTypeText]}>
            Monetary
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.typeButton, donationType === 'inkind' && styles.activeTypeButton]}
          onPress={() => setDonationType('inkind')}
        >
          <Text style={styles.typeIcon}>📦</Text>
          <Text style={[styles.typeText, donationType === 'inkind' && styles.activeTypeText]}>
            In-kind
          </Text>
        </TouchableOpacity>
      </View>
    </Card>
  );

  const renderAmountSection = () => {
    if (donationType === 'money') {
      return (
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Donation Amount</Text>
          
          {/* Quick Amount Buttons */}
          <View style={styles.quickAmounts}>
            {quickAmounts.map((quickAmount) => (
              <TouchableOpacity
                key={quickAmount}
                style={[styles.quickAmountButton, amount === quickAmount.toString() && styles.selectedQuickAmount]}
                onPress={() => setAmount(quickAmount.toString())}
              >
                <Text style={[styles.quickAmountText, amount === quickAmount.toString() && styles.selectedQuickAmountText]}>
                  ${quickAmount}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Custom Amount Input */}
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
      );
    } else {
      return (
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
      );
    }
  };

  const renderDonationStatus = () => (
    <Card style={styles.section}>
      <Text style={styles.sectionTitle}>Donation Status</Text>
      <Text style={styles.sectionSubtitle}>Choose the status of your donation</Text>
      
      <View style={styles.statusGrid}>
        {donationCategories.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={[styles.statusCard, selectedPatient?.id === category.id && styles.selectedStatusCard]}
            onPress={() => setSelectedPatient({ id: category.id, name: category.name })}
          >
            <View style={[styles.statusIcon, { backgroundColor: category.color }]}>
              <Text style={styles.statusIconText}>{category.icon}</Text>
            </View>
            <Text style={styles.statusName}>{category.name}</Text>
            <Text style={styles.statusDescription}>{category.description}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </Card>
  );

  const renderDonationCategories = () => (
    <Card style={styles.section}>
      <Text style={styles.sectionTitle}>Donation Category</Text>
      <View style={styles.categoriesGrid}>
        {donationCategories.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={styles.categoryCard}
            onPress={() => {
              // You could add category selection logic here
              console.log('Selected category:', category.id);
            }}
          >
            <View style={[styles.categoryIcon, { backgroundColor: category.color }]}>
              <Text style={styles.categoryIconText}>{category.icon}</Text>
            </View>
            <Text style={styles.categoryName}>{category.name}</Text>
            <Text style={styles.categoryDescription}>{category.description}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </Card>
  );

  const renderPaymentMethod = () => (
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
  );

  const renderAdditionalOptions = () => (
    <Card style={styles.section}>
      <Text style={styles.sectionTitle}>Additional Options</Text>
      
      <TouchableOpacity
        style={styles.optionRow}
        onPress={() => setIsAnonymous(!isAnonymous)}
      >
        <View style={styles.optionContent}>
          <Text style={styles.optionTitle}>Make Anonymous Donation</Text>
          <Text style={styles.optionDescription}>Your name won't be shown publicly</Text>
        </View>
        <View style={[styles.checkbox, isAnonymous && styles.checkedBox]}>
          {isAnonymous && <Text style={styles.checkmark}>✓</Text>}
        </View>
      </TouchableOpacity>

      <View style={styles.messageContainer}>
        <Text style={styles.inputLabel}>Personal Message (Optional)</Text>
        <TextInput
          style={styles.messageInput}
          placeholder="Add a message of support..."
          value={addMessage}
          onChangeText={setAddMessage}
          multiline
          numberOfLines={3}
          textAlignVertical="top"
        />
      </View>
    </Card>
  );

  const renderConfirmation = () => {
    if (!confirmation) return null;
    return (
      <Card style={styles.section}>
        <Text style={styles.sectionTitle}>Thank you! 🎉</Text>
        <Text style={styles.sectionSubtitle}>Your donation has been recorded.</Text>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Reference:</Text>
          <Text style={styles.summaryValue}>{confirmation.id}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Type:</Text>
          <Text style={styles.summaryValue}>{confirmation.type === 'money' ? 'Monetary' : 'In-kind'}</Text>
        </View>
        {!!confirmation.amount && (
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Amount:</Text>
            <Text style={styles.summaryValue}>${confirmation.amount}</Text>
          </View>
        )}
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Payment:</Text>
          <Text style={styles.summaryValue}>{confirmation.method}</Text>
        </View>
        <View style={{ flexDirection: 'row', gap: 8, marginTop: 12 }}>
          <TouchableOpacity style={[styles.paymentMethod, { flex: 1 }]} onPress={() => navigation.navigate('DonationHistory')}>
            <Text style={styles.paymentName}>View My Donations</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.paymentMethod, { flex: 1 }]} onPress={() => navigation.navigate('Home')}>
            <Text style={styles.paymentName}>Back to Home</Text>
          </TouchableOpacity>
        </View>
      </Card>
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <Text style={styles.title}>Make a Donation</Text>
        <Text style={styles.description}>
          Support pediatric cancer patients and their families. Every contribution makes a difference.
        </Text>
      </View>

      <DonationWidget
        donationType={donationType}
        setDonationType={setDonationType}
        amount={amount}
        setAmount={setAmount}
        inkindDescription={inkindDescription}
        setInkindDescription={setInkindDescription}
        paymentMethod={paymentMethod}
        setPaymentMethod={setPaymentMethod}
      />
      {renderDonationStatus()}
      {renderAdditionalOptions()}

      <View style={styles.donationSummary}>
        <Text style={styles.summaryTitle}>Donation Summary</Text>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Type:</Text>
          <Text style={styles.summaryValue}>{donationType === 'money' ? 'Monetary' : 'In-kind'}</Text>
        </View>
        {donationType === 'money' && amount && (
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Amount:</Text>
            <Text style={styles.summaryValue}>${amount}</Text>
          </View>
        )}
        {selectedPatient && (
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Supporting:</Text>
            <Text style={styles.summaryValue}>{selectedPatient.name}</Text>
          </View>
        )}
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Payment:</Text>
          <Text style={styles.summaryValue}>{paymentMethods.find(m => m.id === paymentMethod)?.name}</Text>
        </View>
      </View>

      {!confirmation && (
        <PrimaryButton
          title={donationType === 'money' ? `Donate $${amount || '0'}` : 'Submit In-kind Donation'}
          onPress={handleDonate}
          style={styles.donateButton}
          disabled={submitting || (donationType === 'money' ? !amount : !inkindDescription)}
        />
      )}

      {paymentInfo && !confirmation && (
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Complete Payment with GCash</Text>
          <Text style={styles.sectionSubtitle}>A checkout window should open. If not, tap the button below.</Text>
          <TouchableOpacity style={styles.paymentMethod} onPress={() => paymentInfo?.checkout_url && Linking.openURL(paymentInfo.checkout_url)}>
            <Text style={styles.paymentName}>Open GCash Checkout</Text>
          </TouchableOpacity>
        </Card>
      )}

      {renderConfirmation()}
      
      <TouchableOpacity
        style={styles.backToHomeButton}
        onPress={() => navigation.navigate('Home')}
      >
        <Text style={styles.backToHomeText}>← Back to Home</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f7fb',
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  header: {
    marginBottom: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2d3436',
    marginBottom: 8,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#636e72',
    textAlign: 'center',
    lineHeight: 22,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2d3436',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 16,
  },
  typeButtons: {
    flexDirection: 'row',
    gap: 12,
  },
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
  activeTypeButton: {
    borderColor: '#3b82f6',
    backgroundColor: '#eff6ff',
  },
  typeIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  typeText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6b7280',
  },
  activeTypeText: {
    color: '#3b82f6',
  },
  quickAmounts: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  quickAmountButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e1e5e9',
    backgroundColor: 'white',
  },
  selectedQuickAmount: {
    borderColor: '#3b82f6',
    backgroundColor: '#eff6ff',
  },
  quickAmountText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
  },
  selectedQuickAmountText: {
    color: '#3b82f6',
  },
  customAmountContainer: {
    marginTop: 8,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    backgroundColor: 'white',
    paddingHorizontal: 12,
  },
  dollarSign: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6b7280',
    marginRight: 4,
  },
  amountInput: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: '#2d3436',
    paddingVertical: 12,
  },
  itemInput: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: 'white',
    minHeight: 100,
  },
  patientCard: {
    borderWidth: 1,
    borderColor: '#e1e5e9',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    backgroundColor: 'white',
  },
  selectedPatientCard: {
    borderColor: '#3b82f6',
    backgroundColor: '#eff6ff',
  },
  patientHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  patientImage: {
    fontSize: 32,
    marginRight: 12,
  },
  patientInfo: {
    flex: 1,
  },
  patientName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2d3436',
  },
  patientCondition: {
    fontSize: 14,
    color: '#6b7280',
  },
  patientProgress: {
    alignItems: 'center',
  },
  progressText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#10b981',
  },
  progressBar: {
    height: 6,
    backgroundColor: '#e1e5e9',
    borderRadius: 3,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#10b981',
    borderRadius: 3,
  },
  patientStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  statText: {
    fontSize: 12,
    color: '#6b7280',
  },
  patientStory: {
    fontSize: 14,
    color: '#6b7280',
    fontStyle: 'italic',
  },
  statusGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statusCard: {
    width: (width - 56) / 2,
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#e1e5e9',
  },
  selectedStatusCard: {
    borderColor: '#3b82f6',
    backgroundColor: '#eff6ff',
  },
  statusIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusIconText: {
    fontSize: 24,
  },
  statusName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2d3436',
    textAlign: 'center',
    marginBottom: 4,
  },
  statusDescription: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  categoryCard: {
    width: (width - 56) / 2,
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#e1e5e9',
  },
  categoryIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryIconText: {
    fontSize: 24,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2d3436',
    textAlign: 'center',
    marginBottom: 4,
  },
  categoryDescription: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
  },
  paymentMethods: {
    gap: 8,
  },
  paymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e1e5e9',
    backgroundColor: 'white',
  },
  selectedPaymentMethod: {
    borderColor: '#3b82f6',
    backgroundColor: '#eff6ff',
  },
  paymentIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  paymentName: {
    fontSize: 16,
    color: '#6b7280',
  },
  selectedPaymentText: {
    color: '#3b82f6',
    fontWeight: '600',
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2d3436',
    marginBottom: 2,
  },
  optionDescription: {
    fontSize: 14,
    color: '#6b7280',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#d1d5db',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkedBox: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  checkmark: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  messageContainer: {
    marginTop: 16,
  },
  messageInput: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: 'white',
    minHeight: 80,
  },
  donationSummary: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e1e5e9',
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2d3436',
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#6b7280',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2d3436',
  },
  donateButton: {
    marginTop: 8,
  },
  backToHomeButton: {
    marginTop: 20,
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    alignItems: 'center',
  },
  backToHomeText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3b82f6',
  },
});