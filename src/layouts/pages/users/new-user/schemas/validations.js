
import * as Yup from "yup";
import checkout from "layouts/pages/users/new-user/schemas/form";

const {   
  formField: { firstName, lastName, phone, address1, city, zip, birthDate, kycFile },
} = checkout;

const validations = [
  Yup.object().shape({
    [firstName.name]: Yup.string().required(firstName.errorMsg),
    [lastName.name]: Yup.string().required(lastName.errorMsg),
    [phone.name]: Yup.string().required(phone.errorMsg).min(10, phone.errorMsg),
    [birthDate.name]: Yup.date().required(birthDate.errorMsg),
  }),
  Yup.object().shape({
    [address1.name]: Yup.string().required(address1.errorMsg),
    [city.name]: Yup.string().required(city.errorMsg),
    [zip.name]: Yup.string().required(zip.errorMsg),
  }),
  Yup.object().shape({
    [kycFile.name]: Yup.string().required(kycFile.errorMsg),
  }),
  

];

export default validations;
