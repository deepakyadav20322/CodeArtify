import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const languages = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'python', label: 'Python' },
  { value: 'java', label: 'Java' },
  { value: 'csharp', label: 'C#' },
  { value: 'cpp', label: 'C++' },
]

interface LanguageSelectorProps {
  language: string;
  setLanguage: (language: string) => void;
}

export function LanguageSelector({ language, setLanguage }: LanguageSelectorProps) {
  return (
    <Select value={language} onValueChange={setLanguage}>
      <SelectTrigger className="w-[180px] bg-zinc-800 border-zinc-700 text-zinc-300">
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
  )
}

