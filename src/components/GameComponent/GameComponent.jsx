import React, { Component } from 'react';
import PropTypes from 'prop-types';

import LeftExtraComponent from '../LeftExtraComponent/LeftExtraComponent';
import TopExtraComponent from '../TopExtraComponent/TopExtraComponent';
import FieldComponent from '../FieldComponent/FieldComponent';

class GameComponent extends Component {
  static propTypes = {
    field: PropTypes.arrayOf(
      PropTypes.arrayOf(PropTypes.number)
    ),
    left: PropTypes.arrayOf(
      PropTypes.arrayOf(
        PropTypes.shape({
          completed: PropTypes.bool,
          value: PropTypes.number
        })
      )
    ),
    top: PropTypes.arrayOf(
      PropTypes.arrayOf(
        PropTypes.shape({
          completed: PropTypes.bool,
          value: PropTypes.number
        })
      )
    )
  };

  render() {
    const {field, left, top} = this.props;

    return (
      <div className='game'>
        <table>
          <tbody>
            <tr>
              <td />
              <td>
                <TopExtraComponent data={top} />
              </td>
            </tr>
            <tr>
              <td>
                <LeftExtraComponent data={left} />
              </td>
              <td>
                <FieldComponent data={field} />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}

export default GameComponent;
