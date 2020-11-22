import {request} from '../request'

export function deletedParams(id,attrId) {
  return request({
    url:'/categories/'+id+'/attributes/'+attrId,
    method:'delete',
    params:{
      
    }
  })
}