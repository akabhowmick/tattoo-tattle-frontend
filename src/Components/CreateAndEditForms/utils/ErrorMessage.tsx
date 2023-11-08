/* eslint-disable react/react-in-jsx-scope */

export const firstNameErrorMessage =
  "First name must be at least 2 characters long and contain only letters";
export const lastNameErrorMessage =
  "Last name must be at least 2 characters long and contain only letters";
export const emailErrorMessage = "Email is Invalid";
export const passwordErrorMessage =
  "Enter valid password (8-20 char, 1 lowercase,1 uppercase, 1 number, 1 special character";
export const messageErrorMessage = "Enter a message longer than 20 characters";
export const descriptionErrorMessage =
  "Enter a description longer than 20 characters";
export const titleErrorMessage = "Enter a title";
export const imageErrorMessage = "Enter an image";
export const tattooStatesErrorMessage = "Enter tattoo location";
export const tattooStylesErrorMessage = "Enter a style(s)";
export const priceErrorMessage = "Enter a price range";
export const userTypeErrorMessage = "Choose a user type";
export const phoneNumberErrorMessage = "Enter a valid phone number";

export const ErrorMessage = ({
  message,
  show,
}: {
  message: string;
  show: boolean;
}) => {
  return show ? <div className="error-message">{message}</div> : <div></div>;
};
