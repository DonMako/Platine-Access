import React from 'react';
import PropTypes from 'prop-types';
import TextInput from 'components/form-elements/textInput';
import Select from 'components/form-elements/Select';
import TextArea from 'components/form-elements/TextArea';
import ErrorComponent from 'components/template/ErrorComponent';
import validate from 'utils/validate-forms';
import { getSurveyRootUrl } from 'utils/url-utils';
import { getListOptionsMailAssitance, getListOptionsSurvey } from 'utils/read-content';
import { idecLengthMin, idecLengthMax, pathMail } from 'utils/properties';
import Axios from 'axios';

class AssistanceForm extends React.Component {
  constructor(props) {
    super(props);
    const { location } = this.props;
    this.state = {
      displayErrorMessage: false,
      displayConfirmation: false,
      formIsValid: false,
      formControls: {
        name: {
          value: '',
          placeholder: '',
          valid: false,
          validationRules: {
            isRequired: false,
          },
          touched: false,
        },
        idec: {
          value: typeof location.state !== 'undefined' ? location.state.idec : '',
          placeholder: '',
          valid: false,
          validationRules: {
            isRequired: false,
          },
          touched: false,
        },
        phonenumber: {
          value: '',
          placeholder: '',
          valid: false,
          validationRules: {
            isRequired: false,
          },
          touched: false,
        },
        mailaddress: {
          value: '',
          placeholder: '',
          valid: false,
          validationRules: {
            isEmail: '',
            isRequired: true,
          },
          touched: false,
        },
        mailaddressconfirmation: {
          value: '',
          placeholder: '',
          valid: false,
          validationRules: {
            isRequired: true,
          },
          touched: false,
        },
        survey: {
          value: props.id,
          placeholder: '',
          valid: true,
          touched: false,
          validationRules: {
            isRequired: true,
          },
          options: getListOptionsSurvey(props.id),
        },
        mailobjet: {
          value: getListOptionsMailAssitance(props.id, props.auth)[0].value,
          placeholder: '',
          valid: true,
          touched: false,
          validationRules: {
            isRequired: false,
          },
          options: getListOptionsMailAssitance(props.id, props.auth),
        },
        message: {
          value: '',
          placeholder: '',
          valid: false,
          touched: false,
          validationRules: {
            isRequired: true,
          },
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

    // Update changed input value
    updatedControls[name].value = value;
    updatedControls[name].touched = true;

    // Validate all input (we have to do this because of preloaded data not being changed)
    Object.keys(updatedControls).forEach(key => {
      updatedControls[key].valid = validate(
        updatedControls[key].value,
        updatedControls[key].validationRules
      );
    });

    // Check form is valid
    const formIsValid = this.validateForm(updatedControls);
    this.setState({
      formControls: updatedControls,
      formIsValid,
    });
  };

  validateForm = updatedControls =>
    Object.keys(updatedControls).reduce((acc, key) => updatedControls[key].valid && acc, true) &&
    this.validateMailAddresses(updatedControls);

  validateMailAddresses = updatedControls => {
    return updatedControls.mailaddressconfirmation.value === updatedControls.mailaddress.value;
  };

  oneFieldIsTouched = () => {
    const { formControls } = this.state;
    return Object.keys(formControls).reduce((acc, key) => formControls[key].touched || acc, false);
  };

  formSubmitHandler = () => {
    const { urlBackEnd, auth, location } = this.props;
    const { formControls } = this.state;
    const params = new URLSearchParams(location.search);

    const formData = {
      auth,
      idue: auth ? params.get('idue') : '',
      questioningId: auth ? params.get('questioningId') : '',
      name: formControls.name.value,
      idec: formControls.idec.value,
      phonenumber: formControls.phonenumber.value,
      mailaddress: formControls.mailaddress.value,
      mailobjet: formControls.mailobjet.value,
      message: formControls.message.value,
      survey: formControls.survey.value,
    };
    Axios.post(`${urlBackEnd}${pathMail}`, formData)
      .then(res => this.validRequestHandler(res))
      .catch(err => this.errorHandler(err));
  };

  errorHandler = () => {
    this.setState({
      displayErrorMessage: true,
      formIsValid: false,
    });
  };

  validRequestHandler = () => {
    const { formControls } = this.state;
    const { id, auth } = this.props;
    this.setState({
      displayConfirmation: true,
      formIsValid: false,
      formControls: {
        ...formControls,
        name: { ...formControls.name, value: '', valid: true, touched: false },
        idec: { ...formControls.idec, value: '', valid: true, touched: false },
        phonenumber: { ...formControls.phonenumber, value: '', valid: true, touched: false },
        mailaddress: { ...formControls.mailaddress, value: '', valid: true, touched: false },
        mailaddressconfirmation: {
          ...formControls.mailaddressconfirmation,
          value: '',
          valid: true,
          touched: false,
        },
        mailobjet: {
          ...formControls.mailobjet,
          value: getListOptionsMailAssitance(id, auth)[0].value,
          valid: true,
          touched: false,
        },
        message: { ...formControls.message, value: '', valid: true, touched: false },
      },
    });
  };

  formCancelButtonHandler = () => {
    window.location = getSurveyRootUrl(window.location.toString());
  };

  render() {
    const { formControls, formIsValid, displayErrorMessage, displayConfirmation } = this.state;
    const { id } = this.props;
    return !displayConfirmation ? (
      <section>
        <h2>{`Contacter l'assistance`}</h2>
        <p>
          {`Avant de faire une demande d'assistance, pensez à regarder si la réponse à votre question figure dans l'`}
          <a href={`/${id}/faq`} target="_blank" rel="noopener noreferrer">
            {`aide en ligne`}
          </a>
        </p>
        <p>(*) Champs obligatoires</p>
        <label htmlFor="name">{`Nom et Prénom`}</label>
        <TextInput
          name="name"
          placeholder={formControls.name.placeholder}
          value={formControls.name.value}
          onChange={this.changeHandler}
          touched={formControls.name.touched}
          valid={formControls.name.valid}
          maxLength={200}
        />
        <label htmlFor="phonenumber">{`Numéro de téléphone`}</label>
        <TextInput
          name="phonenumber"
          placeholder={formControls.phonenumber.placeholder}
          value={formControls.phonenumber.value}
          onChange={this.changeHandler}
          touched={formControls.phonenumber.touched}
          valid={formControls.phonenumber.valid}
          maxLength={15}
        />
        <label htmlFor="mailaddress">
          {`Adresse de messagerie`}
          <sup>*</sup>
        </label>
        <TextInput
          name="mailaddress"
          placeholder={formControls.mailaddress.placeholder}
          value={formControls.mailaddress.value}
          onChange={this.changeHandler}
          touched={formControls.mailaddress.touched}
          valid={formControls.mailaddress.valid}
          maxLength={200}
        />
        <label htmlFor="mailaddressconfirmation">
          {`Confirmation de l'adresse de messagerie`}
          <sup>*</sup>
        </label>
        <TextInput
          name="mailaddressconfirmation"
          placeholder={formControls.mailaddressconfirmation.placeholder}
          value={formControls.mailaddressconfirmation.value}
          onChange={this.changeHandler}
          touched={formControls.mailaddressconfirmation.touched}
          valid={formControls.mailaddressconfirmation.valid}
          maxLength={200}
        />
        <label htmlFor="idec">{`Identifiant (entre ${idecLengthMin} et ${idecLengthMax} caractères)`}</label>
        <TextInput
          name="idec"
          placeholder={formControls.idec.placeholder}
          value={formControls.idec.value}
          onChange={this.changeHandler}
          touched={formControls.idec.touched}
          valid={formControls.idec.valid}
          maxLength={idecLengthMax}
        />
        <br />
        <label htmlFor="survey">{`Nom de l'enquête`}</label>
        <Select
          name="survey"
          value={formControls.survey.value}
          onChange={this.changeHandler}
          options={formControls.survey.options}
          touched={formControls.survey.touched}
          valid={formControls.survey.valid}
        />
        <label htmlFor="mailobjet">{`Objet de votre message`}</label>
        <Select
          name="mailobjet"
          value={formControls.mailobjet.value}
          onChange={this.changeHandler}
          options={formControls.mailobjet.options}
          touched={formControls.mailobjet.touched}
          valid={formControls.mailobjet.valid}
        />
        <label htmlFor="message">{`Message`}</label>
        <sup>*</sup>
        <TextArea
          name="message"
          value={formControls.message.value}
          onChange={this.changeHandler}
          options={formControls.message.options}
          touched={formControls.message.touched}
          valid={formControls.message.valid}
          maxLength={4000}
          rows={10}
        />
        <p>
          <b>{4000 - formControls.message.value.length}</b>
          {` `}
          caractère(s) restants
        </p>

        {!formIsValid && this.oneFieldIsTouched() && (
          <div className="error">
            {`Pour transmettre votre formulaire d’assistance vous devez fournir au minimum un message, une adresse de messagerie valide et la confirmer.`}
          </div>
        )}
        <br />
        <button
          id="formSend"
          className={!formIsValid ? 'button-disabled btn btn-md' : 'btn btn-md'}
          type="button"
          onClick={this.formSubmitHandler}
          disabled={!formIsValid}
        >
          {`Envoyer`}
        </button>

        <button
          type="button"
          id="formCancel"
          className="btn btn-md"
          onClick={this.formCancelButtonHandler}
        >
          {`Annuler`}
        </button>
        <br />
        {displayErrorMessage && <ErrorComponent error="technique" />}
        <br />
        <p>{`L'adresse que vous nous communiquez reste strictement confidentielle. Nous nous engageons à utiliser votre adresse uniquement pour envoyer des messages relatifs à votre demande.`}</p>
      </section>
    ) : (
      <section className="valid">{`Votre demande d'assistance a bien été prise en compte`}</section>
    );
  }
}

export default AssistanceForm;
AssistanceForm.propTypes = {
  urlBackEnd: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  auth: PropTypes.bool.isRequired,
  location: PropTypes.shape({
    search: PropTypes.string.isRequired,
  }).isRequired,
};
