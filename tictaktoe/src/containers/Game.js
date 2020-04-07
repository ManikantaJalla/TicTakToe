import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link, withRouter } from 'react-router-dom';
import { playerMove, timeTravel, toggleHistory,timeUp, newGame, endGame, turnChangeAnimation } from "../actions/gameActions";
import Board from '../components/Board';
import GameStatus from '../components/GameStatus';

class Game extends Component {
    constructor (props) {
        super (props);
        this.playerMove = this.playerMove.bind(this);
        this.indicateVictory = this.indicateVictory.bind(this);
        this.movesList = this.movesList.bind(this);
    }
    playerMove (move) {
        const history = this.props.history.slice(0, this.props.stepNumber + 1);
        const board = this.props.currentBoard.slice();
        if (this.indicateVictory(board).winner || board[move]
            || (this.props.stepNumber === this.props.grid)) {
            return;
        }
        board[move] = this.props.xTurn ? 'M' : 'O';
        this.props.playerMove(history, board); 
    }
    indicateVictory(cells) {
        const streaks = this.props.streaks;
        if(this.props.grid === 9) {
            for (let i = 0; i < streaks.length; i++) {
                const [a, b, c] = streaks[i];
                if (cells[a] && cells[a] === cells[b] && cells[a] === cells[c]) {
                    return {
                        winner: cells[a], winningLine: [a, b, c]
                    }
                }
            }
        } 
        return {
            winner: null, winningLine: [null, null, null] };
    };

    movesList (history) {
        const winner = this.indicateVictory(this.props.currentBoard.slice()).winner;
        const gameStatus = this.gameStatus(winner);
        const endOfGame = gameStatus.endOfGame;
        return history.map((step, move) => {
            const player = move % 2 ? ' - Mani' : ' - Opponent';
            const description = move ?
                'Move #' + move + player : 'Game Start';
            return (
                <li key={move}>
                    <button onClick={() =>  this.props.timeTravel(move, endOfGame)}
                            className={(this.props.stepNumber===move) ?
                                'current_step' : ''}>
                        {description}
                    </button>
                </li>
            )
        });
    }
    gameStatus (winner) {
        let status, endGame;
        if (winner) {
            status = winner + ' is the winner!';
            endGame = true;
        } else if (!winner && this.props.stepNumber === this.props.grid) {
            status = "It's a Draw!";
            endGame = true;
        } else {
            status = (this.props.xTurn ? 'Mani' : 'Opponent') + "'s turn.";
            endGame = false;
        }
        return {status, endGame};
    }

    componentWillMount () {
        const xTurn = this.props.xTurn;
        const { playerStarts, versus, difficulty } = this.props.gameSettings;
        const board = this.props.currentBoard.slice();
        if (this.props.stepNumber === 0) {
            if (!playerStarts && xTurn && versus === 'A') {
                const bestMove = getBestMove(board, this.props.grid, xTurn);
                const move = aiMove(bestMove, board, difficulty);
                setTimeout(() => {
                    this.playerMove(move)
                }, 750)
            }
        }
    }
    componentWillReceiveProps (nextProps) {
        const xTurn = nextProps.xTurn;
        const { playerStarts, versus, difficulty } = nextProps.gameSettings;
        const winner = this.indicateVictory(nextProps.currentBoard.slice()).winner;
        if(xTurn !== this.props.xTurn || endOfGame !== this.props.endOfGame){
            turnChangeAnimation();
        }
        if(nextProps.stepNumber || (nextProps.stepNumber === 0)) {
            if (!endOfGame && !playerStarts && xTurn && versus === 'A') {
                const bestMove = getBestMove(board, this.props.grid, xTurn);
                const move = aiMove(bestMove, board, difficulty);
                setTimeout(() => {
                    this.playerMove(move)
                }, 750)
            }
            if (!endOfGame && playerStarts && !xTurn && versus === 'A') {
                const bestMove = getBestMove(board, this.props.grid, xTurn);
                const move = aiMove(bestMove, board, difficulty);
                setTimeout(() => {
                    this.playerMove(move)
                }, 750)
            }
        }
        if (this.gameStatus(winner).endGame) {
            this.props.endGame();
        }
    }
    render () {
        const { mode, pace, versus, playerStarts} = this.props.gameSettings;
        const history = this.props.history;
        const currentBoard = this.props.currentBoard;
        const winner = this.indicateVictory(currentBoard).winner;
        const winningRow = this.indicateVictory(currentBoard).winningLine;
        const moves = this.movesList(history);
        const status = this.gameStatus(winner).status;
        const endOfGame = this.gameStatus(winner).endGame;
        return (
            <div className="game_page">
               <div className='left_col_game'>
                       <Link to='/'>
                           <button className="exit_game">
                               Main Menu
                           </button>
                       </Link>
                   
               </div>
                <div className='mid_col_game'>
                   <GameStatus
                        status={status}
                        gameMode={mode}
                        timerPace={pace}
                        timeUp={this.props.timeUp}
                        xTurn={this.props.xTurn}
                        gameEnd={endOfGame}
                        firstMove={this.props.stepNumber===0}
                        timeTraveled={this.props.timeTraveled} />
                    <Board
                        grid={this.props.grid}
                        cells={this.props.currentBoard}
                        gameEnd={endOfGame}
                        xTurn={this.props.xTurn}
                        playerMove={(i) => this.playerMove(i)}
                        winningRow={winningRow}
                        playerStarts={playerStarts}
                         />
               </div>
                <div className='right_col_game'>
                   <TimeTravel
                       moves={moves} />
                </div>
            </div>
        )
    }
}
const mapStateToProps = (state) => ({
    gameSettings: state.settings,
    grid: state.game.grid,
    streaks: state.game.streaks,
    currentBoard: state.game.currentBoard,
    xTurn: state.game.xTurn,
    stepNumber: state.game.stepNumber
});
const matchDispatchToProps = (dispatch) => {
    return bindActionCreators(
        {
            getBestMove: getBestMove,
            playerMove: playerMove
        }, dispatch)
};

export default withRouter(connect(mapStateToProps, matchDispatchToProps)(Game));
