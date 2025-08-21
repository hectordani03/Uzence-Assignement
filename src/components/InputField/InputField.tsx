import { forwardRef, InputHTMLAttributes, useId, useMemo, useState } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../lib/cn'

// ── Base prop shape shared across variants/states ──────
type BaseProps = {
  label?: string
  helperText?: string
  errorMessage?: string
  invalid?: boolean
  loading?: boolean
  clearable?: boolean
  passwordToggle?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  prefix?: string
  suffix?: string
  fullWidth?: boolean
}

// ── Public component props  ───────
export interface InputFieldProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'onChange'>,
    BaseProps,
    VariantProps<typeof inputVariants> {
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  variant?: 'filled' | 'outlined' | 'ghost' | 'glass'
  size?: 'sm' | 'md' | 'lg'
}

// ── Styles: CVA variants for look/size/state─────────
const inputVariants = cva(
  [
    'block w-full rounded-xl transition-all duration-200 font-medium placeholder:font-normal',
    'placeholder:text-gray-400 dark:placeholder:text-gray-500',
    'disabled:cursor-not-allowed disabled:opacity-50',
    'focus:outline-none focus:ring-0'
  ],
  {
    variants: {
      variant: {
        filled: [
          'bg-gray-100/80 dark:bg-gray-800/50 backdrop-blur-sm',
          'border border-transparent',
          'hover:bg-gray-100 dark:hover:bg-gray-800/70',
          'focus:bg-white/90 dark:focus:bg-gray-900/80',
          'focus:shadow-lg focus:shadow-blue-500/20 dark:focus:shadow-blue-400/20',
          'focus:border-blue-200 dark:focus:border-blue-700'
        ],
        outlined: [
          'bg-white/60 dark:bg-gray-900/40 backdrop-blur-sm',
          'border border-gray-200/60 dark:border-gray-700/50',
          'hover:border-gray-300/80 dark:hover:border-gray-600/70',
          'hover:bg-white/80 dark:hover:bg-gray-900/60',
          'focus:border-blue-400 dark:focus:border-blue-500',
          'focus:shadow-lg focus:shadow-blue-500/20 dark:focus:shadow-blue-400/20',
          'focus:bg-white/90 dark:focus:bg-gray-900/80'
        ],
        ghost: [
          'bg-transparent backdrop-blur-sm',
          'border border-transparent',
          'hover:bg-white/20 dark:hover:bg-gray-800/20',
          'focus:bg-white/60 dark:focus:bg-gray-900/40',
          'focus:border-blue-300 dark:focus:border-blue-600',
          'focus:shadow-lg focus:shadow-blue-500/20 dark:focus:shadow-blue-400/20'
        ],
        glass: [
          'bg-white/20 dark:bg-gray-900/20 backdrop-blur-md',
          'border border-white/20 dark:border-gray-700/30',
          'hover:bg-white/30 dark:hover:bg-gray-900/30',
          'hover:border-white/40 dark:hover:border-gray-600/40',
          'focus:bg-white/40 dark:focus:bg-gray-900/40',
          'focus:border-blue-400/50 dark:focus:border-blue-500/50',
          'focus:shadow-xl focus:shadow-blue-500/25 dark:focus:shadow-blue-400/25'
        ]
      },
      size: {
        sm: 'text-sm px-3 py-2.5 h-10',
        md: 'text-base px-4 py-3 h-12',
        lg: 'text-lg px-5 py-3.5 h-14'
      },
      state: {
        normal: '',
        invalid: [
          'border-red-400/60 dark:border-red-500/60',
          'focus:border-red-500 dark:focus:border-red-400',
          'focus:shadow-lg focus:shadow-red-500/20 dark:focus:shadow-red-400/20',
          'bg-red-50/30 dark:bg-red-900/10'
        ],
        loading: 'cursor-progress'
      }
    },
    defaultVariants: {
      variant: 'outlined',
      size: 'md',
      state: 'normal'
    }
  }
)

// ── Small inline icons ───
const EyeIcon = ({ open }: { open: boolean }) => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    {open ? (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    ) : (
      <>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L12 12m6.121-3.121A9.97 9.97 0 0121 12c0 1.426-.329 2.778-.914 3.979m-6.014 1.917L12 12m-3.878-3.121A3.001 3.001 0 0012 9a3.003 3.003 0 00-1.878.879" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3l18 18" />
      </>
    )}
  </svg>
)

const ClearIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
)

const LoadingSpinner = ({ size = 'sm' }: { size?: 'sm' | 'md' }) => (
  <svg className={cn('animate-spin', size === 'sm' ? 'w-4 h-4' : 'w-5 h-5')} viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" className="opacity-25" />
    <path
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      className="opacity-75"
    />
  </svg>
)

