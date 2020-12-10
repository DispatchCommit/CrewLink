import {isInsidePolygon} from "./Polygon";
import {AmongUsState, GameState, Player} from "../main/GameReader";
import {TheSkeldRooms} from "./maps/TheSkeld";
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
}

/**
 * Determine the distance between two points
 * @param position1
 * @param position2
 */
export function distanceBetweenTwoPoints(position1 : ICoordinate, position2 : ICoordinate) : number {
    return Math.sqrt(Math.pow(position1.x - position2.x, 2) + Math.pow(position1.y - position2.y, 2));
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
 * Determine the room of two given player
 * @param player1
 * @param player2
 */
export function findRoomForTwoPlayers(player1 : Player, player2 : Player) : [number, number] {
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

export function testPath(origin : number) {
    let d = new Djisktra(TheSkeldRooms, origin);
    d.solve();
}

class Djisktra {
    map : IRoom[];
    predecessor : number[];
    distance : number[];
    visited : boolean[];

    constructor(map : IRoom[], startingNode : number) {
        this.map = map;
        this.predecessor = Array(map.length);
        this.distance = Array(map.length);
        this.distance.fill(100);
        this.distance[startingNode] = 0;
        this.visited = Array(this.map.length);
        this.visited.fill(false);
    }

    distanceBetweenNode(s1 : number, s2 : number) {
        return distanceBetweenTwoPoints(this.map[s1].center, this.map[s2].center);
    }

    findMin() : number {
        let min : number = 100;
        let node = -1;

        for (let i = 0; i < this.map.length; ++i) {
            if (this.distance[i] < min && !this.visited[i]) {
                min = this.distance[i];
                node = i;
            }
        }
        return node;
    }

    update_distance(s1 : number, s2 : number) {
        if (this.visited[s2]) return;
        console.log("Updating distance between " + s1 + " and " + s2);
        let dist : number = this.distance[s1] + this.distanceBetweenNode(s1, s2);
        if (this.distance[s2] > dist) {
            this.distance[s2] = dist;
            this.predecessor[s2] = s1;
        }
    }

    solve() {
        while (this.visited.includes(false)) {
            let s1 : number = this.findMin();
            this.visited[s1] = true;
            console.log("Closest room : " + s1);
            for (let s2 of this.map[s1].linkedRoom) {
                this.update_distance(s1, s2);
            }
        }
        console.log(this.distance);
        console.log(this.predecessor);
    }
}