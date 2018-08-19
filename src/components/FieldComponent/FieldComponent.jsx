import React, {Component} from 'react';
import PropTypes from 'prop-types';

import './FieldComponent.scss';

class FieldComponent extends Component {
  static propTypes = {
    data: PropTypes.arrayOf(
      PropTypes.arrayOf(
        PropTypes.number
      )
    )
  };

  render() {
    const {data} = this.props;

    return (
      <div className='field'>
        {data.map((row, key) => (
          <div key={key} className='field__row'>
            {row.map((cell, key2) => (
              <div
                key={key2}
                className={'field__row__cell' + (cell === 1 ? ' field__row__cell--filled' : '')}
              />
            ))}
          </div>
        ))}
      </div>
    );
  }
}

export default FieldComponent;
