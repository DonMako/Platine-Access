import React from 'react';
import ReactLoading from 'react-loading';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

export default function Loading({ id }) {
  return (
    <Link to={`/${id}`}>
      <div className={`wrap-loader`}>
        <ReactLoading type="cylon" color={`#0f417a`} width="150px" className="loader" />
        <h3>{`Veuillez patienter`}</h3>
      </div>
    </Link>
  );
};

Loading.propTypes = {
  id: PropTypes.string.isRequired,
};
