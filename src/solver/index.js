import fulfill from './fulfill';
import completeSideGroups from './completeSideGroups';
import partiallyFill from './partiallyFill';

/**
 * @typedef {Object} Game
 * @property {Field} field
 * @property {Array<Array<CellGroup>>} left
 * @property {Array<Array<CellGroup>>} top
 * @property {Number} height
 * @property {Number} width
 * @property {Boolean} solved
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
    left, top, height, width, solved: false,
    field: [...Array(height)]
      .map(() => [...Array(width)]
        .map(() => 0)
      )
  };
}

/**
 * Решает японский кроссворд
 * @param {Game} game Текущее состояние игры
 * @returns {Game} Возвращает решенную картину
 */
export function solve(game) {
  const gen = solveStepByStep(game);

  let {done, value} = gen.next();
  while (!done) {
    ({done, value} = gen.next(value));
  }

  return value;
}

/**
 * Решает японский кроссворд пошагово
 * @param {Game} game Текущее состояние игры
 * @returns {IterableIterator<*>}
 */
export function* solveStepByStep(game) {
  console.log('fulfill');
  game = yield fulfill(game);
  while (!game.solved) {
    console.log('completeSideGroups');
    game = yield completeSideGroups(game);
    console.log('partiallyFill normal');
    game = yield partiallyFill(game, 'normal');
    console.log('partiallyFill inverse');
    game = yield partiallyFill(game, 'inverse');
  }

  return game;
}
