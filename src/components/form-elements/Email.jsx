import React from "react";

export default function Email({ valid, touched }) {

  const formControl = touched && !valid ? "form-control  control-error" : "form-control";

  return (
    <div className="form-group">
      <input type="email" className={formControl} {...props} />
    </div>
  );
};
