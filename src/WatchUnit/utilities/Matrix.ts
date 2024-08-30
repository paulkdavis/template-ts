type Matrix3x3 = number[][];
type Point = { x: number; y: number };

export class Matrix {
    static identity(): Matrix3x3 {
        return [
            [1, 0, 0],
            [0, 1, 0],
            [0, 0, 1],
        ];
    }

    static multiply(a: Matrix3x3, b: Matrix3x3): Matrix3x3 {
        let result: Matrix3x3 = [
            [0, 0, 0],
            [0, 0, 0],
            [0, 0, 0],
        ];

        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                result[i][j] = 0;
                for (let k = 0; k < 3; k++) {
                    result[i][j] += a[i][k] * b[k][j];
                }
            }
        }

        return result;
    }

    static inverse(m: Matrix3x3): Matrix3x3 {
        let [a, b, c, d, e, f, g, h, i] = [
            m[0][0], m[0][1], m[0][2],
            m[1][0], m[1][1], m[1][2],
            m[2][0], m[2][1], m[2][2]
        ];

        let det = a * (e * i - f * h) - b * (d * i - f * g) + c * (d * h - e * g);
        if (det === 0) throw new Error("Matrix is not invertible");

        let inverse: Matrix3x3 = [
            [(e * i - f * h) / det, -(b * i - c * h) / det, (b * f - c * e) / det],
            [-(d * i - f * g) / det, (a * i - c * g) / det, -(a * f - c * d) / det],
            [(d * h - e * g) / det, -(a * h - b * g) / det, (a * e - b * d) / det],
        ];

        return inverse;
    }

    static translate(x: number, y: number): Matrix3x3 {
        return [
            [1, 0, x],
            [0, 1, y],
            [0, 0, 1],
        ];
    }

    static rotate(angle: number): Matrix3x3 {
        let cos = Math.cos(angle);
        let sin = Math.sin(angle);
        return [
            [cos, -sin, 0],
            [sin, cos, 0],
            [0, 0, 1],
        ];
    }

    static scale(sx: number, sy: number): Matrix3x3 {
        return [
            [sx, 0, 0],
            [0, sy, 0],
            [0, 0, 1],
        ];
    }

    static transformPoint(m: Matrix3x3, p: Point): Point {
        let x = m[0][0] * p.x + m[0][1] * p.y + m[0][2];
        let y = m[1][0] * p.x + m[1][1] * p.y + m[1][2];
        return { x, y };
    }
}