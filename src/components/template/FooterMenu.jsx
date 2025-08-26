import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Navbar, Nav, NavItem } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import logoTwitter from "img/common/logo-twitter.png";
import { urlInseeFr } from "utils/properties";
import { getIsSurveyOnlineById } from "utils/read-content";

export default function FooterMenu({ path, home, id }) {
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
    <>
      {home && (
        <Navbar.Collapse>
          <Navbar fixedBottom>
            <Nav>
              <NavItem eventKey={1} href={urlInseeFr} target="_blank" rel="noopener noreferrer">
                {`Accéder au site de l"Insee`}
              </NavItem>
            </Nav>
            <Nav pullRight>
              <NavItem href="https://twitter.com/inseefr" target="_blank">
                <img width={30} height={30} alt="logo-twitter" src={logoTwitter} />
              </NavItem>
            </Nav>
          </Navbar>
        </Navbar.Collapse>
      )}
      {!home && isDesktop && (
        <Navbar.Collapse>
          <Navbar fixedBottom>
            <Nav>
              <LinkContainer to={`/${id}/faq`}>
                <NavItem eventKey={1}>{`Questions/réponses`}</NavItem>
              </LinkContainer>
              {getIsSurveyOnlineById(id) && (
                <LinkContainer to={`/${id}/contacter-assistance`}>
                  <NavItem eventKey={2}>{`Contacter l"assistance`}</NavItem>
                </LinkContainer>
              )}
              <LinkContainer to={`/${id}/accessibilite`}>
                <NavItem eventKey={3}>{`Accessibilité`}</NavItem>
              </LinkContainer>
              <NavItem eventKey={4} href={urlInseeFr} target="_blank" rel="noopener noreferrer">
                {`Accéder au site de l"Insee`}
              </NavItem>
            </Nav>
            <Nav pullRight>
              <NavItem href="https://twitter.com/inseefr" target="_blank">
                <img width={30} height={30} alt="logo-twitter" src={logoTwitter} />
              </NavItem>
            </Nav>
          </Navbar>
        </Navbar.Collapse>
      )}
    </>
  );
}

FooterMenu.propTypes = {
  path: PropTypes.string.isRequired,
  home: PropTypes.bool.isRequired,
  id: PropTypes.string.isRequired,
};
