import React from "react";
import { Image } from "react-bootstrap";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { urlInseeFr } from "utils/properties";
import banner from "img/common/banner.png";
import headerMarianneLarge from "img/common/logo-mariane-100dpi.jpg";
import headerInseeLogoLarge from "img/common/logo-insee-100dpi.jpg";
import headerSspLogoLarge from "img/common/logo-ssp-100dpi.jpg";

export default function Banner({ title, id }) {
  return (
    <div>
      <div className={"banner-top"}>
        <div className="img-left">
          <img
            className="img-left"
            src={headerMarianneLarge}
            alt="Marianne de la République française"
          />
        </div>
        <div className="survey-title">
          <Link to={id === undefined ? `/` : `/${id}`}>
            <h1>{title}</h1>
          </Link>
        </div>
        <div className="img-right">
          <img src={headerSspLogoLarge} alt="logo statistique publique" />
          <a href={urlInseeFr} target="_blank" rel="noopener noreferrer">
            <img src={headerInseeLogoLarge} alt="logo insee" />
          </a>
        </div>
      </div>
      <div className={"banner-bottom"}>
        <Image src={banner} responsive />
      </div>
    </div>
  );
}

Banner.propTypes = {
  title: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
};
