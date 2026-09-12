import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  Animated,
  PanResponder,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width, height } = Dimensions.get("window");

export default function HomeScreen({
  xp,
  setXp,
  level,
  setLevel,
  streak,
  setStreak,
  moneySaved,
  setMoneySaved,
  savedItems,
  setSavedItems,
}) {
  const [products, setProducts] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  const pan = useRef(new Animated.ValueXY()).current;
  const heartScale = useRef(new Animated.Value(0)).current;
  const lastTap = useRef(null);
  const [lastActiveDate, setLastActiveDate] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const levelScale = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (currentIndex >= products.length - 3) {
      fetchProducts();
    }
  }, [currentIndex]);

  useEffect(() => {
    loadSavedData();
  }, []);

  useEffect(() => {
    if (isLoaded) {
      saveData();
    }
  }, [xp, level, streak, lastActiveDate, moneySaved, isLoaded]);

  const fetchProducts = async () => {
    try {
      const res = await fetch("https://fakestoreapi.com/products");
      const data = await res.json();

      setProducts((prev) => [...prev, ...data]); // Append instead of replace
      setLoading(false);
    } catch (err) {
      console.log(err);
    }
  };

  const handleSave = (item) => {
    checkStreak();
    setSavedItems((prev) => [...prev, item]);
    setMoneySaved((prev) => prev + item.price);

    setXp((prev) => {
      const updatedXp = prev + 10;
      calculateLevel(updatedXp);
      return updatedXp;
    });

    heartScale.setValue(0);
    Animated.spring(heartScale, {
      toValue: 1,
      friction: 4,
      useNativeDriver: true,
    }).start(() => heartScale.setValue(0));
  };
  const handleDoubleTap = (item) => {
    const now = Date.now();
    const DOUBLE_PRESS_DELAY = 300;

    if (lastTap.current && now - lastTap.current < DOUBLE_PRESS_DELAY) {
      handleSave(item);
    }

    lastTap.current = now;
  };

  const rotate = pan.x.interpolate({
    inputRange: [-width, 0, width],
    outputRange: ["-15deg", "0deg", "15deg"],
  });

  const opacity = pan.x.interpolate({
    inputRange: [-width, 0, width],
    outputRange: [0.7, 1, 0.7],
  });

  const nextScale = pan.x.interpolate({
    inputRange: [-width, 0, width],
    outputRange: [1, 0.95, 1],
  });

  const likeOpacity = pan.x.interpolate({
    inputRange: [0, width / 4],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });

  const nopeOpacity = pan.x.interpolate({
    inputRange: [-width / 4, 0],
    outputRange: [1, 0],
    extrapolate: "clamp",
  });

  const calculateLevel = (newXp) => {
    const newLevel = Math.floor(newXp / 100) + 1;

    if (newLevel > level) {
      triggerLevelUp();
    }

    setLevel(newLevel);
  };

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,

    onPanResponderMove: Animated.event([null, { dx: pan.x }], {
      useNativeDriver: false,
    }),

    onPanResponderRelease: (_, gesture) => {
      if (gesture.dx > 120) {
        handleSave(products[currentIndex]);
        forceSwipe("right");
      } else if (gesture.dx < -120) {
        setXp((prev) => {
          const updatedXp = prev + 2;
          calculateLevel(updatedXp);
          return updatedXp;
        });
        checkStreak();
        forceSwipe("left");
      } else {
        resetPosition();
      }
    },
  });

  const forceSwipe = (direction) => {
    Animated.timing(pan, {
      toValue: {
        x: direction === "right" ? width : -width,
        y: 0,
      },
      duration: 250,
      useNativeDriver: false,
    }).start(() => onSwipeComplete());
  };

  const onSwipeComplete = () => {
    pan.setValue({ x: 0, y: 0 });
    setCurrentIndex((prev) => prev + 1);
  };

  const checkStreak = () => {
    const today = new Date().toDateString();

    if (!lastActiveDate) {
      setLastActiveDate(today);
      return;
    }

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    if (lastActiveDate === yesterday.toDateString()) {
      setStreak((prev) => prev + 1);
    } else if (lastActiveDate !== today) {
      setStreak(1);
    }

    setLastActiveDate(today);
  };

  const loadSavedData = async () => {
    try {
      const keys = ["xp", "level", "streak", "lastActiveDate", "moneySaved"];

      const stores = await AsyncStorage.multiGet(keys);

      stores.forEach(([key, value]) => {
        if (value !== null) {
          if (key === "xp") setXp(parseInt(value));
          if (key === "level") setLevel(parseInt(value));
          if (key === "streak") setStreak(parseInt(value));
          if (key === "lastActiveDate") setLastActiveDate(value);
          if (key === "moneySaved") setMoneySaved(parseFloat(value));
        }
      });

      setIsLoaded(true);
    } catch (error) {
      console.log(error);
    }
  };

  const saveData = async () => {
    try {
      await AsyncStorage.setItem("xp", xp.toString());
      await AsyncStorage.setItem("level", level.toString());
      await AsyncStorage.setItem("streak", streak.toString());
      await AsyncStorage.setItem("lastActiveDate", lastActiveDate || "");
      await AsyncStorage.setItem("moneySaved", moneySaved.toString());
    } catch (error) {
      console.log(error);
    }
  };

  const triggerLevelUp = () => {
    setShowLevelUp(true);
    levelScale.setValue(0);

    Animated.spring(levelScale, {
      toValue: 1,
      friction: 4,
      useNativeDriver: true,
    }).start(() => {
      setTimeout(() => {
        setShowLevelUp(false);
      }, 1500);
    });
  };

  const resetPosition = () => {
    Animated.spring(pan, {
      toValue: { x: 0, y: 0 },
      friction: 5,
      useNativeDriver: false,
    }).start();
  };

  if (loading || products.length === 0) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const currentProduct = products[currentIndex % products.length];
  const nextProduct = products[(currentIndex + 1) % products.length];

  return (
    <View style={styles.container}>
      <View style={styles.levelContainer}>
        <Text style={styles.levelText}>
          Level {level} • {xp} XP
        </Text>
      </View>
      <View style={styles.streakContainer}>
        <Text style={styles.streakText}>🔥 {streak} Day Streak</Text>
      </View>
      {/* Money Counter */}
      <View style={styles.moneyCounter}>
        <Text style={styles.moneyText}>💰 ${moneySaved.toFixed(2)}</Text>
      </View>

      {/* Next Card */}
      {nextProduct && (
        <Animated.View
          onTouchEnd={() => handleDoubleTap(currentProduct)}
          style={[styles.nextCard, { transform: [{ scale: nextScale }] }]}
        >
          {/* LIKE Overlay */}
          <Animated.View
            style={[styles.likeContainer, { opacity: likeOpacity }]}
          >
            <Text style={styles.likeText}>SAVE 💰</Text>
          </Animated.View>

          {/* SKIP Overlay */}
          <Animated.View
            style={[styles.nopeContainer, { opacity: nopeOpacity }]}
          >
            <Text style={styles.nopeText}>SKIP ❌</Text>
          </Animated.View>
          <Image
            source={{ uri: nextProduct.image }}
            style={styles.image}
            resizeMode="contain"
          />
        </Animated.View>
      )}

      {/* Current Card */}
      {currentProduct && (
        <Animated.View
          style={[
            styles.card,
            {
              transform: [{ translateX: pan.x }, { rotate: rotate }],
              opacity: opacity,
            },
          ]}
          {...panResponder.panHandlers}
        >
          <Image
            source={{ uri: currentProduct.image }}
            style={styles.image}
            resizeMode="contain"
          />

          <View style={styles.info}>
            <Text style={styles.title}>{currentProduct.title}</Text>
            <Text style={styles.price}>${currentProduct.price}</Text>
          </View>
        </Animated.View>
      )}

      {/* Heart Animation */}
      <Animated.View
        style={[styles.heart, { transform: [{ scale: heartScale }] }]}
        pointerEvents="none"
      >
        <Text style={{ fontSize: 100 }}>❤️</Text>
      </Animated.View>

      {showLevelUp && (
        <Animated.View
          style={[
            styles.levelUpOverlay,
            { transform: [{ scale: levelScale }] },
          ]}
        >
          <Text style={styles.levelUpText}>🎉 LEVEL UP!</Text>
          <Text style={styles.levelUpSub}>You reached Level {level}</Text>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  card: {
    position: "absolute",
    width: width,
    height: height,
    backgroundColor: "#fff",
    justifyContent: "center",
  },
  nextCard: {
    position: "absolute",
    width: width,
    height: height,
    backgroundColor: "#f3f3f3",
    justifyContent: "center",
  },
  image: {
    width: "100%",
    height: "60%",
  },
  info: {
    padding: 20,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
  },
  price: {
    fontSize: 18,
    marginTop: 10,
  },
  moneyCounter: {
    position: "absolute",
    top: 60,
    right: 20,
    zIndex: 10,
    backgroundColor: "#000",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  moneyText: {
    color: "#fff",
    fontWeight: "bold",
  },
  heart: {
    position: "absolute",
    top: height / 2 - 50,
    left: width / 2 - 50,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  likeContainer: {
    position: "absolute",
    top: 100,
    left: 40,
    zIndex: 10,
    transform: [{ rotate: "-20deg" }],
  },

  likeText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "green",
  },
  streakContainer: {
    position: "absolute",
    top: 110,
    left: 20,
    zIndex: 10,
    backgroundColor: "#ff6600",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },

  streakText: {
    color: "#fff",
    fontWeight: "bold",
  },
  nopeContainer: {
    position: "absolute",
    top: 100,
    right: 40,
    zIndex: 10,
    transform: [{ rotate: "20deg" }],
  },

  nopeText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "red",
  },

  levelContainer: {
    position: "absolute",
    top: 60,
    left: 20,
    zIndex: 10,
    backgroundColor: "#000",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },

  levelText: {
    color: "#fff",
    fontWeight: "bold",
  },

  levelUpOverlay: {
    position: "absolute",
    top: height / 2 - 100,
    left: 40,
    right: 40,
    backgroundColor: "#000",
    padding: 30,
    borderRadius: 20,
    alignItems: "center",
  },

  levelUpText: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "bold",
  },

  levelUpSub: {
    color: "#fff",
    marginTop: 10,
    fontSize: 16,
  },
});
