// import Cookies from 'js-cookie'

// const TokenKey = 'Jms-Store-Token'

// export function getToken() {
//   return Cookies.get(TokenKey)
// }

// export function setToken(token) {
//   return Cookies.set(TokenKey, token)
// }

// export function removeToken() {
//   return Cookies.remove(TokenKey)
// }

const TokenKey = 'Jms-Store-Token'

export function getToken() {
  return JSON.parse(window.localStorage.getItem(TokenKey));
}

export function setToken(TokenKey,token) {
  return window.localStorage.setItem(TokenKey, JSON.stringify(token))
}

export function removeToken() {
  return window.localStorage.removeItem(TokenKey)
}