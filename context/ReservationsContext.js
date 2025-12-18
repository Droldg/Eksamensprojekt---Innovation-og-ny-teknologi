// Reservationer gemmes på Firestore under brugerens dokument (felt: reservedIds)
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { auth, db } from "../database/database";
import { arrayRemove, arrayUnion, collection, doc, onSnapshot, setDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

const ReservationsContext = createContext();

export function ReservationsProvider({ children }) {
  const [userId, setUserId] = useState(null);
  const [reservedIds, setReservedIds] = useState([]); // rene offer-id'er
  const [items, setItems] = useState([]); // detaljerede offers til ReservedOffersScreen
  const [loading, setLoading] = useState(true);

  // Lyt efter login/logud
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setUserId(user ? user.uid : null);
    });
    return unsub;
  }, []);

  // Lyt til brugerens reservedIds i Firestore
  useEffect(() => {
    if (!userId) {
      setReservedIds([]);
      setItems([]);
      setLoading(false);
      return undefined;
    }

    const userRef = doc(db, "users", userId);
    const unsub = onSnapshot(
      userRef,
      (snap) => {
        const data = snap.exists() ? snap.data() : {};
        const ids = Array.isArray(data.reservedIds)
          ? data.reservedIds.map((x) => String(x))
          : [];
        setReservedIds(ids);
        setLoading(false);
      },
      () => {
        setReservedIds([]);
        setItems([]);
        setLoading(false);
      }
    );

    return unsub;
  }, [userId]);

  // Lyt til hvert reserveret offer så detaljer vises opdateret
  useEffect(() => {
    if (!reservedIds.length) {
      setItems([]);
      return undefined;
    }

    // Et onSnapshot pr. id for at undgå 10-element begrænsning på "in"-queries
    const unsubscribes = reservedIds.map((id) => {
      const ref = doc(collection(db, "offers"), id);
      return onSnapshot(
        ref,
        (snap) => {
          setItems((prev) => {
            const rest = prev.filter((x) => x.id !== id);
            if (!snap.exists()) return rest;
            const data = snap.data() || {};
            const price = typeof data.price === "string" ? Number(data.price) : data.price;
            const qty = typeof data.qty === "string" ? Number(data.qty) : data.qty;
            const item = {
              id,
              title: data.title || "",
              price: Number.isFinite(price) ? price : 0,
              pickupWindow: data.pickup || "",
              items: Array.isArray(data.items) ? data.items : [],
              qty: Number.isFinite(qty) ? qty : 0,
              locID: data.locID || null,
            };
            const next = [...rest, item];
            next.sort(
              (a, b) => reservedIds.indexOf(String(a.id)) - reservedIds.indexOf(String(b.id))
            );
            return next;
          });
        },
        () => {
          setItems((prev) => prev.filter((x) => x.id !== id));
        }
      );
    });

    return () => {
      unsubscribes.forEach((fn) => fn && fn());
    };
  }, [reservedIds]);

  const add = async (offerId) => {
    if (!userId) throw new Error("Ingen bruger er logget ind.");
    const userRef = doc(db, "users", userId);
    await setDoc(
      userRef,
      { reservedIds: arrayUnion(String(offerId)) },
      { merge: true }
    );
  };

  const remove = async (offerId) => {
    if (!userId) throw new Error("Ingen bruger er logget ind.");
    const userRef = doc(db, "users", userId);
    await setDoc(
      userRef,
      { reservedIds: arrayRemove(String(offerId)) },
      { merge: true }
    );
  };

  const clear = async () => {
    if (!userId) throw new Error("Ingen bruger er logget ind.");
    const userRef = doc(db, "users", userId);
    await setDoc(userRef, { reservedIds: [] }, { merge: true });
  };

  const value = useMemo(
    () => ({
      items,
      reservedIds,
      add,
      remove,
      clear,
      loading,
    }),
    [items, reservedIds, loading]
  );

  return <ReservationsContext.Provider value={value}>{children}</ReservationsContext.Provider>;
}

export function useReservations() {
  const ctx = useContext(ReservationsContext);
  if (!ctx) throw new Error("useReservations must be used within ReservationsProvider");
  return ctx;
}
