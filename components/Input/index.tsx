import { type KeyboardEvent, useRef } from 'react'

interface InputProps {
  onSubmit: (value: string) => void
  loading?: boolean
}

export default function Input(props: InputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const onSubmit = () => {
    const text = textareaRef.current!.value
    if (!text) {
      return
    }
    if (typeof props.onSubmit === 'function') {
      props.onSubmit(text)
      textareaRef.current!.value = ''
      textareaRef.current!.style.height = 'auto'
    }
  }

  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.shiftKey || props.loading) { return }
    if (e.key === 'Enter') {
      onSubmit()
      e.preventDefault()
    }
  }

  const onInput = () => {
    textareaRef.current!.style.height = 'auto'
    textareaRef.current!.style.height = `${textareaRef.current!.scrollHeight}px`
  }

  return <div className="absolute bottom-0 left-0 w-full bg-theme p-2">
    <form className="mx-auto max-w-3xl">
      <div className="relative flex items-center bg-white dark:bg-gray-700 rounded-md py-2 pl-4 shadow-[0_0_10px_rgba(0,0,0,0.10)] dark:shadow-[0_0_15px_rgba(0,0,0,0.10)] border border-black/10 dark:border-gray-900/50">
        <textarea onKeyDown={onKeyDown} onInput={onInput} className="w-full resize-none bg-transparent outline-0 max-h-36 pr-7" rows={1} ref={textareaRef}/>
        <button className="absolute p-1 rounded-md bottom-1.5 right-1" type="button" onClick={onSubmit}>
          {props.loading
            ? <svg viewBox="0 0 50 50" width="20px" height="20px">
              <circle cx="25" cy="25" r="20" fill="none" stroke="#000" strokeWidth="4">
                <animate attributeName="stroke-dashoffset" dur="2s" from="0" to="125" repeatCount="indefinite" />
                <animate attributeName="stroke-dasharray" dur="2s" values="0 20;20 0;0 20;" repeatCount="indefinite" />
              </circle>
            </svg>
            : <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1.20308 1.04312C1.00481 0.954998 0.772341 1.0048 0.627577 1.16641C0.482813 1.32802 0.458794 1.56455 0.568117 1.75196L3.92115 7.50002L0.568117 13.2481C0.458794 13.4355 0.482813 13.672 0.627577 13.8336C0.772341 13.9952 1.00481 14.045 1.20308 13.9569L14.7031 7.95693C14.8836 7.87668 15 7.69762 15 7.50002C15 7.30243 14.8836 7.12337 14.7031 7.04312L1.20308 1.04312ZM4.84553 7.10002L2.21234 2.586L13.2689 7.50002L2.21234 12.414L4.84552 7.90002H9C9.22092 7.90002 9.4 7.72094 9.4 7.50002C9.4 7.27911 9.22092 7.10002 9 7.10002H4.84553Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
            </svg>}
        </button>
      </div>
    </form>
  </div>
}
