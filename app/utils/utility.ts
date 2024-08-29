export class Utility {
    static xnin: string = '';

    static setXnin(request: Request) {
        Utility.xnin = request.headers.get('x-nin') || '';
    }

    static getXnin() {
        return Utility.xnin;
    }
}
