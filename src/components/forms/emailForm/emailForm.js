import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Email from 'components/form-elements/Email';
import ImportantInfo from 'components/content/importantInfo';
import validate from 'utils/validate-forms';
import { putMailToLdap } from 'utils/api';

const EmailForm = ({ emailKnown, currentMail, urlBackEnd, redirectToQuestionnaire }) => {
  const [formControls, setFormControls] = useState({
    newEmail: {
      value: '',
      placeholder: '',
      valid: false,
      validationRules: {
        isEmail: true,
        isRequired: true,
      },
      touched: false,
    },
    confirmEmail: {
      value: '',
      placeholder: '',
      valid: false,
      validationRules: {
        isEmail: true,
        isRequired: true,
      },
      touched: false,
    },
  });
  const [modifyMail, setModifyMail] = useState(false);
  const [formIsValid, setFormIsValid] = useState(false);
  const [displayConfirmEmailDifferent, setDisplayConfirmEmailDifferent] = useState(false);
  const [displayBadRequest, setDisplayBadRequest] = useState(false);
  const [displayEmailInvalid, setDisplayEmailInvalid] = useState(false);
  const [displayErrorText, setDisplayErrorText] = useState(null);

  const changeHandler = ({ target: { name, value } }) => {
    const updatedControls = {
      ...formControls,
    };
    const updatedFormElement = {
      ...updatedControls[name],
    };
    updatedFormElement.value = value;
    updatedFormElement.touched = true;
    updatedFormElement.valid = validate(value, updatedFormElement.validationRules);
    updatedControls[name] = updatedFormElement;
    let newFormIsValid = formIsValid;
    if (updatedControls.length !== 0 || updatedControls !== null) {
      newFormIsValid = Object.keys(updatedControls).reduce(
        (previousValue, inputIdentifier) => updatedControls[inputIdentifier].valid && previousValue,
        newFormIsValid
      );
    }
    setFormControls(updatedControls);
    setFormIsValid(newFormIsValid);
    setDisplayConfirmEmailDifferent(false);
    setDisplayBadRequest(false);
    setDisplayEmailInvalid(false);
  };

  const validRequestHandler = () => {
    setFormIsValid(false);
    setFormControls({
      ...formControls,

      newEmail: { ...formControls.newEmail, valid: false, touched: false },
      confirmEmail: {
        ...formControls.confirmEmail,

        valid: false,
        touched: false,
      },
    });
    redirectToQuestionnaire();
  };
  const badRequestHandler = err => {
    const newEmailValidity = validate(
      formControls.newEmail.value,
      formControls.newEmail.validationRules
    );
    const confirmEmailValidity = validate(
      formControls.newEmail.value,
      formControls.newEmail.validationRules
    );
    setDisplayBadRequest(true);
    setFormIsValid(false);
    if (err.response !== undefined && err.response.status === 409) {
      setDisplayErrorText('Adresse déjà utilisée, merci de bien vouloir en choisir une autre');
      setFormControls({
        ...formControls,

        newEmail: { ...formControls.newEmail, valid: newEmailValidity, touched: true },
        confirmEmail: {
          ...formControls.confirmEmail,

          valid: confirmEmailValidity,

          touched: true,
        },
      });
    } else {
      setDisplayErrorText('Problème lors de la requête');
      setFormControls({
        ...formControls,

        newEmail: { ...formControls.newEmail, valid: newEmailValidity, touched: true },
        confirmEmail: {
          ...formControls.confirmEmail,

          valid: confirmEmailValidity,

          touched: true,
        },
      });
      redirectToQuestionnaire();
    }
  };

  const formSubmitHandler = () => {
    setDisplayConfirmEmailDifferent(false);
    setDisplayBadRequest(false);
    setDisplayEmailInvalid(false);
    setDisplayErrorText('');
    const newEmailValidity = validate(
      formControls.newEmail.value,
      formControls.newEmail.validationRules
    );
    const confirmEmailValidity = validate(
      formControls.newEmail.value,
      formControls.newEmail.validationRules
    );

    if (
      (!currentMail &&
        (formControls.newEmail.value !== '' || formControls.confirmEmail.value !== '')) ||
      (modifyMail && (formControls.newEmail.value !== '' || formControls.confirmEmail.value !== ''))
    ) {
      if (formControls.newEmail.value !== formControls.confirmEmail.value) {
        setDisplayConfirmEmailDifferent(true);
        setDisplayErrorText('Les adresses ne correspondent pas');
        setFormControls({
          ...formControls,

          newEmail: {
            ...formControls.newEmail,
            valid: newEmailValidity,
            touched: true,
          },
          confirmEmail: {
            ...formControls.confirmEmail,

            valid: confirmEmailValidity,
            touched: true,
          },
        });
      } else if (
        formControls.newEmail.valid === false ||
        formControls.confirmEmail.valid === false
      ) {
        setDisplayEmailInvalid(true);
        setDisplayErrorText("Format d'adresse incorrect");
        setFormControls({
          ...formControls,

          newEmail: { ...formControls.newEmail, valid: newEmailValidity, touched: true },
          confirmEmail: {
            ...formControls.confirmEmail,

            valid: confirmEmailValidity,
            touched: true,
          },
        });
      } else {
        putMailToLdap(urlBackEnd)(formControls.newEmail.value)
          .then(res => {
            validRequestHandler(res);
          })
          .catch(err => {
            badRequestHandler(err);
          });
      }
    } else {
      redirectToQuestionnaire();
    }
  };
  return (
    <>
      <ImportantInfo />
      <div className="mail-content">
        <div className="mail-info">
          <div className="mail-heading">{`Protection des données individuelles`}</div>
          <div className="mail-body">
            {`Vos coordonnées, en particulier votre adresse de messagerie (mail), sont exclusivement utilisées à des fins de contact et pour vous faciliter l’accès au questionnaire de l’enquête.`}
            <br />
            <br />
            <p>{`Ces informations personnelles sont issues des fichiers administratifs. Elles sont protégées par la loi ; leur utilisation relève de l’exercice des missions de service public de l’Insee.`}</p>
            <p>
              {`Vous avez la`}
              <b>{` possibilité de renseigner ou modifier votre adresse de messagerie`}</b> 
              {`; vous pouvez également cliquer directement sur « Confirmer et accéder au questionnaire ».`}
            </p>
            <p>
              <br />
              <br />
              <p>
                <a
                  href="https://www.insee.fr/fr/information/3719162"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  {`Pour en savoir plus`}
                </a>
              </p>
            </p>
          </div>
        </div>
        <div className="mail-form">
          <div className="mail-heading">{`Votre adresse de messagerie`}</div>
          <br />
          <div className="mail-body">
            <form>
              <p>
                {emailKnown && <Email name="currentMail" value={currentMail} touched={false} />}
              </p>

              {(!emailKnown || modifyMail) && (
                <p>
                  <label htmlFor="newEmail">
                    {!modifyMail
                      ? `Saisir l'adresse de messagerie`
                      : `Nouvelle adresse de messagerie`}
                  </label>
                  <Email
                    name="newEmail"
                    placeholder={formControls.newEmail.placeholder}
                    value={formControls.newEmail.value}
                    onChange={changeHandler}
                    touched={formControls.newEmail.touched}
                    valid={
                      formControls.newEmail.valid &&
                      displayBadRequest !== true &&
                      displayConfirmEmailDifferent !== true &&
                      displayEmailInvalid !== true
                    }
                  />
                  <label htmlFor="confirmEmail">
                    {!modifyMail
                      ? `Confirmer l'adresse de messagerie`
                      : `Confirmer la nouvelle adresse de messagerie`}
                  </label>
                  <Email
                    name="confirmEmail"
                    placeholder={formControls.confirmEmail.placeholder}
                    value={formControls.confirmEmail.value}
                    onChange={changeHandler}
                    touched={formControls.confirmEmail.touched}
                    valid={
                      formControls.confirmEmail.valid &&
                      displayBadRequest !== true &&
                      displayConfirmEmailDifferent !== true &&
                      displayEmailInvalid !== true
                    }
                    onPaste={e => e.preventDefault()}
                  />
                </p>
              )}

              {(displayBadRequest || displayConfirmEmailDifferent || displayEmailInvalid) && (
                <p className="validation-error">{`${displayErrorText}`}</p>
              )}

              <button
                className={!formIsValid ? 'button-disabled btn btn-md' : 'btn btn-md'}
                id="boutonMailConfirm"
                type="button"
                onClick={formSubmitHandler}
              >
                {emailKnown ? `Confirmer et accéder au questionnaire` : `Accéder au questionnaire`}
              </button>
              {!modifyMail && emailKnown && (
                <button
                  type="button"
                  className="btn btn-md"
                  id="boutonMailModif"
                  onClick={() => setModifyMail(true)}
                >
                  {`Modifier`}
                </button>
              )}
            </form>
          </div>
          <br />
          <br />
        </div>
      </div>
    </>
  );
};

export default EmailForm;

EmailForm.defaultProps = {
  emailKnown: null,
  currentMail: null,
};

EmailForm.propTypes = {
  emailKnown: PropTypes.bool,
  currentMail: PropTypes.string,
  urlBackEnd: PropTypes.string.isRequired,
  redirectToQuestionnaire: PropTypes.func.isRequired,
};
