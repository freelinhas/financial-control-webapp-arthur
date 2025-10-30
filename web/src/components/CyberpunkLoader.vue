<template>
  <div v-if="visible" class="modern-loader" :class="loaderClass">
    <!-- Overlay Loader -->
    <div v-if="type === 'overlay'" class="loader-overlay">
      <div class="loader-content">
        <div class="modern-spinner">
          <div class="spinner-ring"></div>
          <div class="spinner-ring"></div>
          <div class="spinner-ring"></div>
        </div>
        <div class="loader-text">
          <h3 class="loader-title">{{ message }}</h3>
          <div class="loading-dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </div>
    </div>

    <!-- Inline Spinner -->
    <div v-else-if="type === 'spinner'" class="inline-spinner">
      <div class="modern-spinner-small">
        <div class="spinner-ring-small"></div>
        <div class="spinner-ring-small"></div>
        <div class="spinner-ring-small"></div>
      </div>
      <span v-if="message" class="spinner-text">{{ message }}</span>
    </div>

    <!-- Skeleton Loader -->
    <div v-else-if="type === 'skeleton'" class="skeleton-loader">
      <div v-for="i in skeletonCount" :key="i" class="skeleton-item">
        <div class="skeleton-line"></div>
        <div class="skeleton-line short"></div>
      </div>
    </div>

    <!-- Button Loader -->
    <div v-else-if="type === 'button'" class="button-loader">
      <div class="cyberpunk-spinner-tiny">
        <div class="spinner-ring-tiny"></div>
        <div class="spinner-ring-tiny"></div>
        <div class="spinner-ring-tiny"></div>
      </div>
    </div>

    <!-- Progress Bar -->
    <div v-else-if="type === 'progress'" class="progress-loader">
      <div class="progress-bar">
        <div class="progress-fill" :style="{ width: progress + '%' }"></div>
      </div>
      <div class="progress-text">{{ message }} ({{ progress }}%)</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  visible?: boolean
  type?: 'overlay' | 'spinner' | 'skeleton' | 'button' | 'progress'
  message?: string
  progress?: number
  skeletonCount?: number
  size?: 'small' | 'medium' | 'large'
}

const props = withDefaults(defineProps<Props>(), {
  visible: true,
  type: 'spinner',
  message: 'Carregando...',
  progress: 0,
  skeletonCount: 3,
  size: 'medium'
})

const loaderClass = computed(() => ({
  [`loader-${props.size}`]: true,
  [`loader-${props.type}`]: true
}))
</script>

<style scoped>
.cyberpunk-loader {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

/* Overlay Loader */
.loader-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  backdrop-filter: blur(5px);
  z-index: 99999;
  display: flex;
  align-items: center;
  justify-content: center;
}

.loader-content {
  text-align: center;
  position: relative;
}

.modern-spinner {
  position: relative;
  width: 80px;
  height: 80px;
  margin: 0 auto 20px;
}

.spinner-ring {
  position: absolute;
  width: 100%;
  height: 100%;
  border: 3px solid transparent;
  border-radius: 50%;
  animation: modernSpin 1.5s linear infinite;
}

.spinner-ring:nth-child(1) {
  border-top-color: #1976d2;
  animation-delay: 0s;
}

.spinner-ring:nth-child(2) {
  border-right-color: #2196f3;
  animation-delay: 0.2s;
}

.spinner-ring:nth-child(3) {
  border-bottom-color: #64b5f6;
  animation-delay: 0.4s;
}

/* Inline Spinner */
.inline-spinner {
  display: flex;
  align-items: center;
  gap: 12px;
}

.modern-spinner-small {
  position: relative;
  width: 24px;
  height: 24px;
}

.spinner-ring-small {
  position: absolute;
  width: 100%;
  height: 100%;
  border: 2px solid transparent;
  border-radius: 50%;
  animation: modernSpin 1.5s linear infinite;
}

.spinner-ring-small:nth-child(1) {
  border-top-color: #1976d2;
  animation-delay: 0s;
}

.spinner-ring-small:nth-child(2) {
  border-right-color: #2196f3;
  animation-delay: 0.2s;
}

.spinner-ring-small:nth-child(3) {
  border-bottom-color: #64b5f6;
  animation-delay: 0.4s;
}

