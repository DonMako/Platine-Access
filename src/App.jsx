import React, { useEffect, useState } from "react";
import { Route, BrowserRouter, Switch } from "react-router-dom";
import { Helmet } from "react-helmet";
import Main from "components/main";
import Home from "components/home";

/** adresse du fichier de conf. Les propriétées sont fetchées dans dans la méthode componentDidMount */
const apiConfigPath = `${window.location.origin}/configuration.json`;

export default function App() {

  const [apiRequest, setApiRequest] = useState({
    urlBackEnd: null,
    urlMySurveys: null,
    isConfigLoaded: false,
    keycloakAuth: null
  });

  useEffect(() => {
    fetch(apiConfigPath)
      .then(response => response.json())
      .then(data =>
        setApiRequest({
          urlBackEnd: data.urlColemanPromotionBack,
          urlMySurveys: data.urlSurveys,
          isConfigLoaded: true,
          keycloakAuth: data.authType === "OIDC",
        })
      );
  })

  return (
    <>
      <Helmet htmlAttributes={{ lang: "fr" }}>
        <title>{`Répondre à une enquête de la statistique publique`}</title>
        <meta
          name="description"
          content={`Sélectionnez votre enquête sur le portail de la statistique publique`}
        />
      </Helmet>

      {isConfigLoaded && (
        <>
          <BrowserRouter>
            <Switch>
              <Route
                path="/:id"
                render={routeProps => (
                  <Main
                    {...routeProps}
                    urlBackEnd={apiRequest.urlBackEnd}
                    urlMySurveys={apiRequest.urlMySurveys}
                    keycloakAuth={apiRequest.keycloakAuth}
                  />
                )}
              />

              <Route
                exact
                path="/"
                render={routeProps => (
                  <Home {...routeProps} urlBackEnd={apiRequest.urlBackEnd} keycloakAuth={apiRequest.keycloakAuth} />
                )}
              />
            </Switch>
          </BrowserRouter>
        </>
      )}
    </>
  );
}
