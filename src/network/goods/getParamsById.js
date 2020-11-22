import {request} from '../request'

export function getParamsById(id,attrId,attr_sel) {
  return request({
    url:'/categories/'+id+'/attributes/'+attrId,
    method:'GET',
    params:{
      attr_sel
    }
  })
}