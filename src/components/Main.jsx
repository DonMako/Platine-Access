import React from "react";
import { Helmet } from "react-helmet";
import { Route, Redirect } from "react-router-dom";
import PropTypes from "prop-types";

import Auth from "./auth";
import Menu from "components/template/menu";
import Banner from "components/template/banner";
import FooterMenu from "components/template/footer-menu";
import ResponseButton from "components/template/response-button";
import Faq from "components/content/faq";
import ImagesViewer from "components/template/images-viewer";
import Accessibilite from "components/content/accessibilite";
import SurveyDescription from "components/content/survey-description";
import ResultatsEnquete from "components/content/resultats-enquete";
import UtiliteReponse from "components/content/utilite-reponse";
import AssistanceForm from "components/forms/assistance-form";
import AssistanceRouter from "components/forms/assistance-router";
import ControlEmailForm from "components/forms/mail-modif";
import DonneesPersonnelles from "./content/donnees-personnelles";

import {
  idExists,
  getSurveyTitleById,
  getSurveyResultsTitleById,
  getSurveyResultsPictureUrlById,
  getSurveyResultsLegendeById,
  getSurveyDescriptionBody,
  getSurveyDescriptionTitle,
  getA11yBody,
  getA11yTitle,
} from "../utils/read-content";

class Main extends React.Component {
  constructor(props) {
    super(props);
    const { match } = this.props;
    this.state = {
      showMenu: true,
      showResponseButton: true,
      showMinimalFooter: false,
      id: match.params.id,
    };
  }

  hideMenu = () => {
    const { showMenu } = this.state;
    if (showMenu) {
      this.setState({
        showMenu: false,
      });
    }
  };

  hideResponseButton = () => {
    const { showResponseButton } = this.state;
    if (showResponseButton) {
      this.setState({
        showResponseButton: false,
      });
    }
  };

  showMinimalFooter = () => {
    const { showMinimalFooter } = this.state;
    if (!showMinimalFooter) {
      this.setState({
        showMinimalFooter: true,
      });
    }
  };

  /* return */ render() {
    const { urlBackEnd, match, urlMySurveys, keycloakAuth } = this.props;

    const { id, showMenu, showResponseButton, showMinimalFooter } = this.state;

    return (
      <>
        {!idExists(id) ? (
          <Redirect to="/" />
        ) : (
          <>
            <Helmet>
              <title>{`${getSurveyTitleById(id)} | Insee`}</title>
              <meta
                name="description"
                content={`Répondre à l’enquête sur le portail de l’Institut national de la statistique et des études économiques`}
              />
            </Helmet>

            <Banner title={getSurveyTitleById(id)} id={id} />

            <Route
              exact
              path={`${match.url}/repondant/mail`}
              component={routeProps => (
                <ControlEmailForm
                  {...routeProps}
                  urlBackEnd={urlBackEnd}
                  id={id}
                  hideMenu={this.hideMenu}
                  hideResponseButton={this.hideResponseButton}
                />
              )}
            />

            {showMenu && <Menu id={id} link={urlBackEnd} />}
            <div className="row">
              <div className="col-md-8 text-justify">
                {/* <Route
path={`${match.url}/changement-mot-de-passe`}
exact
render={routeProps => <ChangePasswordForm {...routeProps} urlBackEnd={urlBackEnd} />}
/> */}

                <div id="main">
                  <Route
                    exact
                    path={`${match.url}/login`}
                    component={routeProps => (
                      <Auth
                        {...routeProps}
                        urlBackEnd={urlBackEnd}
                        urlMySurveys={urlMySurveys}
                        id={id}
                        keycloakAuth={keycloakAuth}
                      />
                    )}
                  />
                  <Route
                    path={`${match.url}/assistance`}
                    exact
                    component={routeProps => (
                      <AssistanceRouter
                        {...routeProps}
                        urlBackEnd={urlBackEnd}
                        id={id}
                        auth={false}
                      />
                    )}
                  />
                  <Route
                    path={`${match.url}/assistance/auth`}
                    exact
                    component={routeProps => (
                      <AssistanceRouter {...routeProps} urlBackEnd={urlBackEnd} id={id} auth />
                    )}
                  />
                  <Route
                    path={`${match.url}/contacter-assistance`}
                    exact
                    component={routeProps => (
                      <AssistanceForm
                        {...routeProps}
                        urlBackEnd={urlBackEnd}
                        id={id}
                        auth={false}
                      />
                    )}
                  />
                  <Route
                    path={`${match.url}/contacter-assistance/auth`}
                    exact
                    component={routeProps => (
                      <AssistanceForm {...routeProps} urlBackEnd={urlBackEnd} id={id} auth />
                    )}
                  />
                  <Route
                    path={`${match.url}`}
                    exact
                    render={() => (
                      <SurveyDescription
                        title={getSurveyDescriptionTitle(id)}
                        body={getSurveyDescriptionBody(id)}
                      />
                    )}
                  />
                  <Route
                    path={`${match.url}/accessibilite`}
                    exact
                    component={() => (
                      <Accessibilite title={getA11yTitle()} body={getA11yBody()} id={id} />
                    )}
                  />
                  <Route
                    path={`${match.url}/resultats`}
                    exact
                    render={() => (
                      <ResultatsEnquete
                        title={getSurveyResultsTitleById(id)}
                        pictureUrl={getSurveyResultsPictureUrlById(id)}
                        legende={getSurveyResultsLegendeById(id)}
                      />
                    )}
                  />
                  <Route
                    path={`${match.url}/donnees-personnelles`}
                    exact
                    component={routeProps => <DonneesPersonnelles {...routeProps} id={id} />}
                  />
                  <Route
                    path={`${match.url}/courrier-enquetes`}
                    exact
                    component={routeProps => <ImagesViewer {...routeProps} id={id} />}
                  />
                  <Route
                    path={`${match.url}/utilite-reponse`}
                    exact
                    component={routeProps => <UtiliteReponse {...routeProps} id={id} />}
                  />
                  <Route
                    path={`${match.url}/faq`}
                    exact
                    component={routeProps => <Faq {...routeProps} enquete={id} />}
                  />
                  {!showMinimalFooter ? (
                    <FooterMenu home={false} path={match.url} id={id} />
                  ) : (
                    <FooterMenu home path={match.url} id={id} />
                  )}
                </div>
              </div>
              <div className="col-md-4">{showResponseButton && <ResponseButton id={id} />}</div>
            </div>
          </>
        )}
      </>
    );
  }
}

Main.propTypes = {
  urlBackEnd: PropTypes.string.isRequired,
  urlMySurveys: PropTypes.string.isRequired,
  keycloakAuth: PropTypes.bool.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.node,
    }).isRequired,
    url: PropTypes.string.isRequired,
  }).isRequired,
};

export default Main;
