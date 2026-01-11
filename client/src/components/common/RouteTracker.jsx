import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import ReactGA from "react-ga4";

const RouteTracker = () => {
  const location = useLocation();

  useEffect(() => {
    // Jab bhi location (URL) change hoga, Google ko signal bhejega
    ReactGA.send({ hitType: "pageview", page: location.pathname + location.search });
  }, [location]);

  return null; // Yeh screen par kuch dikhata nahi hai, bas background mein kaam karta hai
};

export default RouteTracker;