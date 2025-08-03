const selectData = {
  gender: ["Male", "Female", "Other"],
  birthDate: [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ],
  days: Array.from({ length: 31 }, (_, i) => (i + 1).toString()),
  years: Array.from({ length: 126 }, (_, i) => (new Date().getFullYear() - i).toString()),
  languages: [
    "English", 
    "French", 
    "Spanish", 
    "German", 
    "Italian", 
    "Portuguese", 
    "Arabic", 
    "Chinese", 
    "Japanese", 
    "Korean",
    "Russian",
    "Hebrew"
  ],
};

export default selectData;