.spinner-text {
  color: #1976d2;
  font-weight: 500;
}

/* Button Loader */
.button-loader {
  display: flex;
  align-items: center;
  justify-content: center;
}

.cyberpunk-spinner-tiny {
  position: relative;
  width: 16px;
  height: 16px;
}

.spinner-ring-tiny {
  position: absolute;
  width: 100%;
  height: 100%;
  border: 1px solid transparent;
  border-radius: 50%;
  animation: cyberpunkSpin 1s linear infinite;
}

.spinner-ring-tiny:nth-child(1) {
  border-top-color: #00ffff;
  animation-delay: 0s;
}

.spinner-ring-tiny:nth-child(2) {
  border-right-color: #ff00ff;
  animation-delay: 0.15s;
}

.spinner-ring-tiny:nth-child(3) {
  border-bottom-color: #00ff00;
  animation-delay: 0.3s;
}

/* Skeleton Loader */
.skeleton-loader {
  width: 100%;
  padding: 16px;
}

.skeleton-item {
  margin-bottom: 16px;
  animation: skeletonPulse 1.5s ease-in-out infinite;
}

.skeleton-line {
  height: 12px;
  background: linear-gradient(90deg, 
    rgba(0, 255, 255, 0.1) 0%, 
    rgba(0, 255, 255, 0.3) 50%, 
    rgba(0, 255, 255, 0.1) 100%);
  border-radius: 6px;
  margin-bottom: 8px;
  position: relative;
  overflow: hidden;
}

.skeleton-line::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, 
    transparent, 
    rgba(0, 255, 255, 0.4), 
    transparent);
  animation: skeletonShimmer 2s infinite;
}

.skeleton-line.short {
  width: 60%;
}

/* Progress Loader */
.progress-loader {
  width: 100%;
  text-align: center;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background: rgba(0, 0, 0, 0.5);
  border: 1px solid #00ffff;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 8px;
  position: relative;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, 
    #00ffff 0%, 
    #ff00ff 50%, 
    #00ff00 100%);
  border-radius: 4px;
  transition: width 0.3s ease;
  position: relative;
  overflow: hidden;
}

.progress-fill::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, 
    transparent, 
    rgba(255, 255, 255, 0.3), 
    transparent);
  animation: progressShimmer 1.5s infinite;
}

.progress-text {
  color: #00ffff;
  font-family: 'Courier New', monospace;
  font-size: 12px;
  text-shadow: 0 0 4px #00ffff;
}

/* Text Styles */
.loader-title {
  color: #1976d2;
  font-weight: 600;
  margin-bottom: 16px;
}

.loading-dots {
  display: flex;
  justify-content: center;
  gap: 4px;
}

.loading-dots span {
  width: 8px;
  height: 8px;
  background: #00ffff;
  border-radius: 50%;
  animation: dotPulse 1.4s ease-in-out infinite;
}

.loading-dots span:nth-child(2) {
  animation-delay: 0.2s;
}

.loading-dots span:nth-child(3) {
  animation-delay: 0.4s;
}

/* Animations */
@keyframes modernSpin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@keyframes skeletonPulse {
  0%, 100% {
    opacity: 0.6;
  }
  50% {
    opacity: 1;
  }
}

@keyframes skeletonShimmer {
  0% {
    left: -100%;
  }
  100% {
    left: 100%;
  }
}

@keyframes progressShimmer {
  0% {
    left: -100%;
  }
  100% {
    left: 100%;
  }
}

@keyframes dotPulse {
  0%, 80%, 100% {
    transform: scale(0.8);
    opacity: 0.5;
  }
  40% {
    transform: scale(1.2);
    opacity: 1;
  }
}

/* Size Variants */
.loader-small .cyberpunk-spinner {
  width: 40px;
  height: 40px;
}

.loader-small .cyberpunk-spinner-small {
  width: 16px;
  height: 16px;
}

.loader-large .cyberpunk-spinner {
  width: 120px;
  height: 120px;
}

.loader-large .cyberpunk-spinner-small {
  width: 32px;
  height: 32px;
}

/* Responsive */
@media (max-width: 768px) {
  .cyberpunk-spinner {
    width: 60px;
    height: 60px;
  }
  
  .loader-title {
    font-size: 14px;
  }
}
</style>
