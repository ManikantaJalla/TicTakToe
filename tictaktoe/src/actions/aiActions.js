const streaks = {
    nine: [
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

const indicateVictory = (cells, grid) => {
    if(grid === 9) {
        const possibleStreaks = streaks.nine;
        for (let i = 0; i < possibleStreaks.length; i++) {
            const [a, b, c] = possibleStreaks[i];
            if (cells[a] && cells[a] === cells[b] && cells[a] === cells[c]) {
                return {
                    winner: cells[a], winningRow: [a, b, c]
                }
            }
        }
    }
    return {
        winner: null, winningRow: [null, null, null] };
};
const getGameScore = (winner, movesCount) => {
    let score;
    let urgency = movesCount === 0 ? -80 : movesCount;
    if (winner === 'X') {
        score = -20 + urgency;
    } else if (winner === 'O') {
        score = 20 - urgency;
    } else {
        score = 0
    }
    return score
};
const getAvailableMoves = (board) => {
    let available = [];
    board.forEach((cell, cellIndex) => {
        if (cell === null) {
            available.push(cellIndex)
        }
    });
    return available
};
const minMax = (board, xTurn, grid, depth = 0) => {
    const winner = indicateVictory(board, grid).winner;
    let score = null;
    let moves = getAvailableMoves(board);
    if(winner || moves.length === 0) {
        return getGameScore(winner, depth);
    }
    moves.forEach (move => {
        let newBoard = board.slice();
        newBoard[move] = xTurn ? 'Mani' : 'Opp';
        let moveScore = minMax(
            newBoard,
            !xTurn,
            grid,
            ++depth);
        if(xTurn){
            if (moveScore < score || score === null) {
                score = moveScore;
            }
        } else {
            if (moveScore > score || score === null) {
               score = moveScore;
            }
        }
    });
    return score;
};

export const getBestMove = (board, grid, xTurn) => {
  let bestScore = null;
  let bestMove = null;
  const moves = getAvailableMoves(board);
  console.log('available moves: ' + moves.length);
  console.log(moves);
  if (grid === 9 || moves.length <= 8) {
      if (grid === 9 && moves.length === 8 && !board[4]){
          return bestMove = 4
      }
      moves.forEach(move => {
          let newBoard = board.slice();
          newBoard[move] = xTurn ? 'X' : 'O';
          let newScore = minMax(newBoard, !xTurn, grid);
          console.log(move + "'s score: " + newScore);
          if (xTurn) {
              if (newScore < bestScore || bestScore === null) {
                  bestScore = newScore;
                  bestMove = move;
              }

          } else {
              if (newScore > bestScore || bestScore === null) {
                  bestScore = newScore;
                  bestMove = move;
              }
          }
      });
  }
  console.log('best move: ' + bestMove + ' score: ' + bestScore);
  return bestMove
};
