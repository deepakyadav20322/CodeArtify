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
  const [code, setCode] = useState({ title: '', content: 'It is editable' }) // Updated
  const [language, setLanguage] = useState('javascript')

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
        title={code.title} // Use code.title
        setTitle={(title) => setCode({ ...code, title })} // Update title in code object
        language={language}
        setLanguage={setLanguage}
      />
      <main className="flex-1 p-4 flex flex-col items-center justify-center overflow-y-auto">
        <CodeSnippet
          code={code} // Pass entire code object
          setCode={setCode} // Function to update code
          background={background}
          padding={padding}
          borderRadius={borderRadius}
          inset={inset}
          language={language}
          title={code.title} // Use code.title
        />
      </main>
    </div>
  )
}
