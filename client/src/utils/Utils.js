export const isOdd = n => n % 2 === 1
export const debounce = (method, delay) => {
  clearTimeout(method._tId);
  method._tId = setTimeout(function(){
    method();
  }, delay);
}

export const getVotes = type => type.reduce((total, { count }) => total + count, 0)

export const toObj = field => arr => {
  const obj = {}
  arr.forEach(el => obj[el[field]] = el)
  return obj
}

export const toObjFromId = toObj('id')
