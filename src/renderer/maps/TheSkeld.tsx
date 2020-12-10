import {IRoom} from "../Sound";

/**
 * All rooms of The Skeld here
 */
export const TheSkeldRooms: IRoom[] = [
    /** 0  */ {name: "Cafeteria",                   center: {x: -0.9, y: 1.29},     linkedRoom: [1, 11, 22], polygon: [{x: -6.39, y: 6.98}, {x: 5.11, y: 7.32}, {x: 5.11, y: -1.93}, {x: 2.44, y: -4.36}, {x: -4.56, y: -4.36}, {x: -6.3, y: -1.79}]},
    /** 1  */ {name: "MedBay Hallway",              center: {x: -10.48, y: 1.29},   linkedRoom: [0, 2, 3], polygon: [{x: -6.3, y: 2.7}, {x: -6.3, y: -0.55}, {x: -14.68, y: -0.55}, {x: -14.68, y: 2.7}]},
    /** 2  */ {name: "MedBay",                      center: {x: -8.79, y: -3.57},   linkedRoom: [1], polygon: [{x: -6.72, y: -0.42}, {x: -6.72, y: -2.5}, {x: -3.37, y: -5.77}, {x: -11.54, y: -5.77}, {x: -11.46, y: -0.44}]},
    /** 3  */ {name: "Upper Engine",                center: {x: -17.22, y: 1.03},   linkedRoom: [1, 4], polygon: [{x: -14.6, y: 3.88}, {x: -14.6, y: -1.54}, {x: -19.85, y: -1.54}, {x: -19.85, y: 4.04}]},
    /** 4  */ {name: "Security/Reactor Hallway",    center: {x: -16.92, y: -5.27},  linkedRoom: [3, 5, 6, 7], polygon: [{x: -19.1, y: -1.37}, {x: -14.85, y: -1.37}, {x: -14.85, y: -9.04}, {x: -19.02, y: -9.04}]},
    /** 5  */ {name: "Reactor",                     center: {x: -21.59, y: -5.27},  linkedRoom: [4], polygon: [{x: -19.02, y: -2.62}, {x: -19.02, y: -7.21}, {x: -23.44, y: -11.71}, {x: -23.44, y: 2.29}]},
    /** 6  */ {name: "Security",                    center: {x: -13.26, y: -5.27},  linkedRoom: [4], polygon: [{x: -14.76, y: -1.55}, {x: -11.51, y: -1.55}, {x: -11.51, y: -7.47}, {x: -14.84, y: -7.47}]},
    /** 7  */ {name: "Lower Engine",                center: {x: -16.84, y: -11.43}, linkedRoom: [4, 8], polygon: [{x: -14.76, y: -8.89}, {x: -14.76, y: -14.05}, {x: -20.01, y: -14.05}, {x: -19.76, y: -8.97}]},
    /** 8  */ {name: "Electrical Hallway",          center: {x: -10.33, y: -14.26}, linkedRoom: [7, 9, 10], polygon: [{x: -14.82, y: -10.08}, {x: -11.15, y: -10.08}, {x: -10.38, y: -13.44}, {x: -5.29, y: -13.44}, {x: -5.29, y: -15.11}, {x: -14.79, y: -14.94}]},
    /** 9  */ {name: "Electrical",                  center: {x: -8.42, y: -9.85},   linkedRoom: [8], polygon: [{x: -10.32, y: -13.55}, {x: -10.32, y: -6.55}, {x: -3.24, y: -6.55}, {x: -8.02, y: -13.41}]},
    /** 10 */ {name: "Storage",                     center: {x: -1.76, y: -12.19},  linkedRoom: [], polygon: [{x: -5.32, y: -17.63}, {x: -5.23, y: -8.63}, {x: 1.1, y: -8.63}, {x: 1.1, y: -17.46}]},
    /** 11 */ {name: "Admin Hallway",               center: {x: -0.76, y: -6.5},    linkedRoom: [0, 10, 12], polygon: [{x: -1.74, y: -8.7}, {x: -1.66, y: -4.37}, {x: 2, y: -4.37}, {x: 2, y: -8.7}]},
    /** 12 */ {name: "Admin",                       center: {x: 4.54, y: -8.39},    linkedRoom: [11], polygon: [{x: 1.84, y: -10.37}, {x: 7.01, y: -10.37}, {x: 7.01, y: -5.37}, {x: 1.92, y: -5.37}]},
    /** 13 */ {name: "Communications Hallway",      center: {x: 4.04, y: -12.14},   linkedRoom: [10, 14, 15], polygon: [{x: 1.09, y: -10.95}, {x: 6.76, y: -10.95}, {x: 6.76, y: -13.79}, {x: 1.09, y: -13.79}]},
    /** 14 */ {name: "Communications",              center: {x: 4.11, y: -15.67},   linkedRoom: [13], polygon: [{x: 6.76, y: -13.79}, {x: 6.76, y: -17.45}, {x: 1.42, y: -17.45}, {x: 1.26, y: -13.7}]},
    /** 15 */ {name: "Shields",                     center: {x: 9.3, y: -12.23},    linkedRoom: [13, 16], polygon: [{x: 6.76, y: -9.95}, {x: 12.01, y: -9.95}, {x: 12.01, y: -14.87}, {x: 6.84, y: -14.87}]},
    /** 16 */ {name: "Shields Hallway",             center: {x: 10.3, y: -6.98},    linkedRoom: [15, 17], polygon: [{x: 8.49, y: -10.04}, {x: 8.58, y: -5.12}, {x: 12.83, y: -5.2}, {x: 12.99, y: -10.04}]},
    /** 17 */ {name: "Navigation Hallway",          center: {x: 13.83, y: -4.62},   linkedRoom: [16, 18], polygon: [{x: 11.11, y: -3.93}, {x: 15.11, y: -3.93}, {x: 15.11, y: -5.27}, {x: 11.02, y: -5.27}]},
    /** 18 */ {name: "Navigation",                  center: {x: 17.58, y: -4.62},   linkedRoom: [17], polygon: [{x: 15.08, y: -1.7}, {x: 19.49, y: -1.7}, {x: 19.49, y: -6.62}, {x: 15.08, y: -6.62}]},
    /** 19 */ {name: "O2/Weapons Hallway",          center: {x: 10.1, y: -2.81},    linkedRoom: [17, 20, 21], polygon: [{x: 7.86, y: -0.85}, {x: 12.77, y: -0.85}, {x: 12.77, y: -3.93}, {x: 7.86, y: -3.93}]},
    /** 20 */ {name: "O2",                          center: {x: 6.53, y: -3.51},    linkedRoom: [19], polygon: [{x: 7.88, y: -5.04}, {x: 2.05, y: -5.04}, {x: 5.68, y: -1.16}, {x: 7.84, y: -1.16}]},
    /** 21 */ {name: "Weapons",                     center: {x: 9.13, y: 2.14},     linkedRoom: [19, 22], polygon: [{x: 6.93, y: -0.83}, {x: 6.93, y: 4.84}, {x: 11.68, y: 4.84}, {x: 11.68, y: -0.83}]},
    /** 22 */ {name: "Weapons/Cafeteria Hallway",   center: {x: 6.02, y: 1.21},     linkedRoom: [0, 22], polygon: [{x: 5.12, y: 1.98}, {x: 6.95, y: 1.98}, {x: 6.95, y: 0.48}, {x: 5.12, y: 0.48}]},
];