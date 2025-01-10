import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Loader2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import html2canvas from 'html2canvas';
import { useToast } from '@/hooks/use-toast';

type ExportFormat = 'png' | 'jpeg' ;

interface ExportMenuProps {
  code: string;
  language: string;
  title: string;
  containerSelector?: string; // Allow custom selector
}

export function ExportMenu({
  code,
  language,
  title,
  containerSelector = '.code-snippet-container',
}: ExportMenuProps) {
  const [exporting, setExporting] = useState<ExportFormat | null>(null);
  const { toast } = useToast();

  const sanitizeFilename = (name: string): string => {
    return name.replace(/[^a-z0-9]/gi, '-').toLowerCase() || 'untitled';
  };

  const downloadFile = (dataUrl: string, filename: string) => {
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = sanitizeFilename(filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const createSvgExport = (width: number, height: number): string => {
    const escapedCode = code
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');

    return `
      <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
        <style>
          .code-container { font-family: 'JetBrains Mono', monospace; }
          .code-content { margin: 0; padding: 16px; background: #1E1E1E; color: #d4d4d4; }
        </style>
        <foreignObject width="100%" height="100%">
          <div xmlns="http://www.w3.org/1999/xhtml" class="code-container">
            <pre class="code-content"><code class="language-${language}">${escapedCode}</code></pre>
          </div>
        </foreignObject>
      </svg>
    `;
  };

  const exportAs = async (format: ExportFormat) => {
    if (exporting) return;

    setExporting(format);
    const element = document.querySelector(containerSelector);

    if (!element) {
      toast({
        title: 'Export Failed',
        description: 'Could not find the code container element.',
        variant: 'destructive',
      });
      setExporting(null);
      return;
    }

    try {
      const canvas = await html2canvas(element as HTMLElement, {
        scale: 2,
        backgroundColor: format === 'jpeg' ? '#1E1E1E' : null,
        logging: false,
        useCORS: true,
      });

      let dataUrl: string;
      let filename = `${title}-${language}`;

      switch (format) {
        case 'png':
          dataUrl = canvas.toDataURL('image/png');
          filename += '.png';
          break;
        case 'jpeg':
          dataUrl = canvas.toDataURL('image/jpeg', 0.92);
          filename += '.jpg';
          break;
        // case 'svg':
        //   const svgData = createSvgExport(canvas.width, canvas.height);
        //   dataUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgData)}`;
        //   filename += '.svg';
        //   break;
      }

      downloadFile(dataUrl, filename);
      toast({
        title: 'Export Successful',
        description: `Your code has been exported as ${format.toUpperCase()}`,
      });
    } catch (error) {
      console.error('Export failed:', error);
      toast({
        title: 'Export Failed',
        description: 'An error occurred while exporting your code.',
        variant: 'destructive',
      });
    } finally {
      setExporting(null);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="secondary"
          size="sm"
          disabled={!!exporting}
          className="text-zinc-400 hover:text-white bg-black border border-gray-200 hover:bg-black"
          aria-label="Export code snippet"
        >
          {exporting ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Exporting...
            </>
          ) : (
            <>
              <Download className="h-4 w-4 mr-2" />
              Export Image
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {(['png', 'jpeg'] as const).map((format) => (
          <DropdownMenuItem
            key={format}
            onClick={() => exportAs(format)}
            disabled={!!exporting}
            className="cursor-pointer"
          >
            Export as {format.toUpperCase()}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
