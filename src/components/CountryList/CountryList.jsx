import styles from "./CountryList.module.css";
import Spinner from "../Spinner/Spinner";
import CountryItem from "../CountryItem/CountryItem";
import Message from "../Message/Message";
import { useCities } from "../../contexts/CitiesContext";

// eslint-disable-next-line
function CountryList() {
  const { cities, isLoading } = useCities();
  // eslint-disable-next-line
  const countries = cities.reduce((arr, city) => {
    if (!arr.map((el) => el.country).includes(city.country)) {
      return [
        ...arr,
        { country: city.country, emoji: city.emoji, id: city.id },
      ];
    } else return arr;
  }, []);
  if (isLoading) return <Spinner />;
  // eslint-disable-next-line
  if (!cities.length)
    return <Message message="Add your first clicking inside your map" />;
  return (
    <ul className={styles.countryList}>
      {/* eslint-disable-next-line*/}
      {countries.map((countries) => (
        <CountryItem country={countries} key={countries.id} />
      ))}
    </ul>
  );
}

export default CountryList;
