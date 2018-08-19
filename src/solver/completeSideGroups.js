/**
 * Завршает все группы, прижатые к краю строки/столбца
 * @param {Game} game Текущее состояние игры
 * @returns {Game}
 */
export default function completeSideGroups(game) {
  completeSideRowGroups(game);
  completeSideColumnGroups(game);

  return game;
}

/**
 *
 * @param {Game} game
 * @returns {Game}
 */
function completeSideRowGroups(game) {
  for (let i = 0; i < game.height; i++) {
    let {startIndex, groupIndex} = getSideRowGroupInfo(game.field, i, 'right');
    if (startIndex !== -1) {
      for (let j = 0; j < groupIndex + 1; j++) {
        game.left[i][j].completed = true;
      }

      for (let j = 0; j < game.left[i][groupIndex].value; j++) {
        game.field[i][startIndex + j] = 1;
      }

      game.field[i][startIndex + game.left[i][groupIndex].value] = -1;
    }

    ({startIndex, groupIndex} = getSideRowGroupInfo(game.field, i, 'left'));
    const groupsCount = game.left[i].length;
    if (startIndex !== -1) {
      for (let j = 0; j < groupIndex + 1; j++) {
        game.left[i][groupsCount - 1 - j].completed = true;
      }

      for (let j = 0; j < game.left[i][groupsCount - 1 - groupIndex].value; j++) {
        game.field[i][startIndex - j] = 1;
      }

      game.field[i][startIndex - game.left[i][groupsCount - 1 - groupIndex].value] = -1;
    }
  }

  return game;
}

/**
 *
 * @param {Game} game
 * @returns {Game}
 */
function completeSideColumnGroups(game) {
  for (let i = 0; i < game.width; i++) {
    let {startIndex, groupIndex} = getSideColumnGroupInfo(game.field, i, 'down');
    if (startIndex !== -1) {
      for (let j = 0; j < groupIndex + 1; j++) {
        game.top[i][j].completed = true;
      }

      for (let j = 0; j < game.top[i][groupIndex].value; j++) {
        game.field[startIndex + j][i] = 1;
      }

      game.field[startIndex + game.top[i][groupIndex].value][i] = -1;
    }

    ({startIndex, groupIndex} = getSideColumnGroupInfo(game.field, i, 'up'));
    if (startIndex !== -1) {
      const groupsCount = game.top[i].length;
      for (let j = 0; j < groupIndex + 1; j++) {
        game.top[i][groupsCount - 1 - j].completed = true;
      }

      for (let j = 0; j < game.top[i][groupsCount - 1 - groupIndex].value; j++) {
        game.field[startIndex - j][i] = 1;
      }

      game.field[startIndex - game.top[i][groupsCount - 1 - groupIndex].value][i] = -1;
    }
  }

  return game;
}

/**
 *
 * @param {Field} field
 * @param {Number} row
 * @param {String} direction
 * @returns {{groupIndex: number, startIndex: number}}
 */
function getSideRowGroupInfo(field, row, direction = 'right') {
  let groupIndex = 0, startIndex = 0, lastCell;
  const width = field[row].length;

  let iterStart = 0, iterFunc = i => i < width, iterStep = 1;
  if (direction === 'left') {
    iterStart = startIndex = width - 1;
    iterFunc = i => i >= 0;
    iterStep = -1;
  }

  lastCell = field[row][iterStart];

  for (let i = iterStart; iterFunc(i); i += iterStep) {
    if (field[row][i] !== lastCell) {
      switch (field[row][i]) {
        case 0:
          if (lastCell === -1) {
            startIndex = -1;
          }

          return {groupIndex, startIndex};

        case -1:
          if (lastCell === 0) {
            return {
              groupIndex, startIndex: -1
            };
          }

          groupIndex++;
          lastCell = field[row][i];
          break;

        case 1:
          if (lastCell === 0) {
            return {
              groupIndex, startIndex: -1
            };
          }

          startIndex = i;
          lastCell = field[row][i];
          break;

        default:
          break;
      }
    }
  }

  return {
    groupIndex, startIndex: -1
  };
}

/**
 *
 * @param {Field} field
 * @param {Number} column
 * @param {String} direction
 * @returns {{groupIndex: number, startIndex: number}}
 */
function getSideColumnGroupInfo(field, column, direction = 'down') {
  let groupIndex = 0, startIndex = 0, lastCell;
  const height = field.length;

  let iterStart = 0, iterFunc = i => i < height, iterStep = 1;
  if (direction === 'up') {
    iterStart = startIndex = height - 1;
    iterFunc = i => i >= 0;
    iterStep = -1;
  }

  lastCell = field[iterStart][column];

  for (let i = iterStart; iterFunc(i); i += iterStep) {
    if (field[i][column] !== lastCell) {
      switch (field[i][column]) {
        case 0:
          if (lastCell === -1) {
            startIndex = -1;
          }

          return {groupIndex, startIndex};

        case -1:
          if (lastCell === 0) {
            return {
              groupIndex, startIndex: -1
            };
          }

          groupIndex++;
          lastCell = field[i][column];
          break;

        case 1:
          if (lastCell === 0) {
            return {
              groupIndex, startIndex: -1
            };
          }

          startIndex = i;
          lastCell = field[i][column];
          break;

        default:
          break;
      }
    }
  }

  return {
    groupIndex, startIndex: -1
  };
}
