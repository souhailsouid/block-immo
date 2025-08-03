import { useState, useEffect } from 'react';
import { useFormikContext } from 'formik';
import MDBox from 'components/MDBox';
import FormFieldSelect from 'components/FormFieldSelect';
import {
  getAllCountries,
  getStatesByCountry,
  getCitiesByState,
  getCitiesByCountry,
} from 'utils/locations';
import FormField from 'layouts/pages/users/new-user/components/FormField';

const LocationCascadeSelect = ({
  countryField = 'country',
  stateField = 'state',
  cityField = 'city',
  showState = true,
}) => {
  const { values, setFieldValue } = useFormikContext();
  const countries = getAllCountries();
  const [stateOptions, setStateOptions] = useState([]);
  const [cityOptions, setCityOptions] = useState([]);

  // Initialize state options if country is already selected
  const getCountryCode = () => {
    const country = countries?.find((country) => country.value === values.country);
    return country?.code;
  };

  useEffect(() => {
    if (values.country) {
      const states = getStatesByCountry(getCountryCode());
      setStateOptions(states);
    } else {
      setStateOptions([]);
    }
  }, [values.country]);

  // Update cities when state changes
  useEffect(() => {
    if (values.country && values.state) {
      // Get cities for the specific state
      const cities = getCitiesByState(getCountryCode(), values.state);
      setCityOptions(cities);
    } else if (values.country && !values.state) {
      // If no state selected, get all cities for the country
      const cities = getCitiesByCountry(getCountryCode());
      setCityOptions(cities);
    } else {
      setCityOptions([]);
    }
  }, [values.country, values.state]);

  // Corriger la casse de la ville si nécessaire
  useEffect(() => {
    if (values[cityField] && cityOptions.length > 0) {
      const cityValue = values[cityField];
      const matchingCity = cityOptions.find(option => 
        option.value.toLowerCase() === cityValue.toLowerCase()
      );
      
      if (matchingCity && matchingCity.value !== cityValue) {
        // Mettre à jour avec la bonne casse
        setFieldValue(cityField, matchingCity.value);
      }
    }
  }, [cityOptions, values[cityField], cityField, setFieldValue]);

  return (
    <MDBox>
      <FormFieldSelect
        label="Country"
        name={countryField}
        options={countries}
        placeholder="Select Country"
      />

      {showState && (
        <FormFieldSelect
          key={stateField}
          label="State/Region"
          name={stateField}
          options={stateOptions}
          placeholder="Select State/Region"
        />
      )}
      
      {cityOptions.length > 0 ? (
        <FormFieldSelect
          key={cityField}
          label="City"
          name={cityField}
          options={cityOptions}
          placeholder="Select City"
        />
      ) : (
        <FormField 
          label="City" 
          name={cityField} 
          key={cityField} 
          placeholder="Enter City" 
        />
      )}
    </MDBox>
  );
};

export default LocationCascadeSelect;
