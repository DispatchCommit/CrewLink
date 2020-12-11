import {isInsidePolygon} from "./Polygon";
import {AmongUsState, GameState, Player} from "../main/GameReader";
import {TheSkeldRooms, TheSkeldPaths, TheSkeldEntrance} from "./maps/TheSkeld";
import {GameStateContext} from "./App";
import {useContext} from "react";

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
 * @param position1
 * @param position2
 */
function findRoomForTwoPosition(position1: ICoordinate, position2: ICoordinate) : [number, number] {
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

/**
 * Only used in DEVELOPMENT for mapping
 * @param x
 * @constructor
 */
function Round(x : number) : number {
    return Math.round(x * 100) / 100;
}

/**
 * Only used in DEVELOPMENT for mapping
 * @param player
 * @constructor
 */
export function CopyToClipboard(player : Player) {
    const {clipboard} = require("electron");
    if (player === undefined) return;
    let pos : string = "";
    pos = '{x: ' + Round(player.x) + ', y: ' + Round(player.y) + "}, ";
    clipboard.writeText(pos);
}

/**
 * Find a common element in two array with unique values.
 * O(n+m)
 * @param arr1 First array
 * @param arr2 Second array
 */
function findCommonElement(arr1 : number[], arr2 : number[]) : number {
    return arr1.filter(val => arr2.includes(val))[0];
}

/**
 * Determine the sound distance between two players in different rooms.
 * Shouldn't affect a lot CPU usage because most of the case are managed with simple test.
 * And remaining cases should be resolved in 3 steps in worst case.
 * @param position1 The position of the first player
 * @param position2 The position of the second player
 * @param from The room of the first player (and not the second !)
 * @param to The room of the second player
 */
function isSoundAudible(position1: ICoordinate, position2: ICoordinate, from: number, to: number) : boolean {
    let totalDistance : number = 0;

    let roomPos : number = to
    let soundOrigin : ICoordinate = position2;
    // TODO : Error might come from here (algorithm for finding common element look shitty).
    let common : number = findCommonElement(TheSkeldRooms[TheSkeldPaths[from][roomPos].from].entrance, TheSkeldRooms[roomPos].entrance);
    console.log(common);
    console.log(TheSkeldRooms[TheSkeldPaths[from][roomPos].from].entrance);
    console.log(TheSkeldRooms[roomPos].entrance);
    let soundStep : ICoordinate = TheSkeldEntrance[common].pos;

    // TODO : Replace totalDistance < 5 with global lobby settings
    while (TheSkeldPaths[from][roomPos].from !== from) {
        totalDistance += distanceBetweenTwoPoints(soundOrigin, soundStep);
        soundOrigin = soundStep;
        roomPos = TheSkeldPaths[from][roomPos].from;
        soundStep = TheSkeldEntrance[findCommonElement(TheSkeldRooms[TheSkeldPaths[from][roomPos].from].entrance, TheSkeldRooms[roomPos].entrance)].pos;
        if (totalDistance > 5) return false;
    }
    return true;
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
        let [player1Room, player2Room] : [number, number] = findRoomForTwoPosition(position1, position2);
        if (player1Room === -1 || player2Room === -1) return false;

        // We consider that the sound propagates in a direct way when two players are in the same room.
        if (player1Room === player2Room) {
            return true;
        }
        else {
            if (TheSkeldPaths[player1Room][player2Room].totalDistance > 10) {
                return false;
            }
            else {
                return isSoundAudible(position1, position2, player1Room, player2Room);
            }
        }
    }
}