import React, {Component} from 'react';
import PropTypes from 'prop-types';

import './LeftExtraComponent.scss';

class LeftExtraComponent extends Component {
  static propTypes = {
    data: PropTypes.arrayOf(
      PropTypes.arrayOf(
        PropTypes.shape({
          completed: PropTypes.bool,
          value: PropTypes.number
        })
      )
    )
  };

  render() {
    const {data} = this.props;

    return (
      <div className='left-extra'>
        {data.map((groups, key) => (
          <div key={key} className='left-extra__row'>
            {groups.map((group, key2) => (
              <div key={key2} className={'left-extra__row__cell' + (group.completed ? ' left-extra__row__cell--completed' : '')}>
                {group.value}
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  }
}

export default LeftExtraComponent;
