import {request} from '../request'

export function addUsers(addForm) {

  return request({
    url:'/users',
    method: 'post',
    data: {
      ...addForm
    }
  })
}