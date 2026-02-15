'use client'

import { cn } from '@/lib/utils/cn'
import { type InputHTMLAttributes, type TextareaHTMLAttributes, forwardRef } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, id, ...rest }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined)

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-[var(--text-secondary)]"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            'w-full px-4 py-2.5 text-sm text-[var(--text-primary)]',
            'rounded-[var(--radius-lg)]',
            'border outline-none',
            'transition-all duration-200',
            'placeholder:text-[var(--text-tertiary)]',
            error
              ? 'border-[var(--danger)] focus:ring-1 focus:ring-[var(--danger)]'
              : 'border-[var(--glass-border)] focus:border-[var(--accent-primary)] focus:ring-1 focus:ring-[var(--accent-primary)]',
            className
          )}
          style={{
            background: 'var(--bg-secondary)',
            fontFamily: 'var(--font-primary)',
          }}
          {...rest}
        />
        {error && (
          <p className="text-xs text-[var(--danger)]">{error}</p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className, id, ...rest }, ref) => {
    const textareaId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined)

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={textareaId}
            className="text-sm font-medium text-[var(--text-secondary)]"
          >
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          className={cn(
            'w-full px-4 py-2.5 text-sm text-[var(--text-primary)]',
            'rounded-[var(--radius-lg)]',
            'border outline-none',
            'transition-all duration-200',
            'placeholder:text-[var(--text-tertiary)]',
            'resize-y min-h-[100px]',
            error
              ? 'border-[var(--danger)] focus:ring-1 focus:ring-[var(--danger)]'
              : 'border-[var(--glass-border)] focus:border-[var(--accent-primary)] focus:ring-1 focus:ring-[var(--accent-primary)]',
            className
          )}
          style={{
            background: 'var(--bg-secondary)',
            fontFamily: 'var(--font-primary)',
          }}
          {...rest}
        />
        {error && (
          <p className="text-xs text-[var(--danger)]">{error}</p>
        )}
      </div>
    )
  }
)

Textarea.displayName = 'Textarea'
