import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import { TouchableOpacity, Image } from "react-native";
import { useState, useEffect } from "react";
export default function ProfileScreen({
  xp,
  level,
  streak,
  moneySaved,
  savedItems = [],
}) {
  const xpForNextLevel = 100;
  const currentLevelXp = xp % 100;
  const progressPercent = (currentLevelXp / xpForNextLevel) * 100;
  const [avatar, setAvatar] = useState(null);
  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      alert("Permission required to access photos.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setAvatar(result.assets[0].uri);
    }
  };
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <View style={styles.container}>
        <TouchableOpacity onPress={pickImage}>
          {avatar ? (
            <Image source={{ uri: avatar }} style={styles.avatar} />
          ) : (
            <View style={styles.avatar} />
          )}
        </TouchableOpacity>

        <Text style={styles.username}>@abii</Text>
        <View style={styles.levelSection}>
          <Text style={styles.levelText}>Level {level}</Text>

          <View style={styles.progressBarBackground}>
            <View
              style={[styles.progressBarFill, { width: `${progressPercent}%` }]}
            />
          </View>

          <Text style={styles.progressText}>
            {currentLevelXp} / {xpForNextLevel} XP
          </Text>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{level}</Text>
            <Text style={styles.statLabel}>Level</Text>
          </View>

          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{xp}</Text>
            <Text style={styles.statLabel}>XP</Text>
          </View>

          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{streak}</Text>
            <Text style={styles.statLabel}>Streak</Text>
          </View>

          <View style={styles.statBox}>
            <Text style={styles.statNumber}>${moneySaved?.toFixed(0)}</Text>
            <Text style={styles.statLabel}>Saved</Text>
          </View>
        </View>

        <Text style={styles.savedCount}>
          {savedItems.length} items in Dream Cart
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingTop: 40,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#ddd",
  },
  username: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 15,
  },
  statsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginTop: 20,
  },
  statBox: {
    width: 120,
    alignItems: "center",
    marginVertical: 15,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: "bold",
  },
  statLabel: {
    color: "#777",
  },
  savedCount: {
    marginTop: 30,
    fontSize: 16,
    color: "#444",
  },
  levelSection: {
    width: "80%",
    marginTop: 20,
    alignItems: "center",
  },

  levelText: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
  },

  progressBarBackground: {
    width: "100%",
    height: 10,
    backgroundColor: "#eee",
    borderRadius: 5,
    overflow: "hidden",
  },

  progressBarFill: {
    height: "100%",
    backgroundColor: "#000",
  },

  progressText: {
    marginTop: 6,
    fontSize: 12,
    color: "#777",
  },
});
