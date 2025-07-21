import { useModal } from 'context/ModalContext';
import EditModal from 'components/EditModal';
import MDTypography from 'components/MDTypography';
import MDBox from 'components/MDBox';
import PropertyDetailsForm from 'components/forms/PropertyDetailsForm';
import PropertyPriceForm from 'components/forms/PropertyPriceForm';
import PropertyLocationForm from 'components/forms/PropertyLocationForm';
import PropertyDetailsTableForm from 'components/forms/PropertyDetailsTableForm';
import PropertyTimelineForm from 'components/forms/PropertyTimelineForm';
import PropertyCalculatorForm from 'components/forms/PropertyCalculatorForm';
import PropertyContactForm from 'components/forms/PropertyContactForm';
import PropertyPhotosForm from 'components/forms/PropertyPhotosForm';
import BuySharesModal from 'components/BuySharesModal';
import timelineData from 'layouts/pages/projects/timeline/data/timelineData';

const ModalManager = () => {
  const { modalState, closeModal } = useModal();

  const handleSave = async (formData) => {
    if (formData === null) {
      // Annulation
      closeModal();
      return;
    }

    try {
      // Simple validation - you can add more specific validation here
      if (!formData || Object.keys(formData).length === 0) {
        return;
      }

      // Handle timeline data specifically
      if (modalState.type === 'property-timeline' && formData.timelineData) {
        timelineData.push(formData.timelineData);
      }

      // Simulate saving data

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      closeModal();
      // Here you could show a success message
    } catch (error) {
      // Here you could show an error message
    }
  };

  const getModalContent = () => {
    switch (modalState.type) {
      case 'property-details':
        return <PropertyDetailsForm initialData={modalState.data} onSave={handleSave} />;

      case 'property-details-table':
        return <PropertyDetailsTableForm initialData={modalState.data} onSave={handleSave} />;

      case 'property-timeline':
        return <PropertyTimelineForm initialData={modalState.data} onSave={handleSave} />;

      case 'property-calculator':
        return <PropertyCalculatorForm initialData={modalState.data} onSave={handleSave} />;

      case 'property-location':
        return <PropertyLocationForm initialData={modalState.data} onSave={handleSave} />;

      case 'property-contact':
        return <PropertyContactForm initialData={modalState.data} onSave={handleSave} />;

      case 'property-price':
        return <PropertyPriceForm initialData={modalState.data} onSave={handleSave} />;

      case 'property-images':
        return <PropertyPhotosForm initialData={modalState.data} onSave={handleSave} />;
      case 'buy-shares':
        return (
          <BuySharesModal
            initialData={modalState.data}
            onSave={handleSave}
            isOpen={modalState.isOpen}
            onClose={closeModal}
          />
        );
      default:
        return (
          <MDBox>
            <MDTypography variant="body2" color="text">
              Modal not found.
            </MDTypography>
          </MDBox>
        );
    }
  };

  const getModalTitle = () => {
    switch (modalState.type) {
      case 'property-details':
        return 'Property Details';
      case 'property-details-table':
        return 'Property Details Table';
      case 'property-timeline':
        return 'Funding Timeline Configuration';
      case 'property-calculator':
        return 'Investment Calculator Configuration';
      case 'property-location':
        return 'Property Location Configuration';
      case 'property-contact':
        return 'Property Contact Configuration';
      case 'property-price':
        return 'Property Price Configuration';
      case 'property-images':
        return 'Property Images Configuration';
      case 'buy-shares':
        return 'Buy Shares Property';
      default:
        return 'Modifier';
    }
  };

  return (
    <EditModal open={modalState.isOpen} onClose={closeModal} title={getModalTitle()}>
      {getModalContent()}
    </EditModal>
  );
};

export default ModalManager;
