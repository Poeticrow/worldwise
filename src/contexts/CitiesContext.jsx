import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  // useState,
} from "react";

const BASE_URL = "http://localhost:8050/";

const CitiesContext = createContext();

const initialState = {
  cities: [],
  isLoading: false,
  currentCity: {},
  error: "",
};
function reducer(state, action) {
  switch (action.type) {
    case "loading":
      return { ...state, isLoading: true };
    case "cities/fetched":
      return {
        ...state,
        cities: action.payload,
        isLoading: false,
      };
    case "city/loaded":
      return {
        ...state,
        currentCity: action.payload,
        isLoading: false,
      };
    case "city/deleted":
      return {
        ...state,
        isLoading: false,
        cities: state.cities.filter((city) => city.id !== action.payload),
        currentCity: {},
      };
    case "city/created":
      return {
        ...state,
        isLoading: false,
        cities: [...state.cities, action.payload],
        currentCity: action.payload,
      };
    case "rejected":
      return {
        ...state,
        isLoading: false,
        cities: [...state.cities, action.payload],
      };
    default:
      throw new Error("Unknown action");
  }
}

function CitiesProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(function () {
    async function fetchCities() {
      try {
        dispatch({ type: "loading" });
        const res = await fetch(`${BASE_URL}cities`);
        const data = await res.json();
        dispatch({ type: "cities/fetched", payload: data });
      } catch (err) {
        dispatch({ payload: "Error fetching cities", type: "rejected" });
      }
    }

    fetchCities();
  }, []);

  async function getCity(id) {
    if (Number(id) === state.currentCity.id) return;
    try {
      dispatch({ type: "loading" });
      const res = await fetch(`${BASE_URL}cities/${id}`);
      const data = await res.json();
      dispatch({ type: "city/loaded", payload: data });
    } catch (err) {
      dispatch({ payload: "Error loading cities", type: "rejected" });
    }
  }

  async function createCity(newCity) {
    try {
      dispatch({ type: "loading" });
      const res = await fetch(`${BASE_URL}cities/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newCity),
      });
      const data = await res.json();
      dispatch({ type: "city/created", payload: data });
      //
    } catch (err) {
      dispatch({ payload: "Error creating cities", type: "rejected" });
    }
  }

  async function deleteCity(id) {
    try {
      dispatch({ type: "loading" });
      await fetch(`${BASE_URL}cities/${id}`, {
        method: "DELETE",
      });

      dispatch({ type: "city/deleted", payload: id });
    } catch (err) {
      dispatch({ payload: "Error deleting cities", type: "rejected" });
    }
  }

  return (
    <CitiesContext.Provider
      value={{
        cities: state.cities,
        isLoading: state.isLoading,
        currentCity: state.currentCity,
        getCity,
        createCity,
        deleteCity,
      }}
    >
      {children}
    </CitiesContext.Provider>
  );
}

function useCities() {
  const context = useContext(CitiesContext);
  if (context === undefined)
    throw new Error("CitiesContext was used outside the citiesProvider");
  return context;
}

export { CitiesProvider, useCities };
