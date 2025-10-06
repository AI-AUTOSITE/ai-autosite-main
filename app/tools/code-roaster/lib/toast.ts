export function showToast(message: string, duration: number = 3000): void {
  if (typeof window === 'undefined') return

  // Remove existing toast if present
  const existingToast = document.getElementById('toast-notification')
  if (existingToast) {
    existingToast.remove()
  }

  // Create toast element
  const toast = document.createElement('div')
  toast.id = 'toast-notification'
  toast.className = `
    fixed top-4 left-1/2 transform -translate-x-1/2 z-50
    px-6 py-3 rounded-xl
    bg-gradient-to-r from-purple-600 to-blue-600
    text-white font-medium
    shadow-xl
    animate-slide-down
  `
  toast.textContent = message

  // Add animation styles
  const style = document.createElement('style')
  style.textContent = `
    @keyframes slide-down {
      from {
        opacity: 0;
        transform: translate(-50%, -100%);
      }
      to {
        opacity: 1;
        transform: translate(-50%, 0);
      }
    }
    .animate-slide-down {
      animation: slide-down 0.3s ease-out;
    }
  `

  document.head.appendChild(style)
  document.body.appendChild(toast)

  // Remove toast after duration
  setTimeout(() => {
    toast.style.transition = 'opacity 0.3s ease-out'
    toast.style.opacity = '0'

    setTimeout(() => {
      toast.remove()
      style.remove()
    }, 300)
  }, duration)
}
