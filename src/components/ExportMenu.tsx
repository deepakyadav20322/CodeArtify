'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Download } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import html2canvas from 'html2canvas'

interface ExportMenuProps {
  code: string
  language: string
  title: string
}

export function ExportMenu({ code, language, title }: ExportMenuProps) {
  const [exporting, setExporting] = useState(false)

  const exportAs = async (format: 'png' | 'jpeg' | 'svg') => {
    setExporting(true)
    const element = document.querySelector('.code-snippet-container')
    if (!element) {
      setExporting(false)
      return
    }

    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        backgroundColor: null,
      })

      let dataUrl: string
      let filename: string

      switch (format) {
        case 'png':
          dataUrl = canvas.toDataURL('image/png')
          filename = `${title || 'untitled'}.png`
          break
        case 'jpeg':
          dataUrl = canvas.toDataURL('image/jpeg')
          filename = `${title || 'untitled'}.jpg`
          break
        case 'svg':
          const svgData = `
            <svg xmlns="http://www.w3.org/2000/svg" width="${canvas.width}" height="${canvas.height}">
              <foreignObject width="100%" height="100%">
                <div xmlns="http://www.w3.org/1999/xhtml">
                  ${element.outerHTML}
                </div>
              </foreignObject>
            </svg>
          `
          dataUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgData)}`
          filename = `${title || 'untitled'}.svg`
          break
      }

      const link = document.createElement('a')
      link.href = dataUrl
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {
      console.error('Export failed:', error)
    } finally {
      setExporting(false)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          disabled={exporting}
          className="text-zinc-400 hover:text-white"
        >
          <Download className="h-4 w-4 mr-2" />
          {exporting ? 'Exporting...' : 'Export Image'}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={() => exportAs('png')} className="cursor-pointer">
          Export as PNG
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => exportAs('jpeg')} className="cursor-pointer">
          Export as JPEG
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => exportAs('svg')} className="cursor-pointer">
          Export as SVG
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

