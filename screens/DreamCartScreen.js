import React from "react";
import { View, Text, FlatList, Image, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { TouchableOpacity } from "react-native";
import { Modal } from "react-native";
import { useState } from "react";

export default function DreamCartScreen({
  savedItems,
  setSavedItems,
  orders,
  setOrders,
  navigation,
}) {
  const [showModal, setShowModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [processing, setProcessing] = useState(false);
  const total = savedItems.reduce((sum, item) => sum + item.price, 0);
  const handleCheckout = () => {
    if (savedItems.length === 0) return;

    const newOrder = {
      id: Date.now(),
      items: savedItems,
      total: total, // ✅ use existing total
      date: new Date().toLocaleDateString(),
    };

    setOrders((prevOrders) => [...prevOrders, newOrder]);

    setSavedItems([]);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <View style={styles.container}>
        <Text style={styles.title}>Dream Cart</Text>

        <Text style={styles.total}>Total: ${total.toFixed(2)}</Text>

        <TouchableOpacity
          style={styles.checkoutButton}
          onPress={() => setShowModal(true)}
        >
          <Text style={styles.checkoutText}>Checkout (Simulated)</Text>
        </TouchableOpacity>

        <FlatList
          data={savedItems}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={{ paddingBottom: 100 }}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Image
                source={{ uri: item.image }}
                style={styles.image}
                resizeMode="contain"
              />
              <View style={{ flex: 1 }}>
                <Text numberOfLines={2} style={styles.itemTitle}>
                  {item.title}
                </Text>
                <Text style={styles.price}>${item.price}</Text>
              </View>
            </View>
          )}
        />

        {/* CONFIRM MODAL */}
        <Modal visible={showModal} transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.modalBox}>
              <Text style={styles.modalTitle}>Confirm Simulated Purchase?</Text>

              <TouchableOpacity
                style={styles.checkoutButton}
                onPress={() => {
                  setShowModal(false);
                  setProcessing(true);

                  setTimeout(() => {
                    handleCheckout(); // ✅ only runs here
                    setProcessing(false);
                    navigation.navigate("Tracking", {
                      orderTotal: total,
                    });
                  }, 2000);
                }}
              >
                <Text style={styles.checkoutText}>Confirm</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => setShowModal(false)}>
                <Text style={{ marginTop: 10 }}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* SUCCESS MODAL */}
        <Modal visible={showSuccess} transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.modalBox}>
              <Text style={{ fontSize: 20, fontWeight: "bold" }}>
                ✅ Success!
              </Text>

              <Text style={{ marginTop: 10 }}>
                You didn’t spend ${total.toFixed(2)}
              </Text>

              <TouchableOpacity
                style={[styles.checkoutButton, { marginTop: 20 }]}
                onPress={() => setShowSuccess(false)} // ✅ JUST CLOSE
              >
                <Text style={styles.checkoutText}>Nice 😎</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* PROCESSING MODAL */}
        <Modal visible={processing} transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.modalBox}>
              <Text style={{ fontSize: 18, fontWeight: "bold" }}>
                Processing Payment...
              </Text>
              <Text style={{ marginTop: 10 }}>
                Charging your WindowShop Gold Card
              </Text>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginTop: 10,
  },
  total: {
    fontSize: 18,
    marginVertical: 10,
  },
  card: {
    flexDirection: "row",
    marginVertical: 10,
    alignItems: "center",
  },
  image: {
    width: 80,
    height: 80,
    marginRight: 15,
  },
  itemTitle: {
    fontWeight: "600",
  },
  price: {
    marginTop: 4,
    fontWeight: "bold",
  },
  checkoutButton: {
    backgroundColor: "#000",
    padding: 15,
    borderRadius: 15,
    alignItems: "center",
    marginVertical: 15,
  },

  checkoutText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },

  modalBox: {
    width: "80%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 15,
    alignItems: "center",
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
});
