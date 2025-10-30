export class HeaderProperties {
    static xnin: string = '';
    static cookies: string = '';
    static username: string = '';

    static setProperties(request: Request) {
        HeaderProperties.xnin = request.headers.get('x-nin') || '';
        HeaderProperties.cookies = request.headers.get('Cookie') || '';
        HeaderProperties.username = request.headers.get('x-username') || HeaderProperties.username || '';
    }

    static getXnin() {
        return HeaderProperties.xnin;
    }

    static getCookie() {
        return HeaderProperties.cookies;
    }

    static setUsername(username: string) {
        HeaderProperties.username = username;
    }

    static getUsername() {
        return HeaderProperties.username;
    }

}
