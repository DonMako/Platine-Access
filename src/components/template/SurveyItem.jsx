import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

export default function SurveyItem({ survey }) {
  return (
    <div className="survey-item">
      <Link to={`/${survey.id}`} tabIndex="-1" className="survey-item-link">
        <button type="button" className="btn" id="boutonRepondre">
          <span>{survey.titleShort}</span>
          <br />
          {`${window.location.host}/${survey.id}`}
        </button>
      </Link>
    </div>
  );
}

SurveyItem.propTypes = {
  survey: PropTypes.shape({
    id: PropTypes.string.isRequired,
    titleShort: PropTypes.string.isRequired,
  }).isRequired,
};
