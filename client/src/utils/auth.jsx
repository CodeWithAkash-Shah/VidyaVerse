export const signUp = (userData) => {
  const users = JSON.parse(localStorage.getItem('users') || '[]')
  users.push(userData)
  localStorage.setItem('users', JSON.stringify(users))
}

export const signIn = ({ username, password }) => {
  const users = JSON.parse(localStorage.getItem('users') || '[]')
  const user = users.find(u => u.username === username && u.password === password)
  if (user) {
    localStorage.setItem('currentUser', JSON.stringify(user))
    return user
  }
  return null
}

export const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem('currentUser'))
}

export const logout = () => {
  localStorage.removeItem('currentUser')
}
