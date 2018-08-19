import React, {Component} from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';

import './FieldComponent.scss';

class FieldComponent extends Component {
  static propTypes = {
    data: PropTypes.arrayOf(
      PropTypes.arrayOf(
        PropTypes.number
      )
    )
  };

  renderCell = (value, key) => {
    const className = cn('field__row__cell', {
      'field__row__cell--filled': value === 1,
      'field__row__cell--empty': value === -1
    });

    return (
      <div
        key={key}
        className={className}
      />
    )
  };

  render() {
    const {data} = this.props;

    return (
      <div className='field'>
        {data.map((row, key) => (
          <div key={key} className='field__row'>
            {row.map(this.renderCell)}
          </div>
        ))}
      </div>
    );
  }
}

export default FieldComponent;
