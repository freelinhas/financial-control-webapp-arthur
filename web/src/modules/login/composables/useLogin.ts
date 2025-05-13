import { useRouter } from 'vue-router'
import { authService } from '../../services/auth.service';

export const useLogin = () => {
  const router = useRouter()

  const login = async (email: string, password: string) => {
    try {
      const data = await authService.login(email, password)
      localStorage.setItem('token', data.token)
      router.push('/home')
    } catch (err) {
      alert('Falha no login. Verifique as credenciais.')
    }
  }

  return { login }
}
