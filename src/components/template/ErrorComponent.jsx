import React from "react";
import PropTypes from "prop-types";

export default function ErrorComponent({ error }) {
  let content = "";
  switch (error) {
    case "technique":
      content = "Un problème technique est survenu.";
      break;
    case "authentification":
      content = `Un problème technique lors de la phase d"authentification est survenu.`;
      break;
    default:
  }
  return (
    <section className="error">
      <p>{content}</p>
    </section>
  );
}

ErrorComponent.propTypes = {
  error: PropTypes.string.isRequired,
};
