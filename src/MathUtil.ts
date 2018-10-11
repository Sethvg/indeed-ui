export class MathUtil {

    static GetRandomInRange(lower: number, higher: number) {
        return Math.floor(Math.random() * higher) + lower;
    }
}