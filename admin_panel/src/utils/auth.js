import Cookies from 'js-cookie';
import store from "../store/store";

const TokenKey = 'isLogged';
const Token = 'token';
const User = 'user';

export function isLogged() {
    return Cookies.get(TokenKey) === '1';
}

export function notHasPermissions() {
    return Cookies.get(TokenKey) === '2';
}

export function setLogged(isLogged) {
    return Cookies.set(TokenKey, isLogged);
}

export function removeToken() {
    return Cookies.remove(TokenKey);
}

export function setToken(token) {
    return Cookies.set(Token, token);
}

export function getToken() {
    return Cookies.get(Token);
}

export function deleteToken() {
    return Cookies.remove(Token);
}

export function Auth(user) {
    return Cookies.set(User, user);
}

export function getAuth() {
    return Cookies.get(User);
}

export function removeAuth() {
    return Cookies.remove(User);
}

export function resetPermission() {
    store.commit('roles/SET_AUTH_USER_PERMISSIONS', []);
    store.commit('roles/SET_AUTH_USER_ROLES_PERMISSIONS', []);
}
