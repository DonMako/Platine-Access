import React from "react";
import { Link } from "react-router-dom";
import {
  getIsSurveyOnlineById,
  getSurveyOfflineMessageById,
  getSurveyOfflineMessageInfoById,
} from "../../utils/read-content";

export default function ResponseButton({ id }) {
  return (
    <div className="center-block text-center">
      <section>
        <h2>{`Répondre à l"enquête`}</h2>
        <Link to={`/${id}/login`} tabIndex="-1">
          <button
            type="button"
            className="btn btn-lg"
            id="accessButton"
            disabled={!getIsSurveyOnlineById(id)}
          >
            {"Accéder au questionnaire"}
          </button>
        </Link>
        <p />
        {!getIsSurveyOnlineById(id) && (
          <>
            <div className="surveyOver">{getSurveyOfflineMessageById(id)}</div>
            <p>{getSurveyOfflineMessageInfoById(id)}</p>
          </>
        )}
      </section>
    </div>
  );
}
