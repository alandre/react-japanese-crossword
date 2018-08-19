/**
 * @typedef {Object} Game
 * @property {Field} field
 * @property {Array<Array<CellGroup>>} left
 * @property {Array<Array<CellGroup>>} top
 */

/**
 * @typedef {Object} CellGroup
 * @property {Boolean} completed
 * @property {Number} value
 */

/**
 * @typedef {Array<Array<Number>>} Field
 */

/**
 * Преобразует строку, приходящую с сервера, в начальное состояние игры
 * @param {String} data приходящая с сервера строка с информациекй об игре
 * @returns {Game} Возаращает начальное состояние игры
 */
export function parse(data) {
  const height = +data.split('#')[1].split(',')[0];
  const width = +data.split('#')[1].split(',')[1];

  const left = data.split('#')[3].split('|').slice(0, -1).map(i => i.split(',').map(i => ({value: +i, completed: false})));
  const top = data.split('#')[4].split('|').slice(0, -1).map(i => i.split(',').map(i => ({value: +i, completed: false})));

  return {
    left, top, height, width,
    field: [...Array(height)]
      .map(() => [...Array(width)]
        .map(() => 0)
      )
  };
}

/**
 * Решает японский кроссворд
 * @param {Game} game Текущее состояние игры
 * @returns {undefined}
 */
export function solve(game) {
  fulfill(game);
}

/**
 * Заполняет все строки/столбцы, в которых очевидно единственный вариант расположения
 * @param {Game} game Текущее состояние игры
 * @returns {undefined}
 */
function fulfill(game) {
  game.left.forEach((groups, rowIndex) => {
    const {groupsCount, simple, groupSum, startGroupIndex} = getExtraRowInfo(groups);
    if (!simple) {
      return;
    }

    const {rowSum, startRowIndex} = getRowInfo(game.field, rowIndex);

    if (groupSum + groupsCount - 1 === rowSum) {
      let filled = startRowIndex;
      for (let groupIndex = 0; groupIndex < groupsCount; groupIndex++) {
        const group = groups[startGroupIndex + groupIndex];
        for (let i = 0; i < group.value; i++) {
          game.field[rowIndex][filled + i] = 1;
        }

        if (groupIndex !== groupsCount - 1) {
          game.field[rowIndex][filled + group.value] = -1;
        }

        filled += group.value + 1;
        group.completed = true;
      }
    }
  });

  game.top.forEach((groups, columnIndex) => {
    const {groupsCount, simple, groupSum, startGroupIndex} = getExtraRowInfo(groups);
    if (!simple) {
      return;
    }

    const {columnSum, startColumnIndex} = getColumnInfo(game.field, columnIndex);

    if (groupSum + groupsCount - 1 === columnSum) {
      let filled = startColumnIndex;
      for (let groupIndex = 0; groupIndex < groupsCount; groupIndex++) {
        const group = groups[startGroupIndex + groupIndex];
        for (let i = 0; i < group.value; i++) {
          game.field[filled + i][columnIndex] = 1;
        }

        if (groupIndex !== groupsCount - 1) {
          game.field[filled + group.value][columnIndex] = -1;
        }

        filled += group.value + 1;
        group.completed = true;
      }
    }
  });
}

/**
 * Вычисляет информацию о левой доп. строке (или верхнем доп. столбце)
 * @param {Array<CellGroup>} row Дополнительная строка/столбец
 * @returns {{groupsCount: number, groupSum: number, startGroupIndex: number, simple: boolean}} Возврашает информацию о дополнительных строке/столбце
 */
function getExtraRowInfo(row) {
  let groupsCount = 0, sum = 0, startIndex = 0, changesCount = 0, lastCompleted = row[0].completed;

  row.forEach((group, index) => {
    if (group.completed !== lastCompleted) {
      changesCount++;
      lastCompleted = group.completed;

      if (!group.completed) {
        startIndex = index;
      }
    }

    if (!group.completed) {
      groupsCount++;
      sum += group.value;
    }
  });

  return {
    groupsCount, groupSum: sum, startGroupIndex: startIndex,
    simple: row[0].completed ? changesCount < 3 : changesCount < 2
  };
}

/**
 * Вычисляет информацию о строке
 * @param {Field} field Игровое поле
 * @param {Number} row Номер строки
 * @returns {{rowSum: number, startRowIndex: number}} Возвращает сумму незаполненных ячеек и индекс начала пустоты
 */
function getRowInfo(field, row) {
  let startIndex = 0, lastCell = field[row][0];
  const rowSum = field[row].reduce((result, i, index) => {
    if (!i && lastCell) {
      lastCell = i;
      startIndex = index;
    }
    return result + (!i ? 1 : 0);
  }, 0);

  return {
    rowSum, startRowIndex: startIndex
  };
}

/**
 * Вычисляет информацию о колонке
 * @param {Field} field Игровое поле
 * @param {Number} column Номер колонки
 * @returns {{columnSum: number, startColumnIndex: number}} Возвращает сумму незаполненных ячеек и индекс начала пустоты
 */
function getColumnInfo(field, column) {
  let startIndex = 0, lastCell = field[0][column];
  const columnSum = field.reduce((result, row, index) => {
    if (!row[column] && lastCell) {
      lastCell = row[column];
      startIndex = index;
    }
    return result + (!row[column] ? 1 : 0);
  }, 0);

  return {
    columnSum, startColumnIndex: startIndex
  };
}
