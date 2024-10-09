export class HeaderProperties {
    static xnin: string = '';

    static setXnin(request: Request) {
        HeaderProperties.xnin = request.headers.get('x-nin') || '';
    }

    static getXnin() {
        return HeaderProperties.xnin;
    }
}
