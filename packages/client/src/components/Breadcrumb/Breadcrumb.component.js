/* eslint-disable react/react-in-jsx-scope */
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import './Breadcrumb.styles.css';

export const Breadcrumb = ({ items }) => {
  return (
    <nav aria-label="Breadcrumb">
      <ul className="breadcrumb">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={item.label}>
              {isLast || !item.to ? (
                <span aria-current="page">{item.label}</span>
              ) : (
                <div className="breadcrumb-group">
                  <Link className="underline" to={item.to}>
                    {item.label}
                  </Link>
                  <span className="breadcrumb-divider">/</span>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

Breadcrumb.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      to: PropTypes.string,
    }),
  ).isRequired,
};
