import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function VirtualCardScreen({ moneySaved = 0 }) {

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.container}>

        <Text style={styles.title}>WindowShop Gold</Text>

        <View style={styles.card}>
          <Text style={styles.brand}>WINDOWSHOP</Text>

          <Text style={styles.number}>
            4242 4242 4242 4242
          </Text>

          <View style={styles.bottomRow}>
            <View>
              <Text style={styles.label}>EXP</Text>
              <Text style={styles.value}>12/28</Text>
            </View>

            <View>
              <Text style={styles.label}>CVV</Text>
              <Text style={styles.value}>123</Text>
            </View>
          </View>
        </View>

        <View style={styles.balanceBox}>
          <Text style={styles.balanceLabel}>
            Wealth Preserved
          </Text>
          <Text style={styles.balance}>
            ${moneySaved.toFixed(2)}
          </Text>
        </View>

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
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    color: '#d4af37',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 40,
  },
  card: {
    width: '100%',
    height: 200,
    backgroundColor: '#d4af37',
    borderRadius: 20,
    padding: 20,
    justifyContent: 'space-between',
    shadowColor: '#d4af37',
    shadowOpacity: 0.6,
    shadowRadius: 15,
    elevation: 10,
  },
  brand: {
    color: '#111',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 2,
  },
  number: {
    color: '#111',
    fontSize: 18,
    letterSpacing: 3,
    fontWeight: '600',
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  label: {
    color: '#333',
    fontSize: 12,
  },
  value: {
    color: '#111',
    fontSize: 14,
    fontWeight: '600',
  },
  balanceBox: {
    marginTop: 40,
    alignItems: 'center',
  },
  balanceLabel: {
    color: '#aaa',
    fontSize: 14,
  },
  balance: {
    color: '#d4af37',
    fontSize: 32,
    fontWeight: 'bold',
    marginTop: 5,
  },
});