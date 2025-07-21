// prop-type is a library for typechecking of props
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { ErrorMessage } from 'formik';
// @mui material components
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import Icon from '@mui/material/Icon';

// Material Dashboard 3 PRO React components
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';
import MDButton from 'components/MDButton';

// NewUser page components
import InputFileUpload from 'examples/Uploads/Button';

const KYCFile = ({ formData }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const { formField, values, errors, touched, setValues } = formData;
  const { kycFile } = formField;
  const { kycFile: kycFileV } = values;

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);

      // Vérifier le type de fichier
      const isPDF = file.type === 'application/pdf';
      const isImage = file.type.startsWith('image/');

      if (isImage || isPDF) {
        // Créer un URL pour le preview
        const url = window.URL.createObjectURL(file);
        setPreviewUrl(url);
      }

      // Mettre à jour la valeur dans le formulaire
      setValues({ ...values, [kycFile.name]: file.name });
    }
  };

  // Fonction pour nettoyer les URLs créées
  const cleanupPreviewUrl = () => {
    if (previewUrl) {
      window.URL.revokeObjectURL(previewUrl);
    }
  };

  // Nettoyer l'URL quand le composant se démonte ou quand le fichier change
  useEffect(() => {
    return () => {
      cleanupPreviewUrl();
    };
  }, [previewUrl]);

  // Fonction pour déterminer le type de preview
  const getPreviewType = () => {
    if (!selectedFile) return null;
    return selectedFile.type === 'application/pdf' ? 'pdf' : 'image';
  };

  return (
    <MDBox>
      {/* Header Section */}
      <MDBox mb={4}>
        <MDTypography variant="h4" fontWeight="bold" color="dark" mb={2}>
          Vérification d&apos;identité
        </MDTypography>
      </MDBox>

      {/* Main Content */}
      <MDBox>
        <Grid container spacing={4}>
          {/* Upload Section */}
          <Grid item xs={12} lg={6}>
            <Card
              sx={{
                p: 3,
                borderRadius: 3,
                boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
                border: '1px solid rgba(0,0,0,0.05)',
                background: 'linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)',
                height: 'fit-content',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <MDBox textAlign="center" mb={3}>
                <MDBox
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #4472c4 0%, #5a8fd8 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 16px',
                    boxShadow: '0 4px 20px rgba(68, 114, 196, 0.3)',
                  }}
                >
                  <Icon sx={{ color: 'white', fontSize: 40 }}>camera_alt</Icon>
                </MDBox>
                <MDTypography variant="h6" fontWeight="bold" color="dark" mb={1}>
                  Téléchargez votre passeport
                </MDTypography>
                <MDTypography variant="body2" color="text" mb={3}>
                  Assurez-vous que l&apos;image est claire et que tous les détails sont visibles
                </MDTypography>
              </MDBox>

              <InputFileUpload
                name={kycFile.name}
                value={kycFileV}
                error={errors.kycFile && touched.kycFile}
                success={kycFileV && kycFileV.length > 0 && !errors.kycFile}
                onChange={handleFileChange}
                variant="contained"
                color="primary"
                size="large"
                fullWidth
                label="Sélectionner une image de passeport"
                disabled={false}
                sx={{
                  background: 'linear-gradient(135deg, #4472c4 0%, #5a8fd8 100%)',
                  color: '#fff',
                  borderRadius: '12px',
                  padding: '16px 24px',
                  fontSize: '16px',
                  fontWeight: '600',
                  textTransform: 'none',
                  boxShadow: '0 4px 16px rgba(68, 114, 196, 0.3)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #3a5f9e 0%, #4a7bc8 100%)',
                    boxShadow: '0 6px 20px rgba(68, 114, 196, 0.4)',
                    transform: 'translateY(-2px)',
                  },
                  '&:disabled': {
                    background: 'linear-gradient(135deg, #a0a0a0 0%, #b0b0b0 100%)',
                    color: '#fff',
                    transform: 'none',
                  },
                }}
              />
              <MDBox mt={0.75}>
                <MDTypography component="div" variant="caption" color="error" fontWeight="regular">
                  <ErrorMessage name={kycFile.name} />
                </MDTypography>
              </MDBox>
          
              {kycFileV && kycFileV.length > 0 && !errors.kycFile && (
                <MDTypography
                  variant="caption"
                  color="success"
                  fontWeight="medium"
                  display="block"
                  mb={1}
                >
                  Image téléchargée avec succès
                </MDTypography>
              )}
              {/* Instructions */}
              <MDBox
                mt={3}
                p={2}
                sx={{
                  background: 'rgba(68, 114, 196, 0.05)',
                  borderRadius: 2,
                  border: '1px solid rgba(68, 114, 196, 0.1)',
                  flex: 1,
                }}
              >
                <MDTypography
                  variant="caption"
                  color="text"
                  fontWeight="medium"
                  display="block"
                  mb={1}
                >
                  📋 Instructions :
                </MDTypography>
                <MDTypography variant="caption" color="text" display="block" mb={0.5}>
                  • Photo claire et bien éclairée
                </MDTypography>
                <MDTypography variant="caption" color="text" display="block" mb={0.5}>
                  • Tous les détails doivent être lisibles
                </MDTypography>
                <MDTypography variant="caption" color="text" display="block">
                  • Format accepté : JPG, PNG, PDF
                </MDTypography>
              </MDBox>
            </Card>
          </Grid>

          {/* Preview Section */}
          <Grid item xs={12} lg={6}>
            {previewUrl ? (
              <Card
                sx={{
                  p: 3,
                  borderRadius: 3,
                  boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
                  border: '1px solid rgba(0,0,0,0.05)',
                  background: 'linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)',
                  height: '100%',
                  minHeight: '300px',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <MDBox textAlign="center" mb={3}>
                  <MDTypography variant="h6" fontWeight="bold" color="dark" mb={1}>
                    Aperçu de votre passeport
                  </MDTypography>
                </MDBox>

                <MDBox
                  sx={{
                    position: 'relative',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                    border: '3px solid #4472c4',
                    background: '#fff',
                    flex: 1,
                    display: 'flex',
                    alignItems: 'stretch',
                    justifyContent: 'center',
                    minHeight: getPreviewType() === 'pdf' ? '500px' : '300px',
                  }}
                >
                  {getPreviewType() === 'pdf' ? (
                    <iframe
                      src={previewUrl}
                      style={{
                        width: '100%',
                        height: '100%',
                        maxHeight: '100%',
                        objectFit: 'contain',
                        border: 'none',
                        borderRadius: '16px',
                        overflow: 'auto',
                        minHeight: '400px',
                      }}
                      title="PDF Preview"
                    />
                  ) : (
                    <img
                      src={previewUrl}
                      alt="Preview du passeport"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain',
                        maxHeight: '100%',
                      }}
                    />
                  )}

                  {/* Overlay avec nom du fichier */}
                  <MDBox
                    sx={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
                      color: 'white',
                      padding: '20px 16px 16px',
                    }}
                  >
                    <MDTypography variant="caption" fontWeight="medium">
                      {selectedFile?.name}
                    </MDTypography>
                  </MDBox>
                </MDBox>

                {/* Actions */}
                <MDBox mt={3} display="flex" gap={2}>
                  <MDButton
                    variant="outlined"
                    color="info"
                    size="small"
                    fullWidth
                    onClick={() => {
                      setSelectedFile(null);
                      setPreviewUrl(null);
                    }}
                    sx={{
                      borderRadius: '8px',
                      textTransform: 'none',
                      fontWeight: '600',
                    }}
                  >
                    Changer l&apos;image
                  </MDButton>
                </MDBox>
              </Card>
            ) : (
              <Card
                sx={{
                  p: 3,
                  borderRadius: 3,
                  boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
                  border: '1px solid rgba(0,0,0,0.05)',
                  background: 'linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)',
                  height: '100%',
                  minHeight: '400px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <MDBox textAlign="center">
                  <MDBox
                    sx={{
                      width: 120,
                      height: 120,
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 24px',
                      border: '2px dashed #cbd5e1',
                    }}
                  >
                    <Icon sx={{ color: '#94a3b8', fontSize: 48 }}>photo_camera</Icon>
                  </MDBox>
                  <MDTypography variant="h6" color="text" fontWeight="medium" mb={1}>
                    Aperçu de l&apos;image
                  </MDTypography>
                  <MDTypography variant="body2" color="text.secondary">
                    Votre aperçu apparaîtra ici après sélection
                  </MDTypography>
                </MDBox>
              </Card>
            )}
          </Grid>
        </Grid>
      </MDBox>
    </MDBox>
  );
};

// typechecking props for UserInfo
KYCFile.propTypes = {
  formData: PropTypes.oneOfType([PropTypes.object, PropTypes.func]).isRequired,
};

export default KYCFile;
