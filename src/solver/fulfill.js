/**
 * Заполняет все строки/столбцы, в которых очевидно единственный вариант расположения
 * @param {Game} game Текущее состояние игры
 * @returns {undefined}
 */
export default function fulfill(game) {
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

  return game;
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
  let startIndex = 0, lastCell = field[row][0], filledCount = 0, stopCountingSum = false;
  const rowSum = field[row].reduce((result, i, index) => {
    if (stopCountingSum) {
      return result;
    }

    if (i !== lastCell) {
      switch (i) {
        case 0:
        case 1:
          if (lastCell === -1) {
            startIndex = index;
            result = 1;
          } else {
            result++;
          }

          if (i === 1) {
            filledCount++;
          }
          break;

        case -1:
          if (result !== filledCount) {
            stopCountingSum = true;
            return result;
          }
          break;

        default:
          break;
      }

      lastCell = i;
      if (i === 1) {
        filledCount++;
      }
      return result + (i !== -1 ? 1 : 0);
    }


    return result + (i === -1 ? 0 : 1);
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
  let startIndex = 0, lastCell = field[0][column], filledCount = 0, stopCountingSum = false;
  const columnSum = field.reduce((result, row, index) => {
    const i = row[column];
    if (stopCountingSum) {
      return result;
    }

    if (i !== lastCell) {
      switch (i) {
        case 0:
        case 1:
          if (lastCell === -1) {
            startIndex = index;
            result = 1;
          } else {
            result++;
          }

          if (i === 1) {
            filledCount++;
          }
          break;

        case -1:
          if (result !== filledCount) {
            stopCountingSum = true;
            return result;
          }
          break;

        default:
          break;
      }

      lastCell = i;
      if (i === 1) {
        filledCount++;
      }
      return result;
    }


    return result + (i === -1 ? 0 : 1);
  }, 0);

  return {
    columnSum, startColumnIndex: startIndex
  };
}
