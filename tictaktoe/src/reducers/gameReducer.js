export const initialState =
    {
        grid: 9,
        streaks: [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6]
        ],
        history: [{
            cells: new Array(9).fill(null)
        }],
        currentBoard: new Array(9).fill(null),
        stepNumber: 0,
        timeTraveled: false,
        xTurn: true,
        showHistory: false,
        endOfGame: false
    };
export const gameReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_GRID_9':
            return {...state,
                grid: 9,
                streaks: [
                    [0, 1, 2],
                    [3, 4, 5],
                    [6, 7, 8],
                    [0, 3, 6],
                    [1, 4, 7],
                    [2, 5, 8],
                    [0, 4, 8],
                    [2, 4, 6]
                ]
            };
            break;
        case 'PLAYER_MOVE':
            return {...state,
                history: action.history.concat([{
                    cells: action.cells
                }]),
                currentBoard: action.cells,
                xTurn: !state.xTurn,
                stepNumber: action.history.length,
                endOfGame: false,
                timeTraveled: false
            };
            break;
        default:
            return state;
    }
};
export default gameReducer;
