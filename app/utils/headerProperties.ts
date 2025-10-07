export class HeaderProperties {
    static xnin: string = '';
    static cookies: string = '';

    static setProperties(request: Request) {
        const xninFromRequest = request.headers.get('x-nin') || '';
        const cookiesFromRequest = request.headers.get('Cookie') || '';
        
        console.log('=== HeaderProperties.setProperties DEBUG ===');
        console.log('x-nin from request:', xninFromRequest);
        console.log('x-nin type:', typeof xninFromRequest);
        console.log('x-nin length:', xninFromRequest.length);
        console.log('All request headers:', Object.fromEntries(request.headers.entries()));
        
        HeaderProperties.xnin = xninFromRequest;
        HeaderProperties.cookies = cookiesFromRequest;
        
        console.log('HeaderProperties.xnin set to:', HeaderProperties.xnin);
        console.log('=== HeaderProperties.setProperties END ===');
    }

    static getXnin() {
        return HeaderProperties.xnin;
    }

    static getCookie() {
        return HeaderProperties.cookies;
    }

}
