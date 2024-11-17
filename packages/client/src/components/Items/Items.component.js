import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import './Items.styles.css';
import TextFormInput from '../Input/TextFormInput.component';
import { Button } from '../Button/Button.component';
import { MAX_ITEMS_WHEEL } from '../../constants';

export const Items = ({ handleAddItem, handleRemoveItem, items }) => {
  const [listItem, setListItem] = useState('');
  const [invalidForm, setInvalidForm] = useState(false);

  const isMaxItemsReached = items.length > MAX_ITEMS_WHEEL;

  console.log(listItem);

  const handleSubmit = (event) => {
    if (listItem === '' || isMaxItemsReached) {
      setInvalidForm(true);
    } else {
      handleAddItem(listItem);
      setListItem('');
      setInvalidForm(false);
    }
  };

  return (
    <section>
      <h2>Add Items</h2>
      <div className="container-input-button">
        <TextFormInput
          value={listItem}
          placeholder="Enter item"
          onChange={setListItem}
        />
        <Button primary label="Add item" onClick={handleSubmit} />
      </div>
      <ol className="list-items-wheel">
        {items.map((item, index) => {
          return (
            <div className="container-item-button-wheel">
              <li>
                <p>{item}</p>
              </li>
              <Button
                secondary
                label="Remove"
                onClick={() => handleRemoveItem(index)}
              />
            </div>
          );
        })}
      </ol>
      {invalidForm && <p className="error-message">Form is not valid</p>}
      {isMaxItemsReached && <p className="error-message">Max items reached</p>}
    </section>
  );
};

Items.propTypes = {
  handleAddItem: PropTypes.func,
  handleRemoveItem: PropTypes.func,
  items: PropTypes.shape,
};

Items.defaultProps = {
  handleAddItem: undefined,
  handleRemoveItem: undefined,
  items: null,
};
