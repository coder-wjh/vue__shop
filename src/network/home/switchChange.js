import {request} from '../request'

export function changeInfo(id,mg_state) {
  return request({
    url:'/users/'+id+'/state/'+mg_state,
    method: 'put',
    params: {
      id,
      mg_state
    }
  })
}