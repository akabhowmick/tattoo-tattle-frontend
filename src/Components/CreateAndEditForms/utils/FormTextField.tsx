/* eslint-disable react/react-in-jsx-scope */
import { ComponentProps } from "react";
import { ErrorMessage } from "./ErrorMessage";

export const FunctionalTextField = ({
  inputProps,
  label,
  errorMessage,
  shouldDisplayError,
}: {
  inputProps: ComponentProps<"input">;
  label: string;
  errorMessage: string;
  shouldDisplayError: boolean;
}) => {
  return (
    <div className="text-field">
      <div className="input-wrap">
        <label htmlFor={label}>{label}:</label>
        <input {...inputProps} id={label}/>
      </div>
      <ErrorMessage message={errorMessage} show={shouldDisplayError} />
    </div>
  );
};
