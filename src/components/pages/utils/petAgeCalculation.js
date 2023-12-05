export const calculateAgeInMonths = (birthdate) => {
  const petBirthdate = new Date(birthdate);
  const currentDate = new Date();
  const ageInMonths = Math.floor(
    (currentDate - petBirthdate) / (1000 * 60 * 60 * 24 * 30)
  );
  return ageInMonths;
};

export const calculateAgeInDays = (birthdate) => {
  const petBirthdate = new Date(birthdate);
  const currentDate = new Date();
  const ageInDays = Math.floor(
    (currentDate - petBirthdate) / (1000 * 60 * 60 * 24)
  );
  return ageInDays;
};
