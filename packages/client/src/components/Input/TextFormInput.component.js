import React from 'react';
import PropTypes from 'prop-types';
import './FormInput.style.css';

const TextFormInput = ({
  value,
  type,
  placeholder,
  error,
  label,
  onChange,
  className,
  classNameWrapper,
}) => {
  return (
    <div className={['input-wrapper', classNameWrapper].join(' ')}>
      {label && <label>{label}</label>}
      <input
        className={['form-input', className].join(' ')}
        placeholder={placeholder}
        type={type}
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
        }}
      />
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

TextFormInput.propTypes = {
  value: PropTypes.string.isRequired,
  label: PropTypes.string,
  placeholder: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  error: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]).isRequired,
  className: PropTypes.string,
  classNameWrapper: PropTypes.string,
};

TextFormInput.defaultProps = {
  className: null,
  classNameWrapper: null,
  label: null,
};

export default TextFormInput;
