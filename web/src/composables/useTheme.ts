import { ref, watch } from 'vue'
import { useTheme } from 'vuetify'

export function useThemeToggle() {
  const theme = useTheme()
  const isDark = ref(theme.global.current.value.dark)

  const toggleTheme = () => {
    isDark.value = !isDark.value
    theme.global.name.value = isDark.value ? 'dark' : 'light'
    
    // Salvar preferência no localStorage
    localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
  }

  const setTheme = (dark: boolean) => {
    isDark.value = dark
    theme.global.name.value = dark ? 'dark' : 'light'
    localStorage.setItem('theme', dark ? 'dark' : 'light')
  }

  // Carregar tema salvo no localStorage
  const loadSavedTheme = () => {
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme) {
      setTheme(savedTheme === 'dark')
    } else {
      // Usar preferência do sistema
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      setTheme(prefersDark)
    }
  }

  // Observar mudanças no tema do sistema
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
  mediaQuery.addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
      setTheme(e.matches)
    }
  })

  return {
    isDark,
    toggleTheme,
    setTheme,
    loadSavedTheme,
  }
}
