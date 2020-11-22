import {request} from '../request'

export function getFromByIdandPa(id,sel) {
  return request({
    url:'/categories/'+id+'/attributes',
    method:'GET',
    params:{
      sel
    }
  })
}