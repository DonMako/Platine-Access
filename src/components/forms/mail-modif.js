import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Loading from 'components/loading/loading';
import { getMailFromLdap } from 'utils/api';
import useAuth from 'utils/hook/useAuth';
import ErrorComponent from 'components/template/ErrorComponent';
import EmailForm from './emailForm';

const ControlEmailForm = ({ id, location, hideMenu, hideResponseButton, history, urlBackEnd }) => {
  const [init, setInit] = useState(false);
  const [loadingMail, setLoadingMail] = useState(true);
  const [emailKnown, setEmailKnown] = useState(false);
  const [currentMail, setCurrentMail] = useState(null);
  const { loading, authenticated } = useAuth(true);
  const [questionnaireUrl, setQuestionnaireUrl] = useState(null);
  const [error, setError] = useState(null);

  const redirect = useCallback(() => {
    window.location = questionnaireUrl;
  }, [questionnaireUrl]);

  const loadMail = useCallback(async () => {
    const response = await getMailFromLdap(urlBackEnd);
    if (response.data !== undefined && response.data !== '') {
      setCurrentMail(response.data);
      setEmailKnown(true);
    }
  }, [urlBackEnd]);
  useEffect(() => {
    if (location) {
      if (location.state) {
        const url = location.state.urlQuestionnaire || '';
        setQuestionnaireUrl(url);
      }
      setInit(true);
    }
  }, [location]);

  useEffect(() => {
    if (!loadingMail) {
      hideMenu();
      hideResponseButton();
    }
  }, [hideMenu, hideResponseButton, loadingMail]);

  useEffect(() => {
    if (init) {
      if (questionnaireUrl) {
        const initMail = async () => {
          try {
            await loadMail();
          } catch (e) {
            setError('technique');
          }
        };
        initMail();
        setLoadingMail(false);
      }
      // if user reloads this page (he looses questionnaireUrl)
      // redirect to login page
      else {
        history.push({
          pathname: `/${id}/login`,
        });
      }
    }
  }, [init, questionnaireUrl, history, loadMail, id]);

  return (
    <>
      {!loading && !loadingMail && authenticated && (
        <EmailForm
          currentMail={currentMail}
          redirectToQuestionnaire={redirect}
          emailKnown={emailKnown}
          urlBackEnd={urlBackEnd}
        />
      )}
      {!loading && !loadingMail && error && <ErrorComponent error={error} />}
      {(loading || loadingMail) && <Loading id={id} />}
    </>
  );
};

export default ControlEmailForm;
ControlEmailForm.propTypes = {
  id: PropTypes.string.isRequired,
  urlBackEnd: PropTypes.string.isRequired,
  location: PropTypes.shape({
    state: PropTypes.shape({ urlQuestionnaire: PropTypes.string }),
    search: PropTypes.string.isRequired,
  }).isRequired,
  hideMenu: PropTypes.func.isRequired,
  hideResponseButton: PropTypes.func.isRequired,
};
