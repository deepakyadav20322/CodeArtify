'use client'

import { useRef, useEffect, useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'
import { ExportMenu } from './ExportMenu'
import Editor from 'react-simple-code-editor'
import Prism from 'prismjs'
import 'prismjs/components/prism-javascript'
import 'prismjs/themes/prism-tomorrow.css'

interface CodeSnippetProps {
  code: string
  setCode: (code: string) => void
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
  title,
}: CodeSnippetProps) {
  const [width, setWidth] = useState(500)
  const [height, setHeight] = useState(200)
  const [isDragging, setIsDragging] = useState(false)
  const [dragSide, setDragSide] = useState<'left' | 'right' | null>(null)
  const editorRef = useRef<any>(null)

  const getBackgroundStyle = () => {
    if (background.type === 'gradient') {
      const [color1, color2] = background.value.split(',')
      return { background: `linear-gradient(to right, ${color1}, ${color2})` }
    }
    return { backgroundColor: background.value }
  }

  const startResize = useCallback((e: React.MouseEvent, side: 'left' | 'right') => {
    e.preventDefault()
    setIsDragging(true)
    setDragSide(side)
    const startX = e.clientX
    const startWidth = width

    const handleMouseMove = (e: MouseEvent) => {
      requestAnimationFrame(() => {
        const newWidth = side === 'left'
          ? Math.max(500, startWidth - (e.clientX - startX))
          : Math.max(500, startWidth + (e.clientX - startX))
        setWidth(newWidth)
      })
    }

    const handleMouseUp = () => {
      setIsDragging(false)
      setDragSide(null)
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }, [width])

  useEffect(() => {
    if (editorRef.current) {
      const updateHeight = () => {
        const contentHeight = Math.min(1000, Math.max(200, editorRef.current.clientHeight))
        setHeight(contentHeight)
      }
      updateHeight()
    }
  }, [code])

  return (
    <div className="flex flex-col items-center relative min-h-36 h-full w-full">
      <div
        className={`code-snippet-container overflow-x-visible shadow-2xl transition-all duration-300 ease-in-out relative ${
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
            <div className="text-zinc-400 text-sm flex-grow text-center">
              {title || 'My Image'}
            </div>
            <div className="w-16"></div>
          </div>
          <div style={{ padding: `${padding}px` }}>
            <Editor
              value={code}
              onValueChange={(value) => setCode(value)}
              highlight={(code) => Prism.highlight(code, Prism.languages.javascript, 'javascript')}
              padding={10}
              style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: 14,
                backgroundColor: '#1E1E1E',
                color: '#d4d4d4',
                minHeight: '200px',
                maxHeight: '500px',
                overflowY: 'visible',
              }}
              ref={editorRef}
            />
          </div>
        </div>
      </div>
      <div className="flex items-center mt-4 space-x-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setWidth(500)}
          className="text-zinc-400 hover:text-white"
        >
          <X className="h-4 w-4 mr-2" />
          Set to auto width
        </Button>
        <ExportMenu code={code} language={language} title={title} />
      </div>
    </div>
  )
}
