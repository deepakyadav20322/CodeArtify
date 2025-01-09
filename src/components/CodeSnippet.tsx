'use client'

import { useRef, useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'
import Editor from 'react-simple-code-editor'
import Prism from 'prismjs'
import 'prismjs/components/prism-javascript'
import 'prismjs/themes/prism-tomorrow.css'

interface CodeSnippetProps {
  code: { title: string; content: string }
  setCode: (code: { title: string; content: string }) => void
  background: { type: string; value: string }
  padding: number
  borderRadius: number
  inset: number
  language: string
  title: string
}

export default function CodeSnippet({
  code,
  setCode,
  background,
  padding,
  borderRadius,
  inset,
  language,
}: CodeSnippetProps) {
  const [width, setWidth] = useState(512) // Use a numeric value for width
  const [isDragging, setIsDragging] = useState(false)
  const [dragSide, setDragSide] = useState<'left' | 'right' | null>(null)
  const editorRef = useRef<HTMLDivElement | null>(null)

  const getBackgroundStyle = () => {
    if (background.type === 'gradient') {
      const [color1, color2] = background.value.split(',')
      return { background: `linear-gradient(to right, ${color1}, ${color2})` }
    }
    return { backgroundColor: background.value }
  }

  const [isResizing, setIsResizing] = useState(false) // New state to track resizing

  const startResize = useCallback((e: React.MouseEvent, side: 'left' | 'right') => {
    e.preventDefault()
    setIsDragging(true)
    setIsResizing(true) // Set resizing to true
    setDragSide(side)
    const startX = e.clientX
    const startWidth = editorRef.current?.offsetWidth || width
  
    const handleMouseMove = (e: MouseEvent) => {
      requestAnimationFrame(() => {
        const newWidth = side === 'left' 
          ? Math.max(300, startWidth - (e.clientX - startX)) 
          : Math.max(300, startWidth + (e.clientX - startX))
        setWidth(newWidth)
      })
    }
  
    const handleMouseUp = () => {
      setIsDragging(false)
      setIsResizing(false) // Reset resizing to false
      setDragSide(null)
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }, [width])
  return (
    <div className="flex flex-col items-center relative min-h-36 h-full w-full">
      <div
        ref={editorRef}
        className={`code-snippet-container overflow-x-visible shadow-2xl  ease-in-out relative ${
          isDragging ? 'select-none' : ''
        }`}
        style={{
          ...getBackgroundStyle(),
          borderRadius: `${borderRadius}px`,
          width: `${width}px`,
          padding: `${inset}px`,
        }}
      >
        <div
          className="absolute left-0 top-0 w-1 h-full cursor-ew-resize hover:bg-purple-500/20"
          onMouseDown={(e) => startResize(e, 'left')}
          style={{ backgroundColor: dragSide === 'left' ? 'rgba(168, 85, 247, 0.2)' : 'transparent' }}
        />
        <div
          className="absolute right-0 top-0 w-1 h-full cursor-ew-resize hover:bg-purple-500/20"
          onMouseDown={(e) => startResize(e, 'right')}
          style={{ backgroundColor: dragSide === 'right' ? 'rgba(168, 85, 247, 0.2)' : 'transparent' }}
        />

        <div className="rounded-lg overflow-hidden bg-[#1E1E1E]">
          <div className="flex items-center justify-between px-4 py-2 bg-[#252526]">
            <div className="flex space-x-2">
              <div className="w-3 h-3 rounded-full bg-[#FF5F57]"></div>
              <div className="w-3 h-3 rounded-full bg-[#FFBD2E]"></div>
              <div className="w-3 h-3 rounded-full bg-[#28C840]"></div>
            </div>
            <div className="text-zinc-400 text-sm flex-grow text-center flex justify-center items-center ">
              <input
                type="text"
                value={code.title}
                onChange={(e) => setCode({ ...code, title: e.target.value })}
                placeholder="Snippet Title"
                className="text-zinc-400 text-sm bg-transparent focus:outline-none text-center"
              />
            </div>
            <div className="w-16"></div>
          </div>
          <div style={{ padding: `${padding}px` }}>
            <Editor
              value={code.content}
              onValueChange={(content) => setCode({ ...code, content })}
             highlight={(code) => Prism.highlight(code, Prism.languages[language] || Prism.languages.javascript, language)}
              padding={10}
              style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: 14,
                backgroundColor: '#1E1E1E',
                color: '#d4d4d4',
                minHeight: '200px',
                overflowY: 'visible',
              }}
            />
          </div>
        </div>
      </div>
      <div className="flex items-center mt-4 space-x-2">
      {isResizing ? ( // Conditionally render based on resizing state
    <div className="flex flex-col items-center">
    <span className="text-zinc-400 text-xs pt-2">Current Width: {width}px</span>
    <div style={{ position: 'relative', width: `${width}px`, marginTop: '4px' }}>
      <div
        style={{
          width: '100%', // Set the width of the line to the current width
          height: '1px', // Adjust the height of the line
          backgroundColor: '#A0AEC0', // Change this color as needed
        }}
      />
      {/* Left Arrow */}
      <span className='rotate-[-90deg]'
        style={{
          position: 'absolute',
          left: '-10px', // Adjust this value to position the left arrow
          top: '-2px', // Adjust this value to vertically align the arrow
          width: '0',
          height: '0',
          borderLeft: '5px solid transparent',
          borderRight: '5px solid transparent',
          borderBottom: '5px solid #A0AEC0', // Change this color as needed
        }}
      />
      {/* Right Arrow */}
      <span className='rotate-[90deg]'
        style={{
          position: 'absolute',
          right: '-10px', // Adjust this value to position the right arrow
          top: '-2px', // Adjust this value to vertically align the arrow
          width: '0',
          height: '0',
          borderLeft: '5px solid transparent',
          borderRight: '5px solid transparent',
          borderBottom: '5px solid #A0AEC0', // Change this color as needed
        }}
      />
    </div>
  </div>
      ) : (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setWidth(512)} // Reset to default numeric width
          className="text-zinc-400 hover:text-white hover:bg-inherit"
        >
          Reset Width
        </Button>
      )}
      </div>
    </div>
  )
}
