import { ref } from 'vue'

interface LoaderState {
  visible: boolean
  message: string
  type: 'overlay' | 'spinner' | 'skeleton' | 'button' | 'progress'
  progress: number
  skeletonCount: number
  size: 'small' | 'medium' | 'large'
}

// Estado global do loader
const loaderState = ref<LoaderState>({
  visible: false,
  message: 'Carregando...',
  type: 'overlay',
  progress: 0,
  skeletonCount: 3,
  size: 'medium'
})

export const useGlobalLoader = () => {
  const showOverlay = (message: string = 'Carregando...') => {
    loaderState.value = {
      visible: true,
      message,
      type: 'overlay',
      progress: 0,
      skeletonCount: 3,
      size: 'medium'
    }
  }

  const hideLoader = () => {
    loaderState.value.visible = false
  }

  const showSpinner = (message: string = 'Carregando...', size: 'small' | 'medium' | 'large' = 'medium') => {
    loaderState.value = {
      visible: true,
      message,
      type: 'spinner',
      progress: 0,
      skeletonCount: 3,
      size
    }
  }

  const showSkeleton = (count: number = 3, message: string = 'Carregando...') => {
    loaderState.value = {
      visible: true,
      message,
      type: 'skeleton',
      progress: 0,
      skeletonCount: count,
      size: 'medium'
    }
  }

  const showButtonLoader = () => {
    loaderState.value = {
      visible: true,
      message: '',
      type: 'button',
      progress: 0,
      skeletonCount: 3,
      size: 'small'
    }
  }

  const showProgress = (progress: number = 0, message: string = 'Processando...') => {
    loaderState.value = {
      visible: true,
      message,
      type: 'progress',
      progress,
      skeletonCount: 3,
      size: 'medium'
    }
  }

  const updateProgress = (progress: number) => {
    if (loaderState.value.type === 'progress') {
      loaderState.value.progress = progress
    }
  }

  return {
    loaderState,
    showOverlay,
    hideLoader,
    showSpinner,
    showSkeleton,
    showButtonLoader,
    showProgress,
    updateProgress
  }
}
