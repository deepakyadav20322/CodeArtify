'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import Sidebar from '../components/Sidebar'

const CodeSnippet = dynamic(() => import('../components/CodeSnippet'), { ssr: false })

export default function Home() {
  const [background, setBackground] = useState({ type: 'gradient', value: '#3F37C9,#4CC9F0' })
  const [padding, setPadding] = useState(16)
  const [borderRadius, setBorderRadius] = useState(8)
  const [inset, setInset] = useState(8)
  const [code, setCode] = useState("It is editable")
  const [language, setLanguage] = useState('javascript')
  const [title, setTitle] = useState('')

  return (
    <div className="flex h-screen bg-[#111111]">
      <Sidebar
        background={background}
        setBackground={setBackground}
        padding={padding}
        setPadding={setPadding}
        borderRadius={borderRadius}
        setBorderRadius={setBorderRadius}
        inset={inset}
        setInset={setInset}
        title={title}
        setTitle={setTitle}
        language={language}
        setLanguage={setLanguage}
      />
      <main className="flex-1 p-4 flex flex-col items-center justify-center overflow-y-auto">
        <CodeSnippet
          code={code}
          setCode={setCode}
          background={background}
          padding={padding}
          borderRadius={borderRadius}
          inset={inset}
          language={language}
          title={title}
        />
      </main>
    </div>
  )
}

