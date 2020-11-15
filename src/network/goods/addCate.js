import {request} from '../request'

export function addCateList(addCateForm) {
  return request({
    url:'/categories',
    method:'post',
    data:{
      ...addCateForm
    }
  })
}