import {isInsidePolygon} from "./Polygon";
import {AmongUsState, GameState, Player} from "../main/GameReader";
import {TheSkeldRooms, TheSkeldPaths} from "./maps/TheSkeld";
import {GameStateContext} from "./App";
import {useContext} from "react";
import {clipboard} from "electron";

/**
 * Represents a path between two rooms.
 *
 * We don't need to know the destination since we will store
 * the interface in an array where the index represents
 * the destination
 */
export interface IPath {
    [id : number]: number,
    from: number,
    totalDistance: number
}

/**
 * Represents a 2D Points
 */
export interface ICoordinate {
    [id : number]: number,
    x: number,
    y: number,
}

/**
 * Represents a room in a map.
 *
 * Note : polygon is an array of points which should
 * contains the represented rooms to avoid wrong
 * sound estimation.
 */
export interface IRoom {
    [id : number]: number,
    name: string,
    linkedRoom: number[],
    center: ICoordinate,
    polygon: ICoordinate[],
    entrance: number[];
}

export interface IEntrance {
    [id : number] : number;
    pos : ICoordinate;
}

/**
 * Determine the room where a given player is
 * @param player The player for whom we must look for the room
 */
export function findRoomName(player : Player) : string {
    // TODO : Delete the production check (as I use freeplay, my game is considered in the menu ..)
    if (process.env.NODE_ENV === "production") {
        let gameState : AmongUsState = useContext(GameStateContext);
        switch (gameState.gameState) {
            case GameState.DISCUSSION:
                return "Discussion";
            case GameState.LOBBY:
                return "Lobby";
            case GameState.MENU:
                return "Menu";
            case GameState.UNKNOWN:
                return "Unknown";
            default:
                break;
        }
    }
    if (player === undefined) return "None";

    let position : ICoordinate = {x: player.x, y: player.y};
    let playerRoom : string = "";

    // TODO : Change TheSkeldRooms by the array containing all maps and use gameState.mapID
    for (let room of TheSkeldRooms) {
        if (playerRoom !== "") {
            break;
        }
        else {
            playerRoom = isInsidePolygon(room.polygon, position) ? room.name : "";
        }
    }
    return playerRoom !== "" ? playerRoom : "None";
}

/**
 * Determine the distance between two points
 * @param position1
 * @param position2
 */
function distanceBetweenTwoPoints(position1 : ICoordinate, position2 : ICoordinate) : number {
    return Math.sqrt(Math.pow(position1.x - position2.x, 2) + Math.pow(position1.y - position2.y, 2));
}

/**
 * Determine the room of two given player
 * @param player1
 * @param player2
 */
function findRoomForTwoPlayers(player1 : Player, player2 : Player) : [number, number] {
    if (player1 === undefined || player2 === undefined) return [-1, -1];

    let position1 : ICoordinate = {x: player1.x, y: player1.y};
    let position2 : ICoordinate = {x: player2.x, y: player2.y};
    let player1RoomID : number = -1;
    let player2RoomID : number = -1;

    // TODO : Change TheSkeldRooms by the array containing all maps and use gameState.mapID
    for (let i = 0; i < TheSkeldRooms.length; ++i) {
        if (player1RoomID === -1) {
            player1RoomID = isInsidePolygon(TheSkeldRooms[i].polygon, position1) ? i : -1;
        }
        if (player2RoomID === -1) {
            player2RoomID = isInsidePolygon(TheSkeldRooms[i].polygon, position2) ? i : -1;
        }
        if (player1RoomID !== -1 && player2RoomID === -1) {
            break;
        }
    }
    return [player1RoomID, player2RoomID];
}

// /**
//  *
//  * @param from
//  * @param to
//  */
// function calculateSoundDistance(from : number, to : number) {
//
// }

export function CopyToClipboard(player : Player) {
    if (player === undefined) return;
    let pos : string = "";
    pos = '{x: ' + player.x + ', y: ' + player.y + "}, ";
    clipboard.writeText(pos);
}

export function shouldHearOtherPlayer(player1 : Player, player2 : Player) : boolean {
    if (player1 === undefined || player2 === undefined) return false;

    let gameState : AmongUsState = useContext(GameStateContext);
    if (gameState.gameState === GameState.LOBBY || gameState.gameState === GameState.DISCUSSION) return true;
    if (gameState.gameState === GameState.UNKNOWN) return false;

    let position1 : ICoordinate = {x: player1.x, y: player1.y};
    let position2 : ICoordinate = {x: player2.x, y: player2.y};
    let distance : number = distanceBetweenTwoPoints(position1, position2);

    // TODO : Implements global lobby settings when merged
    // In an euclidean space, the straight line between two points is the shortest distance possible.
    if (distance > 5) {
        return false;
    }
    else {
        let [player1Room, player2Room] : [number, number] = findRoomForTwoPlayers(player1, player2);

        // We consider that the sound propagates in a direct way when two players are in the same room.
        if (player1Room === player2Room) {
            return true;
        }
        else {
            if (TheSkeldPaths[player1Room][player2Room].totalDistance > 10) {
                return false;
            }
            else {
                return true;
            }
        }
    }
}