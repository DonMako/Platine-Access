import React from "react";

const PasswordInput = props => {
  let formControl = "form-control";
  let validationError = null;

  if (props.touched && !props.valid) {
    formControl = "form-control control-error";
    validationError = <p className="validation-error">{props.errorMessage}</p>;
  }

  return (
    <div className="form-group">
      <input type="password" className={formControl} {...props} />
      {validationError}
    </div>
  );
};

export default PasswordInput;
