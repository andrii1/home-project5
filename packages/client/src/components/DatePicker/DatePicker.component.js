import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import './DatePicker.styles.css';

/**
 * Primary UI component for user interaction
 */

export const DatePicker = ({
  indeterminate = false,
  label,
  name,
  value,
  onChange,
  className,
  toggleTopicsList,
  active,
  ...props
}) => {
  const cRef = useRef();

  useEffect(() => {
    cRef.current.indeterminate = indeterminate;
  }, [cRef, indeterminate]);

  return (
    <div className={className || 'category-input datepicker'}>
      <label>{label}</label>
      <input
        type="date"
        name={name}
        value={value}
        onChange={onChange}
        ref={cRef}
        className={className}
      />
    </div>
  );
};

DatePicker.propTypes = {
  indeterminate: PropTypes.bool,
  active: PropTypes.bool,
  label: PropTypes.string,
  name: PropTypes.string,
  value: PropTypes.string,
  className: PropTypes.string,
  onChange: PropTypes.func,
  toggleTopicsList: PropTypes.func,
};

DatePicker.defaultProps = {
  indeterminate: false,
  active: false,
  label: null,
  name: null,
  className: null,
  value: null,
  onChange: undefined,
  toggleTopicsList: undefined,
};
