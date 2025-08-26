import React from 'react';
import PropTypes from 'prop-types';
import TextInput from 'components/form-elements/textInput';
import PasswordInput from 'components/form-elements/PasswordInput';
import validate from 'utils/validate-forms';
import isPasswordCompliant from 'utils/validate-password';
import { getSurveyRootUrl } from 'utils/url-utils';
import { idecLengthMin, idecLengthMax, pathPassword, pathUser } from 'utils/properties';
import Axios from 'axios';

class ChangePasswordForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      formIsValid: false,
      displayConfirmation: false,
      displayBadRequest: false,
      displayConfirmPasswordDifferent: false,
      displayPasswordNotCompliant: false,
      formControls: {
        idec: {
          value: '',
          placeholder: '',
          valid: false,
          validationRules: {
            minLength: idecLengthMin,
            maxLength: idecLengthMax,
            isRequired: true,
          },
          touched: false,
        },
        password: {
          value: '',
          placeholder: '',
          valid: false,
          validationRules: {
            isRequired: true,
          },
          touched: false,
        },
        newPassword: {
          value: '',
          placeholder: '',
          valid: false,
          validationRules: {
            isRequired: true,
          },
          touched: false,
        },
        confirmPassword: {
          value: '',
          placeholder: '',
          valid: false,
          validationRules: {
            isRequired: true,
          },
          touched: false,
        },
      },
    };
  }

  changeHandler = event => {
    const { name, value } = event.target;
    const { formControls } = this.state;

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

    let formIsValid = true;
    if (updatedControls.length !== 0 || updatedControls !== null) {
      for (let inputIdentifier in updatedControls) {
        formIsValid = updatedControls[inputIdentifier].valid && formIsValid;
      }
    }

    this.setState({
      formControls: updatedControls,
      formIsValid,
      displayConfirmPasswordDifferent: false,
      displayPasswordNotCompliant: false,
      displayBadRequest: false,
    });
  };

  formSubmitHandler = () => {
    const { urlBackEnd } = this.props;
    const { formControls } = this.state;

    if (formControls.newPassword.value !== formControls.confirmPassword.value) {
      this.setState({
        displayConfirmPasswordDifferent: true,
      });
    } else if (!isPasswordCompliant(formControls.newPassword.value)) {
      this.setState({
        displayPasswordNotCompliant: true,
      });
    } else {
      const data = {
        oldPassword: formControls.password.value,
        newPassword: formControls.confirmPassword.value,
      };
      Axios.put(`${urlBackEnd}${pathUser}/${formControls.idec.value}${pathPassword}`, data)
        .then(res => this.validRequestHandler(res))
        .catch(err => this.badRequestHandler(err));
    }
  };

  badRequestHandler = () => {
    const { formControls } = this.state;
    this.setState({
      displayBadRequest: true,
      formIsValid: false,
      formControls: {
        ...formControls,
        password: { ...formControls.password, value: '', valid: false, touched: false },
        newPassword: { ...formControls.newPassword, value: '', valid: false, touched: false },
        confirmPassword: {
          ...formControls.confirmPassword,
          value: '',
          valid: false,
          touched: false,
        },
      },
    });
  };

  validRequestHandler = () => {
    const { formControls } = this.state;
    this.setState({
      displayConfirmation: true,
      formIsValid: false,
      formControls: {
        ...formControls,
        password: { ...formControls.password, value: '' },
        newPassword: { ...formControls.newPassword, value: '', valid: false, touched: false },
        confirmPassword: {
          ...formControls.confirmPassword,
          value: '',
          valid: false,
          touched: false,
        },
      },
    });
  };

  formCancelButtonHandler = () => {
    window.location = getSurveyRootUrl(window.location.toString());
  };

  render() {
    const {
      displayConfirmation,
      displayBadRequest,
      formControls,
      formIsValid,
      displayConfirmPasswordDifferent,
      displayPasswordNotCompliant,
    } = this.state;

    return !displayConfirmation ? (
      <section>
        <form>
          <h2>{`Formulaire de changement de mot de passe`}</h2>
          <p>{`(*) Champs obligatoires`}</p>
          <label htmlFor="idec">
            {`Identifiant (entre ${idecLengthMin} et ${idecLengthMax} caractères)`}
            <sup>*</sup>
          </label>
          <TextInput
            name="idec"
            placeholder={formControls.idec.placeholder}
            value={formControls.idec.value}
            onChange={this.changeHandler}
            touched={formControls.idec.touched}
            valid={formControls.idec.valid}
            maxLength={idecLengthMax}
            errormessage={`Merci de saisir un identifiant entre ${idecLengthMin} et ${idecLengthMax} caractères`}
          />
          <br />
          <label htmlFor="password">
            {`Mot de passe actuel`}
            <sup>*</sup>
          </label>
          <PasswordInput
            name="password"
            placeholder={formControls.password.placeholder}
            value={formControls.password.value}
            onChange={this.changeHandler}
            touched={formControls.password.touched}
            valid={formControls.password.valid}
          />
          <label htmlFor="newPassword">
            {`Nouveau mot de passe`}
            <sup>*</sup>
          </label>
          <PasswordInput
            name="newPassword"
            placeholder={formControls.newPassword.placeholder}
            value={formControls.newPassword.value}
            onChange={this.changeHandler}
            touched={formControls.newPassword.touched}
            valid={formControls.newPassword.valid}
          />
          <label htmlFor="confirmPassword">
            {`Confirmez votre nouveau mot de passe`}
            <sup>*</sup>
          </label>
          <PasswordInput
            name="confirmPassword"
            placeholder={formControls.confirmPassword.placeholder}
            value={formControls.confirmPassword.value}
            onChange={this.changeHandler}
            touched={formControls.confirmPassword.touched}
            valid={formControls.confirmPassword.valid}
          />
          {displayConfirmPasswordDifferent && (
            <p className="validation-error">
              {`Le mot de passe de confirmation est différent du mot de passe choisi`}
            </p>
          )}
          {displayPasswordNotCompliant && (
            <p className="validation-error">{`Le mot de passe choisi doit contenir au moins 8 caractères, avec au moins une majuscule, une miniscule et un chiffre`}</p>
          )}
          {displayBadRequest && (
            <p className="validation-error">{`Les informations saisies sont incorrectes.`}</p>
          )}
          <button
            className={!formIsValid ? 'button-disabled btn btn-md' : 'btn btn-md'}
            type="button"
            onClick={this.formSubmitHandler}
            disabled={!formIsValid}
          >
            {`Changer le mot de passe`}
          </button>
          <button type="button" className="btn btn-md" onClick={this.formCancelButtonHandler}>
            {`Annuler`}
          </button>
        </form>
        <br />
        <br />
      </section>
    ) : (
      <section className="valid">{`Votre demande de changement de mot de passe a bien été prise en compte`}</section>
    );
  }
}

export default ChangePasswordForm;
ChangePasswordForm.propTypes = {
  urlBackEnd: PropTypes.string.isRequired,
};
