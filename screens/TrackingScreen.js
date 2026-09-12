import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const steps = [
  "Order Confirmed ✅",
  "Packed 📦",
  "Shipped 🚚",
  "Out For Delivery 🏠",
  "Delivered 🎉"
];

export default function TrackingScreen({ route, navigation }) {

  const { orderTotal = 0 } = route.params || {};
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (currentStep < steps.length - 1) {
      const timer = setTimeout(() => {
        setCurrentStep(currentStep + 1);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [currentStep]);

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.container}>

        <Text style={styles.title}>Order Tracking</Text>

        <Text style={styles.amount}>
          ${orderTotal.toFixed(2)} Protected
        </Text>

        {steps.map((step, index) => (
          <Text
            key={index}
            style={[
              styles.step,
              index <= currentStep && styles.activeStep
            ]}
          >
            {step}
          </Text>
        ))}

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#111',
  },
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    color: '#d4af37',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  amount: {
    color: '#fff',
    fontSize: 20,
    marginBottom: 30,
  },
  step: {
    color: '#555',
    fontSize: 18,
    marginBottom: 15,
  },
  activeStep: {
    color: '#d4af37',
    fontWeight: 'bold',
  },
});