// ── InputField: accessible, variant-driven text input ────────────────
export const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  (
    {
      id,
      label,
      helperText,
      errorMessage,
      invalid,
      loading,
      clearable,
      passwordToggle,
      leftIcon,
      rightIcon,
      prefix,
      suffix,
      fullWidth = true,
      type = 'text',
      variant,
      size,
      value,
      onChange,
      disabled,
      className,
      ...props
    },
    ref
  ) => {

    // IDs used for label and ARIA descriptions
    const uid = useId()
    const inputId = id ?? `input-${uid}`
    const helpId = helperText ? `${inputId}-help` : undefined
    const errId = errorMessage ? `${inputId}-err` : undefined
    const describedBy = [helpId, errId].filter(Boolean).join(' ') || undefined

    // Derived state from props
    const state: 'normal' | 'invalid' | 'loading' =
      invalid || errorMessage ? 'invalid' : loading ? 'loading' : 'normal'

    const [showPwd, setShowPwd] = useState(false)
    const [isFocused, setIsFocused] = useState(false)
    const isPassword = type === 'password'

    // Feature guards for right-side actions
    const canClear =
      clearable && !disabled && !loading && typeof value === 'string' && value.length > 0

    // Input type switches when passwordtoggle is enabled
    const inputType = isPassword && passwordToggle ? (showPwd ? 'text' : 'password') : type

    // Dynamic paddings
    const leftPadding =
      leftIcon || prefix ? (size === 'sm' ? 'pl-10' : size === 'lg' ? 'pl-12' : 'pl-11') : ''


    const rightPadding = useMemo(() => {
      let elements = 0
      if (loading) elements++
      if (canClear) elements++
      if (isPassword && passwordToggle) elements++
      if (rightIcon || suffix) elements++

      if (elements === 0) return ''

      const baseSpacing = size === 'sm' ? 10 : size === 'lg' ? 12 : 11
      return `pr-[${baseSpacing + elements * 32}px]`
    }, [isPassword, passwordToggle, canClear, loading, rightIcon, suffix, size])

    return (
      <div className={cn('space-y-2', fullWidth ? 'w-full' : 'inline-block')}>
        {/* Label with subtle state color */}
        {label && (
          <label
            htmlFor={inputId}
            className={cn(
              'block text-sm font-semibold transition-colors duration-200',
              state === 'invalid'
                ? 'text-red-600 dark:text-red-400'
                : isFocused
                ? 'text-blue-600 dark:text-blue-400'
                : 'text-gray-700 dark:text-gray-300'
            )}
          >
            {label}
            {props.required && <span className="ml-1 text-red-500">*</span>}
          </label>
        )}

        <div className="relative group">
          {/* Left adornment: icon or prefix */}
          {(leftIcon || prefix) && (
            <div
              className={cn(
                'absolute left-3 top-1/2 -translate-y-1/2 flex items-center',
                'text-gray-500 dark:text-gray-400 transition-colors duration-200',
                isFocused && 'text-blue-500 dark:text-blue-400'
              )}
            >
              {leftIcon || <span className="text-sm font-medium">{prefix}</span>}
            </div>
          )}

          {/* Input control */}
          <input
            id={inputId}
            ref={ref}
            className={cn(
              inputVariants({ variant, size, state }),
              leftPadding,
              rightPadding,
              'text-gray-900 dark:text-gray-100',
              className
            )}
            type={inputType}
            aria-invalid={state === 'invalid' || undefined}
            aria-describedby={describedBy}
            disabled={disabled}
            value={value}
            onChange={onChange}
            onFocus={(e) => {
              setIsFocused(true)
              props.onFocus?.(e)
            }}
            onBlur={(e) => {
              setIsFocused(false)
              props.onBlur?.(e)
            }}
            {...props}
          />

          {/* Right-side actions */}
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center space-x-1">
            {suffix && (
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                {suffix}
              </span>
            )}

            {rightIcon && <div className="text-gray-500 dark:text-gray-400">{rightIcon}</div>}

            {/* Loading spinner */}
            {loading && (
              <div role="status" aria-live="polite" aria-label="Loading" className="text-blue-600 dark:text-blue-400">
                <LoadingSpinner size={size === 'sm' ? 'sm' : 'md'} />
              </div>
            )}

            {/* Clear button */}
            {canClear && (
              <button
                type="button"
                aria-label="Clear input"
                className={cn(
                  'p-1.5 rounded-lg transition-colors duration-200',
                  'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200',
                  'hover:bg-gray-100/80 dark:hover:bg-gray-800/60'
                )}
                onClick={(e) => {
                  const target = e.currentTarget.parentElement?.parentElement?.querySelector(
                    'input'
                  ) as HTMLInputElement
                  if (target) {
                    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
                      window.HTMLInputElement.prototype,
                      'value'
                    )!.set!
                    nativeInputValueSetter.call(target, '')
                    target.dispatchEvent(new Event('input', { bubbles: true }))
                    target.focus()
                  }
                }}
              >
                <ClearIcon />
              </button>
            )}

            {/* Password visibility toggle */}
            {isPassword && passwordToggle && (
              <button
                type="button"
                aria-label={showPwd ? 'Hide password' : 'Show password'}
                className={cn(
                  'p-1.5 rounded-lg transition-colors duration-200',
                  'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200',
                  'hover:bg-gray-100/80 dark:hover:bg-gray-800/60'
                )}
                onClick={() => setShowPwd((s) => !s)}
              >
                <EyeIcon open={showPwd} />
              </button>
            )}
          </div>

          {/* Focus hint: subtle bottom line */}
          {isFocused && (
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 bg-gradient-to-r from-transparent via-blue-500 to-transparent w-1/3 rounded-full transition-all duration-300" />
          )}
        </div>

        {/* Helper or error message */}
        <div className="min-h-[1.25rem]">
          {state === 'invalid' ? (
            <div className="flex items-center space-x-1">
              <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              <p id={errId} className="text-sm text-red-600 dark:text-red-400 font-medium">
                {errorMessage || 'Invalid value'}
              </p>
            </div>
          ) : helperText ? (
            <p id={helpId} className="text-sm text-gray-500 dark:text-gray-400">
              {helperText}
            </p>
          ) : null}
        </div>
      </div>
    )
  }
)

InputField.displayName = 'InputField'
