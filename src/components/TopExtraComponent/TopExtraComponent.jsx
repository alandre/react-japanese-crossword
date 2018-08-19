import React, {Component} from 'react';
import PropTypes from 'prop-types';

import './TopExtraComponent.scss';

class TopExtraComponent extends Component {
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
      <div className='top-extra'>
        {data.map((groups, key) => (
          <div key={key} className='top-extra__column'>
            {groups.map((group, key2) => (
              <div key={key2} className={'top-extra__column__cell' + (group.completed ? ' top-extra__column__cell--completed' : '')}>
                {group.value}
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  }
}

export default TopExtraComponent;
