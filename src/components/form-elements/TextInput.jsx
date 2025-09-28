import React from "react";
import PropTypes from "prop-types";

const TextInput = props => {
  const { touched, valid, errorMessage } = props;
  const formControl = touched && !valid ? "form-control control-error" : "form-control";

  const myProps = { ...props };
  delete myProps.touched;
  delete myProps.valid;
  delete myProps.errorMessage;

  return (
    <div className="form-group">
      <input
        type="text"
        className={formControl}
        touched={touched}
        valid={valid}
        {...myProps}
      />
      {errorMessage}
    </div>
  );
};

export default TextInput;

TextInput.propTypes = {
  touched: PropTypes.bool.isRequired,
  valid: PropTypes.bool.isRequired,
  errorMessage: PropTypes.string,
};
TextInput.defaultProps = {
  errorMessage: "",
};
