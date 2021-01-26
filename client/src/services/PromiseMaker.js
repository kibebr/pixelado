export const promise = ({ url, type, headers, errorMessage, data } = {}) => () => new Promise((resolve, reject) => {
  const request = new XMLHttpRequest()
  request.open(type, url)

  headers && headers.forEach(header => request.setRequestHeader(header.name, header.value))

  request.onload = () => {
    if (request.status >= 400 && request.status <= 500) {
      reject(Error(JSON.parse(request.responseText)))
    } else {
      resolve(JSON.parse(request.responseText))
    }
  }

  request.onerror = () => reject(Error(errorMessage))

  request.send(data && JSON.stringify(data))
})
