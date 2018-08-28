/**
 *
 * @param {Game} game
 * @param {String} type
 */
export default function partiallyFill(game, type = 'normal') {
  switch (type) {
    case 'normal':
      partiallyFillNormal(game);
      break;

    case 'inverse':
      partiallyFillInverse(game);
      break;

    default:
      break;
  }

  return game;
}

function partiallyFillNormal(game) {
  const result = game.field.map(i => i.slice());

  for (let i = 0; i < game.height; i++) {
    fillLine(game.width, result[i].slice(), game.left[i], new Array(game.width).fill(0), result, i);

    for (let j = 0; j < game.width; j++) {
      if (result[i][j] !== -2) {
        game.field[i][j] = result[i][j];
      }
    }
  }
}

function partiallyFillInverse(game) {
  const result = [...Array(game.width)]
    .map((q, i) => [...Array(game.height)]
      .map((w, j) => game.field[j][i])
    );

  for (let i = 0; i < game.width; i++) {
    fillLine(
      game.height,
      result[i].slice(),
      game.top[i],
      new Array(game.height).fill(0),
      result,
      i
    );

    for (let j = 0; j < game.height; j++) {
      if (result[i][j] !== -2) {
        game.field[j][i] = result[i][j];
      }
    }
  }
}

function fillLine(
  width,
  originalLine,
  blocks,
  setting,
  result,
  fillingLine = 0,
  currentBlock = 0,
  startIndex = 0
) {
  if (blocks.length === currentBlock) {
    markLine(width, setting);
    patchLine(width, originalLine, result, setting, fillingLine);
    return;
  }

  if (setting.length === startIndex) {
    return;
  }

  const currentBlockLength = blocks[currentBlock].value;
  for (let i = startIndex; i <= setting.length - currentBlockLength; i++)
  {
    const newSetting = subFill(setting, i, currentBlockLength, originalLine);
    if (!newSetting) {
      continue;
    }
    fillLine(width, originalLine, blocks, newSetting, result, fillingLine, currentBlock + 1, i + currentBlockLength + 1);
  }
}

function markLine(width, setting) {
  for (let i = 0; i < width; i++) {
    setting[i] = setting[i] || -1;
  }
}

function patchLine(width, originalLine, result, setting, patchedLine) {
  for (let i = 0; i < width; i++) {
    if (originalLine[i] && setting[i] !== originalLine[i]) {
      return;
    }
  }
  for (let i = 0; i < width; i++) {
    if (result[patchedLine][i] === 0) {
      result[patchedLine][i] = setting[i];
    } else if (result[patchedLine][i] !== -2) {
      result[patchedLine][i] = result[patchedLine][i] === setting[i] ? setting[i] : -2;
    }
  }
}

function subFill(setting, i, currentLength, originalLine) {
  const result = setting.slice();
  if (originalLine[i - 1] === 1) {
    return false;
  }
  if (originalLine[currentLength + i] === 1) {
    return false;
  }
  for (let index = i; index < setting.length && index < currentLength + i; index++) {
    if (originalLine[index] && originalLine[index] !== 1) {
      return false;
    }
    result[index] = 1;
  }
  return result;
}