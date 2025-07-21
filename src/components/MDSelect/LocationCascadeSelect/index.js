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
  const { values } = useFormikContext();
  const countries = getAllCountries();
  const [stateOptions, setStateOptions] = useState([]);
  const [cityOptions, setCityOptions] = useState([]);

  // Initialize state options if country is already selected
  const getCountryCode = () => {
    const country = countries.find((country) => country.value === values.country);
    return country.code;
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
          label="State/Region"
          name={stateField}
          options={stateOptions}
          placeholder="Select State/Region"
        />
      )}
      {cityOptions.length > 0 ? (
        <FormFieldSelect
          label="City"
          name={cityField}
          options={cityOptions}
          placeholder="Select City"
        />
      ) : (
        <FormField label="City" name={cityField} placeholder="Enter City" />
      )}
    </MDBox>
  );
};

export default LocationCascadeSelect;
