import { WebSocket } from "ws";
import { Chess } from 'chess.js'
import { GAME_OVER, INIT_GAME, MOVE } from "./messages";

export class Game{
    public player1: WebSocket
    public player2: WebSocket
    public board: Chess
    private time: Date

    constructor(player1: WebSocket, player2: WebSocket){
        this.player1 = player1
        this.player2 = player2
        this.board = new Chess()
        this.time = new Date
        this.player1.send(JSON.stringify({
            type: INIT_GAME,
            color: "White"
        }))
        this.player2.send(JSON.stringify({
            type: INIT_GAME,
            color: "Black"
        }))
    }


    makeMove(socket: WebSocket, move: {
        from: string,
        to: string
    }){

        if(this.board.moves.length %2===0 && socket!== this.player1){
            console.log(this.board.moves.length)
            console.log("early from 1")
            return
        }
        if(this.board.moves.length %2===1 && socket!== this.player2){
            console.log("early from 2")
            return
        }
        console.log("no early return")

        try {
            this.board.move(move)
            
        } catch (error) {
            return
        }

        if (this.board.isGameOver()){
            this.player1.send(JSON.stringify({
                type: GAME_OVER,
                payload: {
                    winner: this.board.turn() === "w" ?"black": "white"
                }
            }))
            return
        }
        if(this.board.moves.length% 2 === 0){
            console.log("move 1")
            this.player2.send(JSON.stringify({
                type: MOVE, 
                payload: move
            }))
        }else{
            console.log("move2")
            this.player1.send(JSON.stringify({
                type: MOVE,
                payload: move
            }))
        }


    }
}