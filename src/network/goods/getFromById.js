import {request} from '../request'

export function FromById(id) {
  return request({
    url:'/categories/'+id,
        method:'GET',
        params:{
            
        }
  })
}