import {request} from '../request'

export function getloginForm(username,password) {
  return request({
    url:'/login',
    method: 'post',
    params: {
      username,
      password
    }
  })
}