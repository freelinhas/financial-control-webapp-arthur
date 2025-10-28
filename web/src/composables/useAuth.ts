export const useAuth = () => {
  const isAuthenticated = () => {
    return !!localStorage.getItem('token')
  }

  const getToken = () => {
    return localStorage.getItem('token')
  }

  return {
    isAuthenticated,
    getToken,
  }
}

