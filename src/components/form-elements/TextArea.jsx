import React from "react";
import PropTypes from "prop-types";

const TextArea = props => {
  const { touched, valid } = props;
  const formControl = touched && !valid ? "form-control control-error" : "form-control";

  const myProps = { ...props };
  delete myProps.touched;
  delete myProps.valid;

  return (
    <div className="form-group">
      <textarea
        className={formControl}
        touched={touched}
        valid={valid}
        {...myProps}
      />
    </div>
  );
};

export default TextArea;
TextArea.propTypes = {
  touched: PropTypes.bool.isRequired,
  valid: PropTypes.bool.isRequired,
};
