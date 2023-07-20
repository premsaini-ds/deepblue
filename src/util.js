window.isStaging = () => {
    return window.location.href.indexOf('preview.pagescdn.com') > -1;
};
function setupCookies(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    let expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}
function deleteCookies(cname) {
    const d = new Date();
    d.setTime(d.getTime() + (24*60*60*1000));
    let expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=;" + expires + ";path=/";
}
function getCookies(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

window.onReady =(cb) => {
    if (document.readyState === "complete"
            || document.readyState === "loaded"
            || document.readyState === "interactive") {
        cb.bind(this)();
    } else {
        document.addEventListener('DOMContentLoaded', cb.bind(this));
    }
    setTimeout(()=>{
        let cookie_consent = getCookies("user_cookie_consent");
        if(cookie_consent != ""){
            $("cookieNotice")?.hide();
        }else{
            $("cookieNotice")?.show();
        }
    },2000);
}
