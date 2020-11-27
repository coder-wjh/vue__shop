import {request} from '../../request'

export function getParamsById(id,sel) {
  return request({
    url:'/categories/'+id+'/attributes',
    method:'GET',
    params:{
      sel
    }
  })
}