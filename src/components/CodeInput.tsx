
import React, { useState, useCallback } from 'react';
import { Search, FileText, AlertCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

interface CodeInputProps {
  onCodesDetected: (codes: { icd: string[]; cpt: string[]; invalid: string[] }) => void;
}

const CodeInput: React.FC<CodeInputProps> = ({ onCodesDetected }) => {
  const [inputValue, setInputValue] = useState('');
  const [detectedCodes, setDetectedCodes] = useState<{
    icd: string[];
    cpt: string[];
    invalid: string[];
  }>({ icd: [], cpt: [], invalid: [] });

  const detectCodeType = (code: string): 'icd' | 'cpt' | 'invalid' => {
    const cleanCode = code.trim().toUpperCase();
    
    // ICD-10-CM pattern: Letter + digits + optional decimal + digits/letters
    const icdPattern = /^[A-Z]\d{2}(\.\d{1,4}[A-Z]?)?$/;
    
    // CPT pattern: 5 digits
    const cptPattern = /^\d{5}$/;
    
    if (icdPattern.test(cleanCode)) return 'icd';
    if (cptPattern.test(cleanCode)) return 'cpt';
    return 'invalid';
  };

  const parseInput = useCallback((text: string) => {
    // Split by common delimiters and filter out empty strings
    const potentialCodes = text
      .split(/[\s,;\n\t]+/)
      .map(code => code.trim())
      .filter(code => code.length > 0);

    const codes = { icd: [] as string[], cpt: [] as string[], invalid: [] as string[] };

    potentialCodes.forEach(code => {
      const type = detectCodeType(code);
      codes[type].push(code.toUpperCase());
    });

    // Remove duplicates
    codes.icd = [...new Set(codes.icd)];
    codes.cpt = [...new Set(codes.cpt)];
    codes.invalid = [...new Set(codes.invalid)];

    return codes;
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);

    if (value.trim()) {
      const codes = parseInput(value);
      setDetectedCodes(codes);
      onCodesDetected(codes);
    } else {
      setDetectedCodes({ icd: [], cpt: [], invalid: [] });
      onCodesDetected({ icd: [], cpt: [], invalid: [] });
    }
  };

  const clearInput = () => {
    setInputValue('');
    setDetectedCodes({ icd: [], cpt: [], invalid: [] });
    onCodesDetected({ icd: [], cpt: [], invalid: [] });
  };

  const totalCodes = detectedCodes.icd.length + detectedCodes.cpt.length + detectedCodes.invalid.length;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
        <Input
          value={inputValue}
          onChange={handleInputChange}
          placeholder="Paste or type ICD-10 and CPT codes... (separate with spaces, commas, or new lines)"
          className="pl-12 pr-4 py-6 text-lg bg-white border-2 border-muted focus:border-primary transition-all duration-200 shadow-sm hover:shadow-md"
        />
        {inputValue && (
          <button
            onClick={clearInput}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            ✕
          </button>
        )}
      </div>

      {totalCodes > 0 && (
        <div className="animate-fade-in bg-white rounded-lg p-4 shadow-sm border border-muted">
          <div className="flex items-center gap-2 mb-3">
            <FileText className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-muted-foreground">
              Detected Codes ({totalCodes})
            </span>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {detectedCodes.icd.map((code, index) => (
              <Badge
                key={`icd-${index}`}
                variant="secondary"
                className="bg-secondary/20 text-secondary hover:bg-secondary/30 transition-colors"
              >
                ICD: {code}
              </Badge>
            ))}
            
            {detectedCodes.cpt.map((code, index) => (
              <Badge
                key={`cpt-${index}`}
                variant="default"
                className="bg-primary/20 text-primary hover:bg-primary/30 transition-colors"
              >
                CPT: {code}
              </Badge>
            ))}
            
            {detectedCodes.invalid.map((code, index) => (
              <Badge
                key={`invalid-${index}`}
                variant="destructive"
                className="bg-destructive/20 text-destructive hover:bg-destructive/30 transition-colors"
              >
                <AlertCircle className="h-3 w-3 mr-1" />
                {code}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CodeInput;
