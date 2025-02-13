import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import './Radio.styles.css';

/**
 * Primary UI component for user interaction
 */

export const Radio = ({
  indeterminate = false,
  label,
  name,
  value,
  onChange,
  checked,
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
    <div className="category-input radio">
      <label>
        <input
          type="radio"
          name={name}
          value={value}
          checked={checked}
          onChange={onChange}
          ref={cRef}
          className={className}
        />
        {label}
      </label>
    </div>
  );
};

Radio.propTypes = {
  indeterminate: PropTypes.bool,
  checked: PropTypes.bool,
  active: PropTypes.bool,
  label: PropTypes.string,
  name: PropTypes.string,
  value: PropTypes.string,
  className: PropTypes.string,
  onChange: PropTypes.func,
  toggleTopicsList: PropTypes.func,
};

Radio.defaultProps = {
  indeterminate: false,
  checked: false,
  active: false,
  label: null,
  name: null,
  className: null,
  value: null,
  onChange: undefined,
  toggleTopicsList: undefined,
};
