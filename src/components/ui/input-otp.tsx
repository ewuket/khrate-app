
import * as React from "react"
import { DashIcon } from "@radix-ui/react-icons"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const inputOTPVariants = cva(
  "inline-flex h-9 w-full items-center justify-center rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "",
        outline: "",
        ghost: "",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

interface InputOTPSlotProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof inputOTPVariants> {
  index: number
  char?: string
}

const InputOTPSlot = React.forwardRef<HTMLInputElement, InputOTPSlotProps>(
  ({ className, index, char, variant, ...props }, ref) => {
    const [hasFakeCaret, setHasFakeCaret] = React.useState(false)

    return (
      <div className="relative flex-1">
        <input
          ref={ref}
          className={cn(
            inputOTPVariants({ variant }),
            "absolute inset-0 h-full w-full text-center opacity-0",
            className
          )}
          {...props}
        />
        <div
          className={cn(
            inputOTPVariants({ variant }),
            "pointer-events-none flex items-center justify-center",
            hasFakeCaret && "caret"
          )}
        >
          {char && char !== " " ? char : (
            <DashIcon className="h-4 w-4 text-muted-foreground" />
          )}
        </div>
      </div>
    )
  }
)
InputOTPSlot.displayName = "InputOTPSlot"

// Fix the onChange type issue by using a different interface that doesn't extend HTMLInputElement
interface InputOTPGroupProps extends VariantProps<typeof inputOTPVariants> {
  value?: string
  onChange?: (value: string) => void
  maxLength?: number
  containerClassName?: string
  groupClassName?: string
  slotClassName?: string
  className?: string
  disabled?: boolean
  autoFocus?: boolean
  name?: string
  id?: string
  autoComplete?: string
  placeholder?: string
}

const InputOTPGroup = React.forwardRef<HTMLInputElement, InputOTPGroupProps>(
  (
    {
      className,
      value = "",
      onChange,
      maxLength = 6,
      variant,
      containerClassName,
      groupClassName,
      slotClassName,
      ...props
    },
    ref
  ) => {
    const [inputValue, setInputValue] = React.useState(value)
    const [focusedIndex, setFocusedIndex] = React.useState(-1)
    const [activeIndex, setActiveIndex] = React.useState(-1)
    const inputRefs = React.useRef<Array<React.RefObject<HTMLInputElement>>>(
      Array.from({ length: maxLength }, () => React.createRef())
    )

    const handleInputChange = (index: number, newValue: string) => {
      let newInputValue = inputValue || ""
      if (newInputValue.length <= index) {
        newInputValue = newInputValue.padEnd(index, " ")
      }

      const chars = newInputValue.split("")
      chars[index] = newValue.charAt(0) || " "
      newInputValue = chars.join("")

      if (onChange) {
        onChange(newInputValue.trim())
      }
      setInputValue(newInputValue)
    }

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault()
        setActiveIndex(Math.max(0, index - 1))
        inputRefs.current[Math.max(0, index - 1)]?.current?.focus()
      } else if (e.key === "ArrowRight") {
        e.preventDefault()
        setActiveIndex(Math.min(maxLength - 1, index + 1))
        inputRefs.current[Math.min(maxLength - 1, index + 1)]?.current?.focus()
      } else if (e.key === "Delete") {
        e.preventDefault()
        handleInputChange(index, " ")
        if (index < maxLength - 1) {
          setActiveIndex(index + 1)
          inputRefs.current[index + 1]?.current?.focus()
        }
      } else if (e.key === "Backspace") {
        e.preventDefault()
        handleInputChange(index, " ")
        if (index > 0) {
          setActiveIndex(index - 1)
          inputRefs.current[index - 1]?.current?.focus()
        }
      }
    }

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
      e.preventDefault()
      const pasteData = e.clipboardData.getData("text/plain").trim()
      
      if (!pasteData) return
      
      const chars = pasteData.slice(0, maxLength).split("")
      
      let newInputValue = inputValue || ""
      newInputValue = newInputValue.padEnd(maxLength, " ")
      
      const newChars = newInputValue.split("")
      chars.forEach((char, i) => {
        if (i < maxLength) {
          newChars[i] = char
        }
      })
      
      const newValue = newChars.join("").slice(0, maxLength)
      
      if (onChange) {
        onChange(newValue.trim())
      }
      setInputValue(newValue)
      
      const focusIndex = Math.min(maxLength - 1, pasteData.length)
      setActiveIndex(focusIndex)
      inputRefs.current[focusIndex]?.current?.focus()
    }

    React.useEffect(() => {
      if (activeIndex >= 0 && activeIndex < maxLength) {
        inputRefs.current[activeIndex]?.current?.focus()
      }
    }, [activeIndex, maxLength])

    React.useEffect(() => {
      setInputValue(value)
    }, [value])

    return (
      <div className={cn("w-full", containerClassName)}>
        <div
          role="group"
          className={cn("flex w-full items-center gap-2", groupClassName)}
        >
          {Array.from({ length: maxLength }).map((_, index) => {
            const char = inputValue ? inputValue[index] : undefined;
            
            return (
              <InputOTPSlot
                key={index}
                ref={inputRefs.current[index]}
                variant={variant}
                index={index}
                char={char}
                className={cn(
                  "rounded-md text-center transition-all",
                  slotClassName
                )}
                onClick={() => {
                  setActiveIndex(index)
                  inputRefs.current[index]?.current?.focus()
                }}
                onFocus={() => setFocusedIndex(index)}
                onBlur={() => setFocusedIndex(-1)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onChange={(e) =>
                  handleInputChange(index, e.target.value.charAt(0))
                }
                onPaste={index === 0 ? handlePaste : undefined}
                inputMode="text"
                autoComplete="one-time-code"
                disabled={props.disabled}
              />
            )
          })}
        </div>
      </div>
    )
  }
)
InputOTPGroup.displayName = "InputOTPGroup"

interface InputOTPProps extends InputOTPGroupProps {}

const InputOTP = React.forwardRef<HTMLInputElement, InputOTPProps>(
  ({ className, ...props }, ref) => (
    <div className={cn("w-full", className)}>
      <InputOTPGroup ref={ref} {...props} />
    </div>
  )
)
InputOTP.displayName = "InputOTP"

export { InputOTP, InputOTPGroup, InputOTPSlot }
