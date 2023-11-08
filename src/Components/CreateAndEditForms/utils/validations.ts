/* eslint-disable no-useless-escape */
const regex = /^[a-zA-Z]+$/;

export const isEmailValid = (emailAddress: string) => {
  const emailRegex =
    /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
  return emailRegex.test(emailAddress);
};

export const isValidPassword = (password: string) => {
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[-#$^+_!*()@%&]).{8,20}$/gm;
  return passwordRegex.test(password);
};

export const isValidMessage = (message: string) => {
  return message.length > 20;
};

export const isValidDescription = (description: string) => {
  return description.length > 20;
};

export const isValidTitle = (description: string) => {
  return description.length > 0;
};

export const isValidPrice = (price: string) => {
  return !(price === "");
};

export const isValidImage = (image: string) => {
  return image.length > 0;
};

export const isValidTattooStyleInput = (tattooStyles: string[]) => {
  return tattooStyles.length > 0;
};

export const isValidStatesInput = (tattooStates: string[]) => {
  return tattooStates.length > 0;
};

export const isValidName = (name: string) => {
  return name.length > 0 && regex.test(name);
};

export const isValidPhoneNumber = (number: string) => {
  return number.length === 15;
};
