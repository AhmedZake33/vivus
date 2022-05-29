// Get Month Name By Index
import {getToken} from "./auth";
import store from "../store/store"
// import  User from "../api/user";
// const user = new User();

const Diff = require('diff');

export function getMonth(num) {
    let months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"]
    return months[num];
}

export function getUrl(business_id, service_id, image) {
    return `https://auston.fekracomputers.net/api/businesses/${business_id}/services/${service_id}/image/${image}`
}


export function getMessageFile(message_id) {
       const token =getToken().replace('Bearer ','');
       return `https://auston.fekracomputers.net/api/messages/${message_id}/file/direct?token=${token}`;
}

export function camelCase( arr ) {
    return arr.replace('_', ' ').replace(/\s(.)/g, function ($1) {
        return $1.toUpperCase();
    }).replace(arr[0], arr[0].toUpperCase())
}

export function  toLocalDatetime(input,lang = 'ar',time = false) {
    const datetime = new Date(input);
    datetime.getTimezoneOffset();
    if(time){
        return datetime.toLocaleTimeString(`${lang == 'ar' ? 'ar-EG-u-nu-latn' : 'en-US'}`,{ year: 'numeric', month: 'short', day: 'numeric'});
    }else{
        return datetime.toLocaleDateString(`${lang == 'ar' ? 'ar-EG-u-nu-latn' : 'en-US'}`,{ year: 'numeric', month: 'short', day: 'numeric'}); 
    }
}

export function  formatDatetime(input,lang = 'ar',time = false) {
    const datetime = new Date(input);
    // datetime.setMinutes(datetime.getMinutes() - datetime.getTimezoneOffset())
    datetime.getTimezoneOffset();
    if(time){
        return datetime.toLocaleTimeString(`${lang == 'ar' ? 'ar-EG-u-nu-latn' : 'en-US'}`,{ year: 'numeric', month: 'numeric', day: 'numeric'});
    }else{
        return datetime.toLocaleDateString(`${lang == 'ar' ? 'ar-EG-u-nu-latn' : 'en-US'}`,{ year: 'numeric', month: 'numeric', day: 'numeric'});
    }
}

export function getUserPhoto(id){
    return `https://auston.fekracomputers.net/api/user/${id}/photo`;
}

export function  capitalize(str) {
    if (typeof str !== 'string') return ''
    return str.charAt(0).toUpperCase() + str.slice(1)
}

export  function  getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}
export function compare(oldReport , newReport) {
    var dif = " " ;
    var info = {text:String , ratio:0}
    var  total = newReport.split(' ').length;
    var  changes = 0;
    Diff.diffWords(oldReport, newReport).forEach((part) => {
        dif += part.added ? `<ins style="text-decoration: none; color: #00796B;background: #E0F2F1">${part.value+' '}</ins>` :
            part.removed ? `<del style="color: #b30000;background: #fadad7">${part.value+' '}</del>`:`<span>${part.value+' '}</span>` ;
        changes++;
    });
    //let total = changes + quotation;
    info.text = dif;
    info.ratio =  ((total-changes)/total)*100;
    return info;
}