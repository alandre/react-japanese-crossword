import React, { Component } from 'react';
import PropTypes from 'prop-types';

import LeftExtraComponent from '../LeftExtraComponent/LeftExtraComponent';
import TopExtraComponent from '../TopExtraComponent/TopExtraComponent';
import FieldComponent from '../FieldComponent/FieldComponent';

class GameComponent extends Component {
  static propTypes = {

    field: PropTypes.arrayOf(
      PropTypes.arrayOf(PropTypes.number)
    ).isRequired,
    left: PropTypes.arrayOf(
      PropTypes.arrayOf(
        PropTypes.shape({
          completed: PropTypes.bool,
          value: PropTypes.number
        })
      )
    ).isRequired,
    top: PropTypes.arrayOf(
      PropTypes.arrayOf(
        PropTypes.shape({
          completed: PropTypes.bool,
          value: PropTypes.number
        })
      )
    ).isRequired,
    onNextStepClick: PropTypes.func
  };

  render() {
    const {field, left, top, onNextStepClick} = this.props;

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

        <button onClick={onNextStepClick}>Next step</button>
      </div>
    );
  }
}

export default GameComponent;
