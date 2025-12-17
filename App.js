import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import HomeScreen from "./screens/HomeScreen";
import OffersScreen from "./screens/OffersScreen";
import ReservedOffersScreen from "./screens/ReservedOffersScreen"; // <-- NY
import InfoScreen from "./screens/InfoScreen";
import Authentication from "./screens/Authentication";
import ProfileScreen from "./screens/ProfileScreen";
import CanteenPanel from "./screens/CanteenPanel";

// Firebase auth 
import { auth } from "./database/database";
import { onAuthStateChanged } from "firebase/auth";

// Global reservations-state (fra vores tidligere trin)
import { ReservationsProvider } from "./context/ReservationsContext";

const Stack = createNativeStackNavigator();

export default function App() {
  const [user, setUser] = useState(null);

  // Lyt efter login/logud
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, setUser);
    return unsub;
  }, []);

  return (
    <ReservationsProvider>
      <NavigationContainer>
        {user ? (
          // Appen når man ER logget ind
          <Stack.Navigator>
            <Stack.Screen
              name="Home"
              component={HomeScreen}
              options={{ title: "MadRedder" }}
            />
            <Stack.Screen
              name="Offers"
              component={OffersScreen}
              options={{ title: "Tilbud" }}
            />
            <Stack.Screen
              name="ReservedOffers"
              component={ReservedOffersScreen}
              options={{ title: "Reserveret tilbud" }}
            />
            <Stack.Screen
              name="Profile"
              component={ProfileScreen}
              options={{ title: "Min profil" }}
            />
            <Stack.Screen
              name="Info"
              component={InfoScreen}
              options={{ title: "Info" }}
            />
            <Stack.Screen
              name="CanteenPanel"
              component={CanteenPanel}
              options={{ title: "Kantinepanel" }}
            />
          </Stack.Navigator>
        ) : (
          // Auth-flow når man IKKE er logget ind (Login/Signup)
          <Stack.Navigator>
            <Stack.Screen
              name="Auth"
              component={Authentication}
              options={{ headerShown: false }}
            />
          </Stack.Navigator>
        )}
      </NavigationContainer>
    </ReservationsProvider>
  );
}
