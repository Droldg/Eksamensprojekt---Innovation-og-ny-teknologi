// Hjælpefunktioner til at håndtere reservationer (tilføj, fjern, ryd) og gemme dem i AsyncStorage
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ReservationsContext = createContext();

export function ReservationsProvider({ children }) {
  const [items, setItems] = useState([]); // [{id, title, price, pickupWindow, image, ...}]

  // persistens
  useEffect(() => {
    AsyncStorage.getItem("reservations").then(json => {
      if (json) setItems(JSON.parse(json));
    });
  }, []);
  useEffect(() => {
    AsyncStorage.setItem("reservations", JSON.stringify(items));
  }, [items]);

  const add = (offer) =>
    setItems((prev) => (prev.some(x => x.id === offer.id) ? prev : [...prev, offer]));
  const remove = (id) => setItems((prev) => prev.filter(x => x.id !== id));
  const clear = () => setItems([]);

  const value = useMemo(() => ({ items, add, remove, clear }), [items]);
  return <ReservationsContext.Provider value={value}>{children}</ReservationsContext.Provider>;
}

export function useReservations() {
  const ctx = useContext(ReservationsContext);
  if (!ctx) throw new Error("useReservations must be used within ReservationsProvider");
  return ctx;
}
