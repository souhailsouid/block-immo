// @mui material components
import Grid from '@mui/material/Grid';
import Autocomplete from '@mui/material/Autocomplete';

// Material Kit 2 PRO React components
import MDBox from 'components/MDBox';
import MDInput from 'components/MDInput';

const MDDropdowns = ({ options, placeholder, value, onChange, onBlur, name, multiple = false }) => {
  // Utiliser les clés fournies par les données ou en créer de nouvelles si nécessaire
  const optionsWithKeys = options.map((option, index) => ({
    ...option,
    key: option.key || `${option.value}-${index}`
  }));

  const handleChange = (_event, newValue) => {
    if (onChange) {
      if (multiple) {
        // Pour la sélection multiple, newValue est un tableau
        const syntheticEvent = {
          target: {
            name: name,
            value: newValue || [],
          },
        };
        onChange(syntheticEvent);
      } else {
        // Pour la sélection simple, newValue est un objet ou null
        const syntheticEvent = {
          target: {
            name: name,
            value: newValue ? newValue.value : '',
          },
        };
        onChange(syntheticEvent);
      }
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

  // Fonction pour obtenir la valeur affichée
  const getDisplayValue = () => {
    if (multiple) {
      // Pour la sélection multiple, on retourne un tableau d'objets
      if (Array.isArray(value)) {
        return value.map(v => optionsWithKeys.find(opt => opt.value === v)).filter(Boolean);
      }
      return [];
    } else {
      // Pour la sélection simple, on retourne l'objet correspondant
      if (value) {
        return optionsWithKeys.find(opt => opt.value === value) || null;
      }
      return null;
    }
  };

  return (
    <MDBox>
      <Grid item xs={12} md={12}>
        <Autocomplete
          value={getDisplayValue()}
          options={optionsWithKeys}
          onChange={handleChange}
          onBlur={handleBlur}
          multiple={multiple}
          freeSolo={false}
          autoComplete={true}
          autoHighlight={true}
          getOptionLabel={(option) => option.label || ''}
          isOptionEqualToValue={(option, value) => option.value === value.value}
          renderInput={(params) => (
            <MDInput {...params} variant="standard" placeholder={placeholder} />
          )}
        />
      </Grid>
    </MDBox>
  );
};

export default MDDropdowns;
