import { ref } from 'vue'

export interface LoaderState {
  visible: boolean
  message: string
  type: 'overlay' | 'spinner' | 'skeleton' | 'button' | 'progress'
  progress: number
  skeletonCount: number
  size: 'small' | 'medium' | 'large'
}

export function useLoader() {
  const loaderState = ref<LoaderState>({
    visible: false,
    message: 'Carregando...',
    type: 'spinner',
    progress: 0,
    skeletonCount: 3,
    size: 'medium'
  })

  const showLoader = (options: Partial<LoaderState> = {}) => {
    loaderState.value = {
      ...loaderState.value,
      ...options,
      visible: true
    }
  }

  const hideLoader = () => {
    loaderState.value.visible = false
  }

  const showOverlay = (message: string = 'Carregando...') => {
    showLoader({
      type: 'overlay',
      message,
      visible: true
    })
  }

  const showSpinner = (message: string = 'Carregando...', size: 'small' | 'medium' | 'large' = 'medium') => {
    showLoader({
      type: 'spinner',
      message,
      size,
      visible: true
    })
  }

  const showSkeleton = (count: number = 3, message: string = 'Carregando...') => {
    showLoader({
      type: 'skeleton',
      skeletonCount: count,
      message,
      visible: true
    })
  }

  const showButtonLoader = () => {
    showLoader({
      type: 'button',
      visible: true
    })
  }

  const showProgress = (progress: number = 0, message: string = 'Processando...') => {
    showLoader({
      type: 'progress',
      progress,
      message,
      visible: true
    })
  }

  const updateProgress = (progress: number) => {
    if (loaderState.value.type === 'progress') {
      loaderState.value.progress = progress
    }
  }

  return {
    loaderState,
    showLoader,
    hideLoader,
    showOverlay,
    showSpinner,
    showSkeleton,
    showButtonLoader,
    showProgress,
    updateProgress
  }
}

// Hook para operações assíncronas com loader automático
export function useAsyncLoader() {
  const { showOverlay, hideLoader } = useLoader()

  const executeWithLoader = async <T>(
    asyncFn: () => Promise<T>,
    message: string = 'Processando...'
  ): Promise<T> => {
    showOverlay(message)
    try {
      const result = await asyncFn()
      return result
    } finally {
      hideLoader()
    }
  }

  return {
    executeWithLoader
  }
}
