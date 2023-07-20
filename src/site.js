$(document).on('click',"#menu-btn",()=>{$(this).toggleClass('active');$('#menu-responsive').toggleClass('show');});
$(document).on('click',".get-direction-url",getDirection);

$(document).ready(function(){
    let cookie_consent = getCookie("user_cookie_consent");
    if(cookie_consent != ""){
        $("#cookieNotice").remove();
    }else{
        $("#cookieNotice").show();
        $(document).on('click',".acceptconcent",()=>{
            $('#cookieNotice').remove();
            setCookie('user_cookie_consent',1,365);
        });
    }
});
$(document).on('click',".closePopupOrderNow", function (e) {      
    let url = $(this).attr('data-href');
    if(url.indexOf('http') === 0){
    e.preventDefault();
    $('.popup-orderOnline-link').attr('href', url);
    $('#order-popup').removeClass("hidden");
    $('#body').addClass("overflow-hidden");
    }else{
    window.location.href = url;
    }
    return false;
});
$(document).on('click',".popup-orderOnline-link, .closeButton1", function (e) { 
    $('#body').removeClass("overflow-hidden");
    $('#order-popup').addClass("hidden");
});

/**
 * Function used to hangle click on Get Direction button
 * @param {*} ele Element on which user clicked
 * return none
 */
function getDirection(ele) {
    let element = $(ele.currentTarget);
    let placeId = element.attr('data-placeid');
    let line1 = element.attr('data-addressline1');
    let line2 = element.attr('data-addressline2');
    let city = element.attr('data-city');
    let state = element.attr('data-state');
    let country = element.attr('data-country');
    let latitude = element.attr('data-latitude');
    let longitude = element.attr('data-longitude');
    let postalCode = element.attr('data-postalcode');
    let user_latitude = getCookie('user_latitude');
    let user_longitude = getCookie('user_longitude');
    let addressString = '';
    let originString = '';

    if(line1.trim() != '') addressString = line1;
    if(line2.trim() != '') addressString += (addressString)?`, ${line2}` : line2;
    if(city.trim() != ''){
        addressString += (addressString)?`, ${city}` : city;
        originString += (originString)?`, ${city}` : city;
    }
    if(state.trim() != ''){
        addressString += (addressString)?`, ${state}` : state;
        originString += (originString)?`, ${state}` : state;
    }
    if(postalCode.trim() != ''){
        addressString += (addressString)?`, ${postalCode}` : postalCode;
        originString += (originString)?`, ${postalCode}` : postalCode;
    }
    if(country.trim() != '' && originString == ""){ originString += (originString)?`, ${country}` : country; }
    if(country.trim() != '') addressString += (addressString)?`, ${country}` : country;
    if(!addressString.trim()) addressString = `${latitude},${longitude}`;

    if (user_latitude && user_longitude) {
        var direction_url = 'https://www.google.com/maps/dir/?api=1&destination=' + encodeURIComponent(addressString) + '&origin=' + user_latitude + ',' + user_longitude;
        if(placeId) direction_url += "&destination_place_id=" + placeId;
        $(element).attr('href',direction_url).attr('target','_blank').removeClass('get-direction-url');/* .trigger('click'); */
        window.open(direction_url, '_blank');
    } else {
        getDirectionUrl(addressString, originString, placeId ,element);
    }
}
/**
 * Used To Set Cookie On Browser
 * @param string cname Element on which user clicked
 * @param mixed cvalue Element on which user clicked
 * @param integer exdays Element on which user clicked
 * */ 
function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    let expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}
function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
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

function getDirectionUrl(addressString, originString,placeId = '',element = null) {
    $(".error-text").html("");
    if (navigator.geolocation) {
        const errorNavigator = (error) => {
            let message_string = 'Unable to determine your location. please share upblock/allow your location';
            if (confirm(message_string) != true) {
                let direction_url = 'https://www.google.com/maps/dir/?api=1&destination=' + encodeURIComponent(addressString) + '&origin=' + encodeURIComponent(originString);
                if(placeId) direction_url += "&destination_place_id=" + placeId;
                if(element){
                    $(element).attr('href',direction_url).attr('target','_blank').removeClass('get-direction-url');/* .trigger('click'); */
                    window.open(direction_url, '_blank');
                }else{
                    window.open(direction_url, '_blank');
                }
            } else {
                return false;
            }
        }
        navigator.geolocation.getCurrentPosition(function (position) {
            currentLatitude = position.coords.latitude;
            currentLongitude = position.coords.longitude;
            /* setCookie("user_latitude", currentLatitude, 1);
            setCookie("user_longitude", currentLongitude, 1); */
            let direction_url = 'https://www.google.com/maps/dir/?api=1&destination=' + encodeURIComponent(addressString) + '&origin=' + encodeURIComponent(currentLatitude + ',' + currentLongitude);
            if(placeId) direction_url += "&destination_place_id=" + placeId;
            if(element){
                $(element).attr('href',direction_url).attr('target','_blank').removeClass('get-direction-url');/* .trigger('click'); */
                window.open(direction_url, '_blank');
            }else{
                window.open(direction_url, '_blank');
            }
        }, errorNavigator, {
            timeout: 10000
        });
    };
}
function getCoordinates(address, latitude, longitude) {
    var getDirectionUrl = 'https://www.google.com/maps/dir/?api=1&origin=UK' + address + '&destination=' + latitude + ',' + longitude;
    window.open(getDirectionUrl, '_blank');
}
function iframeOpen(ele){
    let iframeSrc = $(ele).attr('href');
    let iframeTitle = $(ele).attr('title');
    $('#pdfIframe1').attr('src',``);
    $('#allergens1-pdf').addClass("hidden");
    $('#body').removeClass("overflow-hidden");
    if(iframeSrc){
        $('#pdfIframe1').attr('src',`${iframeSrc}#toolbar=0&navpanes=0&scrollbar=0&zoom=100`);
        $('#allergens1-pdf').removeClass("hidden");
        $('#allergens1-pdf h3').html(iframeTitle?iframeTitle:"Allergens");
        $('#body').addClass("overflow-hidden");
    }
    return false;
};
$(document).on('click','#closeButton2',(e)=>{
    e.preventDefault();
    $('#pdfIframe1').attr('src',``);
    $('#allergens1-pdf').addClass("hidden");
    $('#body').removeClass("overflow-hidden");
});