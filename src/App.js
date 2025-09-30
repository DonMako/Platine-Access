import { useEffect, useState } from "react";
import { Route, BrowserRouter, Switch } from "react-router-dom";
import { Helmet } from "react-helmet";
import Main from "components/main";
import Home from "components/home";

/** adresse du fichier de conf. Les propriétées sont fetchées dans dans la méthode componentDidMount */
const apiConfigPath = `${window.location.origin}/configuration.json`;

export default function App() {
  const [urlBackEnd, setUrlBackEnd] = useState(null);
  const [urlMySurveys, setUrlMySurveys] = useState(null);
  const [isConfigLoaded, setIsConfigLoad] = useState(false);
  const [keycloakAuth, setKeycloakAuth] = useState(null);

  useEffect(() => {
    fetch(apiConfigPath)
      .then(response => response.json())
      .then(data =>
        setUrlBackEnd(data.urlColemanPromotionBack);
        setUrlMySurveys(data.urlSurveys);
        setIsConfigLoaded(true);
        setKeycloakAuth(data.authType === "OIDC")
      );
  }, [])

  return (
    <>
      <Helmet htmlAttributes={{ lang: 'fr' }}>
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
                    urlBackEnd={urlBackEnd}
                    urlMySurveys={urlMySurveys}
                    keycloakAuth={keycloakAuth}
                  />
                )}
              />

              <Route
                exact
                path="/"
                render={routeProps => (
                  <Home {...routeProps} urlBackEnd={urlBackEnd} keycloakAuth={keycloakAuth} />
                )}
              />
            </Switch>
          </BrowserRouter>
        </>
      )}
    </>
  );
}
