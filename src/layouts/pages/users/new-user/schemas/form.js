const form = {
  formId: "new-user-form",
  formField: {
    firstName: {
      name: "firstName",
      label: "First Name",
      placeholder: "Enter your first name",
      errorMsg: "First name is required",
    },
    lastName: {
      name: "lastName", 
      label: "Last Name",
      placeholder: "Enter your last name",
      errorMsg: "Last name is required",
    },
    phone: {
      name: "phone",
      label: "Phone Number", 
      placeholder: "Enter your phone number",
      errorMsg: "Valid phone number is required",
    },
    birthDate: {
      name: "birthDate",
      label: "Date of Birth",
      placeholder: "Select your birth date",
      errorMsg: "Date of birth is required",
    },
    address1: {
      name: "address1",
      label: "Address",
      placeholder: "Enter your address",
      errorMsg: "Address is required",
    },
    city: {
      name: "city",
      label: "City",
      placeholder: "Enter your city",
      errorMsg: "City is required",
    },
    zip: {
      name: "zip",
      label: "ZIP Code",
      placeholder: "Enter your ZIP code",
      errorMsg: "ZIP code is required",
    },
    kycFile: {
      name: "kycFile",
      label: "KYC Document",
      placeholder: "Upload your KYC document",
      errorMsg: "KYC document is required",
    },
  },
};

export default form; 