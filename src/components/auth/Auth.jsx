import React, { useCallback, useEffect, useState } from "react";
import PropTypes from "prop-types";
import Loading from "components/loading/loading";
import ErrorComponent from "components/template/error-component";
import { extractQuestionnaireUrl } from "utils/url-utils";
import { getSurveyVerifMailById } from "utils/read-content";
import { getQuestionnaireUrl } from "utils/api";
import useAuth from "utils/hook/auth";
import NoSurveyPage from "components/content/ineligible";
import UnauthorizedPage from "components/content/unauthorized";

export default function Auth({ urlBackEnd, id, history, keycloakAuth }) {
  const { loading, authenticated, authError } = useAuth(keycloakAuth);
  const [error, setError] = useState(null);
  const [ineligible, setIneligible] = useState(false);
  const [unauthorized, setUnauthorized] = useState(false);

  const redirectToUrl = url => {
    window.location = url;
  };

  const redirectToQuestionnaire = useCallback(async () => {
    try {
      const response = await getQuestionnaireUrl(urlBackEnd, keycloakAuth);
      if (response.data && response.data.length) {
        if (getSurveyVerifMailById(id) && keycloakAuth) {
          history.push({
            pathname: "repondant/mail",
            state: {
              urlQuestionnaire: extractQuestionnaireUrl(response),
            },
          });
        } else {
          redirectToUrl(extractQuestionnaireUrl(response));
        }
      } else {
        setIneligible(true);
      }
    } catch (e) {
      if (e.response.status === 401 || e.response.status === 403 || e.response.status === 404) {
        setUnauthorized(true);
      } else {
        setError("technique");
      }
    }
  }, [history, id, urlBackEnd, keycloakAuth]);

  useEffect(() => {
    if (authenticated && !loading) redirectToQuestionnaire();
    if (!authenticated && !loading && authError) setError("authentification");
  }, [authenticated, loading, authError, redirectToQuestionnaire]);

  return (
    <>
      {loading && <Loading id={id} />}
      {error && <ErrorComponent error={error} />}
      {ineligible && <NoSurveyPage id={id} />}
      {unauthorized && <UnauthorizedPage id={id} />}
    </>
  );
};

Auth.propTypes = {
  urlBackEnd: PropTypes.string.isRequired,
  urlMySurveys: PropTypes.string.isRequired,
  keycloakAuth: PropTypes.bool.isRequired,
  id: PropTypes.string.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  location: PropTypes.shape({
    search: PropTypes.string.isRequired,
  }).isRequired,
};
