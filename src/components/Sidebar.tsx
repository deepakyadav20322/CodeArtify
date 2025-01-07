'use client'

import React, { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Slider } from '@/components/ui/slider'
import { Button } from '@/components/ui/button'
import { RotateCcw, Search } from 'lucide-react'
import { HexColorPicker } from "react-colorful"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface SidebarProps {
  background: { type: string; value: string }
  setBackground: (background: { type: string; value: string }) => void
  padding: number
  setPadding: (padding: number) => void
  borderRadius: number
  setBorderRadius: (borderRadius: number) => void
  inset: number
  setInset: (inset: number) => void
  title: string
  setTitle: (title: string) => void
  language: string
  setLanguage: (language: string) => void
}

const languages = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'python', label: 'Python' },
  { value: 'java', label: 'Java' },
  { value: 'csharp', label: 'C#' },
  { value: 'cpp', label: 'C++' },
  { value: 'go', label: 'Go' },
  { value: 'rust', label: 'Rust' },
  { value: 'ruby', label: 'Ruby' },
  { value: 'php', label: 'PHP' },
]

const gradientPresets = [
  '#FF6B6B,#FFE66D', '#FF9A9E,#FAD0C4', '#A18CD1,#FBC2EB', '#FF9A9E,#FECFEF', '#85FFBD,#FFFB7D',
  '#FF758C,#FF7EB3', '#08AEEA,#2AF598', '#FEE140,#FA709A', '#4CC9F0,#4361EE', '#FF9A8B,#FF6A88',
  '#F83600,#F9D423', '#00DBDE,#FC00FF', '#0093E9,#80D0C7', '#FBDA61,#FF5ACD', '#48C6EF,#6F86D6',
  '#FA8BFF,#2BD2FF', '#2BFF88,#2BD2FF', '#FF9A8B,#FF6A88', '#85FFBD,#FFFB7D', '#FA8BFF,#2BD2FF'
]

export default function Sidebar({
  background,
  setBackground,
  padding,
  setPadding,
  borderRadius,
  setBorderRadius,
  inset,
  setInset,
  title,
  setTitle,
  language,
  setLanguage,
}: SidebarProps) {
  const [backgroundType, setBackgroundType] = useState('gradient')
  const [gradientColor1, setGradientColor1] = useState('#3F37C9')
  const [gradientColor2, setGradientColor2] = useState('#4CC9F0')

  useEffect(() => {
    if (backgroundType === 'gradient') {
      setBackground({ type: 'gradient', value: `${gradientColor1},${gradientColor2}` })
    }
  }, [backgroundType, gradientColor1, gradientColor2])

  return (
    <div className="w-80 bg-[#111111] text-white p-4 h-screen overflow-y-auto border-r border-zinc-800">
      <h2 className="text-lg font-semibold mb-4">Background</h2>
      
      <div className="space-y-6">
        <div className="space-y-4">
          <div>
            <label className="text-sm text-zinc-400 mb-2 block">Title</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Untitled"
              className="bg-zinc-900 border-zinc-800 text-white h-10"
            />
          </div>

          <div>
            <label className="text-sm text-zinc-400 mb-2 block">Language</label>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className="w-full bg-zinc-900 border-zinc-800 text-white h-10">
                <SelectValue placeholder="Select Language" />
              </SelectTrigger>
              <SelectContent>
                {languages.map((lang) => (
                  <SelectItem key={lang.value} value={lang.value}>
                    {lang.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
          <Input
            type="text"
            placeholder="Type to search..."
            className="pl-9 bg-zinc-900 border-zinc-800 text-white h-10"
          />
        </div>

        <Tabs defaultValue="gradient" className="w-full">
          <TabsList className="w-full grid grid-cols-3 gap-1 bg-zinc-900 p-1 h-10">
            <TabsTrigger 
              value="gradient" 
              className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
            >
              Gradient
            </TabsTrigger>
            <TabsTrigger 
              value="color"
              className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
            >
              Color
            </TabsTrigger>
            <TabsTrigger 
              value="image"
              className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
            >
              Image
            </TabsTrigger>
          </TabsList>

          <TabsContent value="gradient" className="space-y-6 mt-6">
            <div>
              <h3 className="text-sm text-zinc-400 mb-3">Background Gradient</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div 
                    className="w-full h-12 rounded-md mb-2" 
                    style={{ backgroundColor: gradientColor1 }}
                  />
                  <div className="text-xs text-zinc-400 mb-2">{gradientColor1}</div>
                  <HexColorPicker 
                    color={gradientColor1} 
                    onChange={setGradientColor1}
                    className="w-full max-w-[140px]" 
                  />
                </div>
                <div>
                  <div 
                    className="w-full h-12 rounded-md mb-2" 
                    style={{ backgroundColor: gradientColor2 }}
                  />
                  <div className="text-xs text-zinc-400 mb-2">{gradientColor2}</div>
                  <HexColorPicker 
                    color={gradientColor2} 
                    onChange={setGradientColor2}
                    className="w-full max-w-[140px]" 
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm text-zinc-400 mb-3">Gradient presets</h3>
              <div className="grid grid-cols-5 gap-2">
                {gradientPresets.map((preset, index) => {
                  const [color1, color2] = preset.split(',')
                  return (
                    <button
                      key={index}
                      className="w-full aspect-square rounded-md hover:ring-2 hover:ring-purple-500 transition-all"
                      style={{ background: `linear-gradient(to right, ${color1}, ${color2})` }}
                      onClick={() => {
                        setGradientColor1(color1)
                        setGradientColor2(color2)
                      }}
                    />
                  )
                })}
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm text-zinc-400">Padding</label>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setPadding(16)}
                className="h-6 text-xs text-zinc-400 hover:text-white"
              >
                <RotateCcw className="mr-1 h-3 w-3" />
                Reset
              </Button>
            </div>
            <Slider
              value={[padding]}
              onValueChange={(value) => setPadding(value[0])}
              min={0}
              max={64}
              step={1}
              className="[&_[role=slider]]:bg-purple-600"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm text-zinc-400">Rounded corners</label>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setBorderRadius(8)}
                className="h-6 text-xs text-zinc-400 hover:text-white"
              >
                <RotateCcw className="mr-1 h-3 w-3" />
                Reset
              </Button>
            </div>
            <Slider
              value={[borderRadius]}
              onValueChange={(value) => setBorderRadius(value[0])}
              min={0}
              max={32}
              step={1}
              className="[&_[role=slider]]:bg-purple-600"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm text-zinc-400">Inset</label>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setInset(8)}
                className="h-6 text-xs text-zinc-400 hover:text-white"
              >
                <RotateCcw className="mr-1 h-3 w-3" />
                Reset
              </Button>
            </div>
            <Slider
              value={[inset]}
              onValueChange={(value) => setInset(Math.max(8, value[0]))}
              min={8}
              max={48}
              step={1}
              className="[&_[role=slider]]:bg-purple-600"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

