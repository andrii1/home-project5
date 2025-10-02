import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './CategoriesListDropDown.style.css';

const DropDownView = ({
  options,
  label,
  onSelect,
  showFilterIcon = false,
  selectedOptionValue,
}) => {
  const [value, setValue] = useState(selectedOptionValue || '');

  const handleChange = (event) => {
    const selectedValue = event.target.value;
    setValue(selectedValue);

    // If options are objects, find the full option
    const selectedOption =
      typeof options[0] === 'string'
        ? selectedValue
        : options.find((opt) => String(opt.value) === selectedValue);

    // Pass either the raw string or the object.value
    onSelect?.(
      typeof selectedOption === 'string'
        ? selectedOption
        : selectedOption?.value,
    );
  };

  const optionList =
    options.length > 0 &&
    options.map((item) => {
      if (typeof item === 'string') {
        return (
          <option key={item} value={item}>
            {item}
          </option>
        );
      }
      return (
        <option key={item.value} value={item.value}>
          {item.label}
        </option>
      );
    });

  return (
    <select
      onChange={handleChange}
      value={value}
      className={`view-dropdown-select ${showFilterIcon ? 'all-filters' : ''}`}
      // {...props}
    >
      {label && <option value="">{label}</option>}
      {optionList}
    </select>
  );
};

DropDownView.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape({
        label: PropTypes.string.isRequired,
        value: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
          .isRequired,
      }),
    ]),
  ).isRequired,
  label: PropTypes.string.isRequired,
  onSelect: PropTypes.func,
  showFilterIcon: PropTypes.bool,
  selectedOptionValue: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
};

DropDownView.defaultProps = {
  onSelect: undefined,
  showFilterIcon: false,
  selectedOptionValue: '',
};

export default DropDownView;
