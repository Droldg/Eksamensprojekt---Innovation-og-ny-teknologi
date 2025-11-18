// context/LocationContext.js
import React, { createContext, useContext, useState } from "react";

const LocationContext = createContext();

export const LocationProvider = ({ children }) => {
  // locationId bliver den 4-cifrede kode for den lokation, brugeren arbejder på
  const [locationId, setLocationId] = useState(null);

  return (
    <LocationContext.Provider value={{ locationId, setLocationId }}>
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => useContext(LocationContext);
