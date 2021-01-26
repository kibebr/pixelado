export const getCurrentSession = () => JSON.parse(window.localStorage.getItem('loggedUser'))
export const setCurrentSession = data => window.localStorage.setItem('loggedUser', JSON.stringify(data))
