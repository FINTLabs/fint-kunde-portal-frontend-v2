export class HeaderProperties {
    static xnin: string = '';
    static cookies: string = '';

    static setProperties(request: Request) {
        HeaderProperties.xnin = request.headers.get('x-nin') || '';
        HeaderProperties.cookies = request.headers.get('Cookie') || '';
    }

    static getXnin() {
        return HeaderProperties.xnin;
    }

    static getCookie() {
        return HeaderProperties.cookies;
    }

}
