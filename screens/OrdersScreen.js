import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Swipeable } from "react-native-gesture-handler";
import { TouchableOpacity } from "react-native";

export default function OrdersScreen({ orders = [], setOrders }) {
  const deleteOrder = (id) => {
    setOrders((prev) => prev.filter((order) => order.id !== id));
  };
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <View style={styles.container}>
        <Text style={styles.title}>Order History</Text>

        {orders.length === 0 ? (
          <Text style={styles.empty}>No orders yet</Text>
        ) : (
          <FlatList
            data={orders}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <Swipeable
                renderRightActions={() => (
                  <TouchableOpacity
                    style={styles.deleteBox}
                    onPress={() => deleteOrder(item.id)}
                  >
                    <Text style={styles.deleteText}>Delete</Text>
                  </TouchableOpacity>
                )}
              >
                <View style={styles.card}>
                  <Text style={styles.total}>
                    You Didn’t Spend: ${item.total.toFixed(2)}
                  </Text>
                  <Text style={styles.date}>{item.date}</Text>
                </View>
              </Swipeable>
            )}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  empty: {
    marginTop: 50,
    textAlign: "center",
    color: "#777",
  },
  card: {
    padding: 15,
    backgroundColor: "#f2f2f2",
    borderRadius: 12,
    marginBottom: 15,
  },
  total: {
    fontWeight: "bold",
    fontSize: 16,
  },
  date: {
    marginTop: 5,
    color: "#777",
  },
  deleteBox: {
  backgroundColor: 'red',
  justifyContent: 'center',
  alignItems: 'center',
  width: 100,
  borderRadius: 12,
  marginBottom: 15,
},

deleteText: {
  color: '#fff',
  fontWeight: 'bold',
},
});
