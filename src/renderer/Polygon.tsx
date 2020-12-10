import {ICoordinate} from "./Sound";

const INF = 100; // Infinite in front of the size of the map

/**
 * Find the orientation of the oriented angle (p1, p2, p3)
 * p -> q -> r
 * 0 : Colinear (no orientation), 1 : Clockwise orientation, 2: Counterclockwise orientation
 * Explanation :
 * We determine the slope value "a1" from p1 to p2 : a1 = (p2.y - p1.y) / (p2.x - p1.x)
 * We determine the slope value "a2" from p2 to p3 : a2 = (p3.y - p2.y) / (p3.x - p2.x)
 * If a1 > a2 then we have a "right turn".
 * (p2.y - p1.y) / (p2.x - p1.x) > (p3.y - p2.y) / (p3.x - p2.x)
 * <=> (p2.y - p1.y)(p3.x - p2.x) > (p3.y - p2.y)(p2.x - p1.x)
 * <=> (p2.y - p1.y)(p3.x - p2.x) - (p3.y - p2.y)(p2.x - p1.x) > 0
 * @param p1 First point of the angle
 * @param p2 Second point of the angle
 * @param p3 Third point of the angle
 */
function orientation(p1: ICoordinate, p2: ICoordinate, p3: ICoordinate): number {
    let val = (p2.y - p1.y) * (p3.x - p2.x) - (p3.y - p2.y) * (p2.x - p1.x);
    if (val === 0) return 0;
    return (val > 0) ? 1 : 2;
}

/**
 * Check if q is on the segment [pr] (this function suppose that [pq] and [qr] are colinear)
 * @param p1 First extremity of [pr]
 * @param p2 The point to check if it belongs to [pr]
 * @param p3 Second extremity of [pr]
 */
function onSegment(p1: ICoordinate, p2: ICoordinate, p3: ICoordinate): boolean {
    return p2.x <= Math.max(p1.x, p3.x) && p2.x >= Math.min(p1.x, p3.x) && p2.y <= Math.max(p1.y, p3.y) && p2.y >= Math.min(p1.y, p3.y);
}

/**
 * Check if [p1q1] intersects with [p2q2]
 * @param p1 First extremity of the [p1q1] segment
 * @param q1 Second extremity of the [p1q1] segment
 * @param p2 First extremity of the [p2q2] segment
 * @param q2 Second extremity of the [p2q2] segment
 */
function doIntersect(p1: ICoordinate, q1: ICoordinate, p2: ICoordinate, q2: ICoordinate): boolean {
    let o1 = orientation(p1, q1, p2);
    let o2 = orientation(p1, q1, q2);
    let o3 = orientation(p2, q2, p1);
    let o4 = orientation(p2, q2, q1);

    if (o1 !== o2 && o3 != o4) return true;
    if (o1 === 0 && onSegment(p1, p2, q1)) return true;
    if (o2 === 0 && onSegment(p1, q2, q1)) return true;
    if (o3 === 0 && onSegment(p2, p1, q2)) return true;
    return o4 === 0 && onSegment(p2, q1, q2);
}

/**
 * Check if p is inside the given polygon
 * @param polygon Array of points representing the polygon
 * @param position Coordinate of the point to test
 */
export function isInsidePolygon(polygon: Array<ICoordinate>, position: ICoordinate): boolean {
    let infinite: ICoordinate = { x: INF, y: position.y };
    let count: number = 0;
    let i = 0;
    let n = polygon.length;
    do {
        let next = (i + 1) % n;

        if (doIntersect(polygon[i], polygon[next], position, infinite)) {
            count = count + 1;
        }
        i = next;
    } while (i != 0);
    return (count % 2 === 1);
}