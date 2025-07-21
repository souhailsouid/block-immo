// prop-types is a library for typechecking of props
import PropTypes from 'prop-types';

// react-flatpickr components
import Flatpickr from 'react-flatpickr';

// react-flatpickr styles
import 'flatpickr/dist/flatpickr.css';

// Material Dashboard 3 PRO React components
import MDInput from 'components/MDInput';

// CSS personnalisé pour Flatpickr
const flatpickrStyles = `
  .flatpickr-day.today {
    color: #000 !important;
    background: #fff !important;
    border-color: #ddd !important;
  }
  
  .flatpickr-day.today:hover {
    background: #f0f0f0 !important;
    color: #000 !important;
  }
  
  .flatpickr-day.today.selected {
    background: #4472c4 !important;
    color: #fff !important;
    border-color: #4472c4 !important;
  }
  
  .flatpickr-day.selected {
    background: #4472c4 !important;
    color: #fff !important;
    border-color: #4472c4 !important;
  }
  
  .flatpickr-day.selected:hover {
    background: #3a5f9e !important;
    color: #fff !important;
  }
`;

const MDDatePicker = ({
  input = {},
  label,
  value,
  onChange,
  onBlur,
  name,
  variant = 'standard',
  ...rest
}) => {
  const handleChange = (selectedDates, dateStr) => {
    if (onChange) {
      // Simuler un événement natif pour Formik
      const syntheticEvent = {
        target: {
          name: name,
          value: dateStr,
        },
      };
      onChange(syntheticEvent);
    }
  };

  const handleBlur = () => {
    if (onBlur) {
      const syntheticEvent = {
        target: {
          name: name,
        },
      };
      onBlur(syntheticEvent);
    }
  };

  // Convertir la valeur en format compatible avec Flatpickr
  const getFlatpickrValue = () => {
    if (!value) return undefined;

    // Si c'est une string, la convertir en Date
    if (typeof value === 'string') {
      return new Date(value);
    }

    // Si c'est déjà une Date
    if (value instanceof Date) {
      return value;
    }

    return undefined;
  };

  return (
    <>
      <style>{flatpickrStyles}</style>
      <Flatpickr
        {...rest}
        value={getFlatpickrValue()}
        onChange={handleChange}
        onBlur={handleBlur}
        options={{
          allowInput: false,
          clickOpens: true,
          dateFormat: 'Y-m-d',
          disableMobile: false,
          ...rest.options,
        }}
        render={({ defaultValue }, ref) => {
          return (
            <MDInput
              sx={{ width: '100%' }}
              {...input}
              shrink={true}
              defaultValue={value || defaultValue}
              inputRef={ref}
              label={label}
              name={name}
              variant={variant}
              readOnly
            />
          );
        }}
      />
    </>
  );
};

// Typechecking props for the MDDatePicker
MDDatePicker.propTypes = {
  input: PropTypes.objectOf(PropTypes.any),
  label: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  name: PropTypes.string,
  variant: PropTypes.string,
};

export default MDDatePicker;
