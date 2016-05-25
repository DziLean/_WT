module.exports = function(srtUrl){
    if(srtUrl == '/index.html' || srtUrl == "/favicon.html" || srtUrl == "/" || srtUrl == "/favicon.ico") {
        return 'index';
    }
    else{
        if(srtUrl == '/login'){
            return 'login';
        }
        else{
            if(srtUrl == '/sign_up'){
                return 'sign_up';
            }
            else{
                return srtUrl;
            }
        }
    }
}