import React from "react";
import PropTypes from "prop-types";
import { Image } from "react-bootstrap";

export default function ImagesViewer({ id }) {
  return (
    <section>
      <div className="images-wrapper">
        <div>
          <Image src={`/img/${id}/courrier/img-01.png`} alt="Courrier page 1" responsive />
        </div>
        <div>
          <Image src={`/img/${id}/courrier/img-02.png`} alt="Courrier page 2" responsive />
        </div>
        <div>
          <Image src={`/img/${id}/courrier/img-03.png`} alt="Courriel" responsive />
        </div>
      </div>
    </section>
  );
}

ImagesViewer.propTypes = {
  id: PropTypes.string.isRequired,
};
