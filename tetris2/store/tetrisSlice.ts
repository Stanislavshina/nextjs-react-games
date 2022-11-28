/* eslint-disable no-continue */
/* eslint-disable no-plusplus */
import { createSlice, PayloadAction, current } from '@reduxjs/toolkit';

import { STAGE_WIDTH, createStage, createNextDetailStage } from '../components/stage/stage';
import { SCORE_COUNT } from '../components/game-score/score-count';
import { DROPTIME_COUNT } from '../components/game-score/drop-time-count';
import { LEVEL_COUNT } from '../components/game-score/level-count';
import { InitialStateType } from '../types/types';
import { randomDetail } from '../components/details/details';

const initialState: InitialStateType = {
  detailsInPlay: [],
  stage: createStage(),
  nextDetailStage: createNextDetailStage(),
  detail: {
    position: { x: STAGE_WIDTH / 2 - 2, y: 0 },
    tetromino: randomDetail().shape,
    collided: false,
  },
  nextDetail: {
    position: { x: STAGE_WIDTH / 2 - 2, y: 0 },
    tetromino: randomDetail().shape,
    collided: false,
  },
  hasCollided: false,
  rotationIdx: 0,
  dropTime: 1000,
  isGameOver: false,
  score: 0,
  linesCleared: 0,
  level: 1,
  countToScore: 0,
};
const tetrisSlice = createSlice({
  name: 'tetris',
  initialState,
  reducers: {
    move(state, action: PayloadAction<string>) {
      const posX = state.detail.position.x;
      const posY = state.detail.position.y;
      const detail = state.detail.tetromino[state.rotationIdx];

      if (!state.isGameOver) {
        switch (action.payload) {
          case 'KeyA':
          case 'ArrowLeft':
            if (!state.detail.collided && !state.hasCollided) {
              state.detail.position.x -= 1;
            } else if (state.hasCollided && !state.detail.collided) {
              state.hasCollided = false;
            }
            if (state.detail.collided) {
              break;
            }
            break;
          case 'KeyD':
          case 'ArrowRight':
            if (!state.detail.collided && !state.hasCollided) {
              state.detail.position.x += 1;
            } else if (state.hasCollided && !state.detail.collided) {
              state.hasCollided = false;
            }
            if (state.detail.collided) {
              break;
            }
            break;
          case 'KeyW':
          case 'ArrowUp':
            if (!state.detail.collided && !state.hasCollided) {
              // далее два if-условия - это проверка на предотвращение выхода за пределы игрового поля при повороте
              if (state.stage[posY][posX] === undefined) {
                state.detail.position.x += 1;
              }
              if (state.stage[posY][posX + detail.length - 1] === undefined) {
                if (posX + detail.length - 1 === 10) {
                  state.detail.position.x -= 1;
                } else if (posX + detail.length - 1 === 11) {
                  state.detail.position.x -= 2;
                }
              }
              if (state.rotationIdx === state.detail.tetromino.length - 1) {
                state.rotationIdx = 0;
              } else {
                state.rotationIdx++;
              }
            }
            if (state.detail.collided) {
              break;
            }
            break;
          case 'KeyS':
          case 'ArrowDown':
            if (!state.hasCollided && !state.detail.collided) {
              // проверка for для возможности фиксации детали, в случае невозможности дальнейшего спуска вниз
              // если эту проверку отсюда убрать, то деталь улетит вниз за пределы экрана
              const length = detail === undefined ? [] : detail.length;
              if (detail === undefined) {
                state.rotationIdx = 0;
                state.detail.tetromino = randomDetail().shape[state.rotationIdx];
              }

              for (let i = 0; i < length; i++) {
                for (let j = 0; j < detail[i].length; j++) {
                  if (detail[i][j] !== 0) {
                    if (
                      state.stage[posY + i + 2] === undefined ||
                      state.stage[posY + i + 2][posX + j][1] !== 'clear'
                    ) {
                      console.log('cur', current(state.stage));
                      state.detail.collided = true;
                    }
                  }
                }
              }
              state.detail.position.y += 1;
            } else if (state.detail.collided && posY < 1) {
              state.isGameOver = true;
            }

            if (state.detail.collided) {
              break;
            }
            break;
          default:
            return state;
        }
      }
    },
    moveDown(state) {
      const posX = state.detail.position.x;
      const posY = state.detail.position.y;
      const detail = state.detail.tetromino[state.rotationIdx];
      if (detail === undefined) {
        state.rotationIdx = 0;
        state.detail.tetromino = randomDetail().shape[state.rotationIdx];
      }
      if (state.detail.collided && posY < 1) {
        state.isGameOver = true;
      }

      if (!state.hasCollided && !state.detail.collided && !state.isGameOver) {
        // проверка for для возможности фиксации детали, в случае невозможности дальнейшего спуска вниз
        // если эту проверку убрать - то деталь не будет останавливаться внизу и уйдет за край экрана
        const length = detail === undefined ? [] : detail.length;
        if (detail === undefined) {
          state.rotationIdx = 0;
          state.detail.tetromino = randomDetail().shape[state.rotationIdx];
        }
        for (let i = 0; i < length; i++) {
          for (let j = 0; j < detail[i].length; j++) {
            if (detail[i][j] !== 0) {
              if (
                state.stage[posY + i + 2] === undefined ||
                state.stage[posY + i + 2][posX + j][1] !== 'clear'
              ) {
                state.detail.collided = true;
                if (state.detail.position.y <= 1) {
                  state.isGameOver = true;
                }
              }
            }
          }
        }
        state.detail.position.y += 1;
      }
    },
    startGame(state) {
      state.stage = createStage();
      state.detail = {
        position: {
          x: STAGE_WIDTH / 2 - 2,
          y: 0,
        },
        tetromino: randomDetail().shape,
        collided: false,
      };
      state.nextDetail = {
        position: {
          x: STAGE_WIDTH / 2 - 2,
          y: 0,
        },
        tetromino: randomDetail().shape,
        collided: false,
      };
      state.hasCollided = false;
      state.rotationIdx = 0;
      state.dropTime = 1000;
      state.isGameOver = false;
      state.score = 0;
      state.linesCleared = 0;
      state.level = 1;
    },
    setNextDetail(state) {
      // отрисовка след детали на боковой панели (замена детали происходит в функции updateActivePiece)
      // создали дубликат новой боковой панели
      const newStage = state.nextDetailStage.map((row: number[]) =>
        row.map((cell: number) => {
          cell = 0;
          return cell;
        }),
      );

      const updatedNextDetail = state.nextDetail.tetromino[0];
      // если клетка детали окрашена - переносим в новую боковую панель
      updatedNextDetail.forEach((row: number[], y: number) => {
        row.forEach((value, x) => {
          if (value !== 0) {
            newStage[1 + y][1 + x] = value;
          }
        });
      });
      // обновили стейт боковой панели
      state.nextDetailStage = newStage;
    },
    updateDetailPostion(state) {
      // отрисовка активной и уже выпавших деталей на поле:
      try {
        let detail = state.detail.tetromino[state.rotationIdx];

        if (detail === undefined) {
          const data = randomDetail().shape[state.rotationIdx];
          state.rotationIdx = 0;
          state.detail.tetromino = data;
          detail = data;
        }
        const { x, y } = state.detail.position;
        const newStage = state.stage.map((row) =>
          row.map((value: any) => (value[1] === 'clear' ? [0, 'clear'] : value)),
        );

        try {
          detail.forEach((row: number[], i: number) => {
            row.forEach((value, j) => {
              if (value !== 0 && !state.hasCollided) {
                newStage[i + y][j + x] = [value, `${state.detail.collided ? 'merged' : 'clear'}`];
              }
            });
          });
        } catch (error) {
          state.rotationIdx = 0;
          state.detail.tetromino = randomDetail().shape[state.rotationIdx];
          state.detail.collided = true;
          console.log('error in detail render', current(state.detail));
        }

        state.stage = newStage;
      } catch (error) {
        console.log('Error in updateDetailPostion');
      }
    },
    updateActivePiece(state) {
      // замена активной детали на next
      try {
        // чтобы на поле отображались все ранее выпавшие детали -
        // делаем обновление целиком детали, а не только tetromino
        // при этом nextDetail меняем в отдельной функции, иначе nextStage будет показывать
        // активную деталь, а не следующую
        if (!state.detail.collided && state.detail.position.y <= 3) {
          state.isGameOver = true;
        }
        state.detail = state.nextDetail;
        state.detail.collided = false;
      } catch (error) {
        console.log('Error in updateActivePiece');
      }
    },
    updateNextPiece(state) {
      try {
        // делаем обновление nextDetail:
        const fig = randomDetail();
        state.nextDetail.tetromino = fig.shape;
      } catch (error) {
        console.log('Error in updateNextPiece');
      }
    },
    checkCollided(state, action) {
      // posX & posY - предстоящее передвижение, в зависимости от нажатой клавиши.
      // Т.е.если мы нажали, а движение туда невозможно, то должна сработать проверка на collided - ниже
      let posX = 0;
      let posY = 0;
      const { x, y } = state.detail.position;
      const detail = state.detail.tetromino[state.rotationIdx];
      if (detail === undefined) {
        state.rotationIdx = 0;
        state.detail.tetromino = randomDetail().shape[state.rotationIdx];
      }

      switch (action.payload) {
        case 'KeyA':
        case 'ArrowLeft':
          posX = -1;
          break;
        case 'KeyD':
        case 'ArrowRight':
          posX = 1;
          break;
        case 'KeyS':
        case 'ArrowDown':
          posY = 1;
          break;
        default:
          return state;
      }

      try {
        for (let i = 0; i < detail.length; i++) {
          for (let j = 0; j < detail[i].length; j++) {
            if (
              detail[i][j] !== 0 &&
              (state.stage[y + i + posY] === undefined ||
                state.stage[y + i + posY][x + j + posX] === undefined ||
                state.stage[y + i + posY][x + j + posX][1] !== 'clear')
            ) {
              state.hasCollided = true;
            }
          }
        }
      } catch (error) {
        if (detail === undefined) {
          state.rotationIdx = 0;
          state.detail.tetromino = randomDetail().shape[state.rotationIdx];
          state.detail.position.x = STAGE_WIDTH / 2 - 2;
          state.detail.position.y = 0;
        }
        console.log('Error in checkCollided');
      }
    },
    checkRows(state) {
      const count = []; // массив, в который пушим заполненные строки, чтобы потом считать, ск баллов начислить
      const updatedStage = state.stage.reduce((acc: any, row: any) => {
        if (row.findIndex((cell: (string | number)[]) => cell[0] === 0) === -1) {
          count.push(row);
          state.linesCleared++;
          acc.unshift(new Array(state.stage[0].length).fill([0, 'clear']));
          return acc;
        }
        acc.push(row);
        state.countToScore = count.length;
        return acc;
      }, []);
      state.stage = updatedStage;
      state.countToScore = count.length;
    },
    countScore(state) {
      state.score += SCORE_COUNT[state.countToScore.toString()];
    },
    changeDropTime(state) {
      if (state.score < 1000) {
        state.dropTime = 1000;
      } else if (DROPTIME_COUNT[state.score.toString()]) {
        state.dropTime = DROPTIME_COUNT[state.score.toString()];
      }
    },
    countLevel(state) {
      if (state.score < 1000) {
        state.level = 1;
      } else if (LEVEL_COUNT[state.score.toString()]) {
        state.level = LEVEL_COUNT[state.score.toString()];
      }
    },
  },
});

export const {
  move,
  moveDown,
  startGame,
  setNextDetail,
  updateDetailPostion,
  checkCollided,
  updateActivePiece,
  updateNextPiece,
  checkRows,
  countScore,
  countLevel,
  changeDropTime,
} = tetrisSlice.actions;
export default tetrisSlice.reducer;
