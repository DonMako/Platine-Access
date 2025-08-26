import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Navbar, Nav, NavItem, Glyphicon } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { Link } from "react-router-dom";
import { urlInseeFr } from "utils/properties";
import logoTwitter from "img/common/logo-twitter.png";
import { getResultsMenuTitle, getSurveyDetailLink } from "utils/read-content";
import { getIsSurveyOnlineById } from "../../utils/read-content";

export default function Menu({ id }) {
  const [isDesktop, setIsDesktop] = useState(window.innerWidth > 767);
  const updateFooterMenu = () => {
    if (window.innerWidth <= 767) {
      setIsDesktop(false);
    } else {
      setIsDesktop(true);
    }
  };
  useEffect(() => {
    window.addEventListener("resize", updateFooterMenu);
    return () => window.removeEventListener("resize", updateFooterMenu);
  });
  return (
    <div className="container-fluid">
      <div className="row">
        <Navbar collapseOnSelect fluid>
          <Navbar.Header>
            <Navbar.Brand>
              <Link to={`/${id}`}>
                <Glyphicon glyph="home" />
              </Link>
            </Navbar.Brand>
            <Navbar.Toggle />
          </Navbar.Header>
          <Navbar.Collapse>
            <Nav>
              <NavItem
                href={`/${id}/login`}
                to={`/${id}/login`}
                eventKey={1}
                id="menuItemRepondre"
                disabled={!getIsSurveyOnlineById(id)}
              >
                {`Accéder au questionnaire`}
              </NavItem>

              <LinkContainer to={`/${id}/donnees-personnelles`}>
                <NavItem eventKey={2}>{`Données personnelles`}</NavItem>
              </LinkContainer>

              <LinkContainer to={`/${id}/utilite-reponse`}>
                <NavItem eventKey={3}>{`À quoi servent vos réponses ?`}</NavItem>
              </LinkContainer>
              <LinkContainer to={`/${id}/courrier-enquetes`}>
                <NavItem eventKey={4}>{`Courrier aux enquêtés`}</NavItem>
              </LinkContainer>
              <LinkContainer to={`/${id}/resultats`}>
                <NavItem eventKey={5}>{getResultsMenuTitle(id)}</NavItem>
              </LinkContainer>
              <NavItem eventKey={6} href={getSurveyDetailLink(id)} target="_blank">
                {`L"enquête en détail`}
              </NavItem>
              {!isDesktop && (
                <>
                  <NavItem eventKey={7} href={`/${id}/faq`}>
                    {`Questions/réponses`}
                  </NavItem>
                  {getIsSurveyOnlineById(id) && (
                    <NavItem eventKey={8} href={`/${id}/contacter-assistance`}>
                      {`Contacter l"assistance`}
                    </NavItem>
                  )}

                  <NavItem eventKey={9} href={`/${id}/accessibilite`}>
                    {`Accessibilité`}
                  </NavItem>
                  <NavItem
                    eventKey={10}
                    href={urlInseeFr}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {`Accéder au site de l"Insee`}
                  </NavItem>
                  <NavItem eventKey={11} href="https://twitter.com/inseefr" target="_blank">
                    <img width={30} height={30} alt="logo-twitter" src={logoTwitter} />
                  </NavItem>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      </div>
    </div>
  );
}

Menu.propTypes = {
  id: PropTypes.string.isRequired,
};
