'use client'

import { cn } from '@/lib/utils/cn'
import {
  createContext,
  useContext,
  useCallback,
  useState,
  useEffect,
  useRef,
  type ReactNode,
} from 'react'
import { motion, AnimatePresence } from 'framer-motion'

/* ----------------------------------------------------------------
   Types
   ---------------------------------------------------------------- */

type ToastType = 'success' | 'info' | 'warning' | 'error'

interface ToastData {
  id: string
  message: string
  type: ToastType
}

interface ToastContextValue {
  addToast: (message: string, type?: ToastType) => void
  removeToast: (id: string) => void
}

/* ----------------------------------------------------------------
   Context
   ---------------------------------------------------------------- */

const ToastContext = createContext<ToastContextValue | null>(null)

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext)
  if (!ctx) {
    throw new Error('useToast must be used within a <ToastProvider>')
  }
  return ctx
}

/* ----------------------------------------------------------------
   Provider
   ---------------------------------------------------------------- */

interface ToastProviderProps {
  children: ReactNode
}

export function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastData[]>([])

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const addToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
    setToasts((prev) => [...prev, { id, message, type }])
  }, [])

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}

      {/* Toast container */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] flex flex-col-reverse gap-2 pointer-events-none">
        <AnimatePresence mode="popLayout">
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              layout
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="pointer-events-auto"
            >
              <Toast
                message={toast.message}
                type={toast.type}
                onDismiss={() => removeToast(toast.id)}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}

/* ----------------------------------------------------------------
   Toast component
   ---------------------------------------------------------------- */

interface ToastProps {
  message: string
  type?: ToastType
  onDismiss: () => void
}

const typeStyles: Record<ToastType, { accent: string; icon: string }> = {
  success: { accent: 'var(--success)', icon: 'M5 13l4 4L19 7' },
  info: { accent: 'var(--info)', icon: 'M12 8v4m0 4h.01' },
  warning: { accent: 'var(--warning)', icon: 'M12 9v4m0 4h.01' },
  error: { accent: 'var(--danger)', icon: 'M6 6l12 12M18 6L6 18' },
}

export function Toast({ message, type = 'info', onDismiss }: ToastProps) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const { accent, icon } = typeStyles[type]

  useEffect(() => {
    timerRef.current = setTimeout(onDismiss, 4000)
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [onDismiss])

  return (
    <div
      className={cn(
        'flex items-center gap-3 px-4 py-3 min-w-[280px] max-w-[420px]',
        'rounded-[var(--radius-xl)] border border-[var(--glass-border)]',
        'shadow-[var(--glass-shadow)]',
        'cursor-pointer select-none'
      )}
      style={{
        background: 'var(--bg-elevated)',
        backdropFilter: 'blur(var(--glass-blur))',
        WebkitBackdropFilter: 'blur(var(--glass-blur))',
      }}
      onClick={onDismiss}
      role="alert"
    >
      {/* Icon */}
      <div
        className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full"
        style={{ background: `${accent}20` }}
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke={accent}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d={icon} />
        </svg>
      </div>

      {/* Message */}
      <p className="flex-1 text-sm text-[var(--text-primary)] leading-snug">
        {message}
      </p>

      {/* Dismiss */}
      <button
        className="flex-shrink-0 text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] transition-colors"
        onClick={(e) => {
          e.stopPropagation()
          onDismiss()
        }}
        aria-label="Dismiss"
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        >
          <path d="M4 4l8 8M12 4l-8 8" />
        </svg>
      </button>
    </div>
  )
}
