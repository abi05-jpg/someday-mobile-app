import React, { useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SafeAreaProvider } from "react-native-safe-area-context";

import HomeScreen from "./HomeScreen";
import DreamCartScreen from "./DreamCartScreen";
import OrdersScreen from "./OrdersScreen";
import VirtualCardScreen from "./VirtualCardScreen";
import TrackingScreen from "./TrackingScreen";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

export default function App() {
  const [savedItems, setSavedItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [moneySaved, setMoneySaved] = useState(0);

  function MainTabs() {
    return (
      <Tab.Navigator screenOptions={{ headerShown: false }}>
        
        <Tab.Screen name="Home">
          {() => (
            <HomeScreen
              savedItems={savedItems}
              setSavedItems={setSavedItems}
              moneySaved={moneySaved}
              setMoneySaved={setMoneySaved}
            />
          )}
        </Tab.Screen>

        <Tab.Screen name="Cart">
          {({ navigation }) => (
            <DreamCartScreen
              navigation={navigation}
              savedItems={savedItems}
              setSavedItems={setSavedItems}
              orders={orders}
              setOrders={setOrders}
              moneySaved={moneySaved}
              setMoneySaved={setMoneySaved}
            />
          )}
        </Tab.Screen>

        <Tab.Screen name="Orders">
          {() => (
            <OrdersScreen
              orders={orders}
              setOrders={setOrders}
            />
          )}
        </Tab.Screen>

        <Tab.Screen name="Card">
          {() => (
            <VirtualCardScreen moneySaved={moneySaved} />
          )}
        </Tab.Screen>

      </Tab.Navigator>
    );
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="MainTabs" component={MainTabs} />
          <Stack.Screen name="Tracking" component={TrackingScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}