import React from 'react';
import PropTypes from 'prop-types';
import './CategoriesListDropDown.style.css';

const DropDownView = ({
  options,
  label,
  onSelect,
  showFilterIcon = false,
  selectedOptionValue,
}) => {
  const handleChange = (event) => {
    const selectedValue = event.target.value;

    const selectedOption =
      typeof options[0] === 'string'
        ? selectedValue
        : options.find((opt) => String(opt.value) === selectedValue);

    onSelect?.(selectedOption);
  };

  return (
    <select
      onChange={handleChange}
      value={selectedOptionValue || ''}
      className={`view-dropdown-select ${showFilterIcon ? 'all-filters' : ''}`}
    >
      {label && <option value="">{label}</option>}

      {options.map((item) => {
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
      })}
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
  label: PropTypes.string,
  onSelect: PropTypes.func,
  showFilterIcon: PropTypes.bool,
  selectedOptionValue: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
};

DropDownView.defaultProps = {
  label: '',
  onSelect: undefined,
  showFilterIcon: false,
  selectedOptionValue: '',
};

export default DropDownView;
