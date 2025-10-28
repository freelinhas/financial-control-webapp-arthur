import { useRouter } from 'vue-router'

export const useAuth = () => {
  const router = useRouter()

  const logout = () => {
    // Remove o token do localStorage
    localStorage.removeItem('token')
    
    // Remove qualquer outro dado de sessão
    localStorage.removeItem('user')
    
    // Limpa sessionStorage também (se houver)
    sessionStorage.clear()
    
    // Redireciona para a página de login
    router.push('/')
  }

  const isAuthenticated = () => {
    return !!localStorage.getItem('token')
  }

  const getToken = () => {
    return localStorage.getItem('token')
  }

  return {
    logout,
    isAuthenticated,
    getToken,
  }
}

