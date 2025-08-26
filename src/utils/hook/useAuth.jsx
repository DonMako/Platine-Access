import { useState, useEffect } from "react";
import { keycloakAuthentication, kc, refreshToken } from "utils/keycloak";

export default function useAuth({use = false}) {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(false);

  const accessAuthorized = () => {
    setLoading(false);
    setAuthenticated(true);
  };

  const accessDenied = () => {
    setLoading(false);
    setAuthenticated(false);
  };

  useEffect(() => {
    if (use) {
      if (!kc.authenticated) {
        keycloakAuthentication({ onLoad: "login-required", checkLoginIframe: false })
          .then(auth => {
            if (auth) {
              accessAuthorized();
            } else {
              accessDenied();
            }
          })
          .catch(() => {
            setAuthError(true);
            return accessDenied();
          });
      } else {
        // already authenticated : refreshToken
        refreshToken()
          .then(() => accessAuthorized())
          .catch(() => {
            setAuthError(true);
            return accessDenied();
          });
      }
    } else {
      accessAuthorized();
    }
  }, [use]);
  
  return { authenticated, loading, authError };
};
