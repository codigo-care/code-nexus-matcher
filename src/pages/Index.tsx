
import React, { useState } from 'react';
import CodeInput from '@/components/CodeInput';
import ResultsDisplay from '@/components/ResultsDisplay';
import { Button } from '@/components/ui/button';
import { FileText, Zap, Shield } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface CodeMatch {
  cptCode: string;
  cptDescription: string;
  matchedIcdCodes: Array<{
    code: string;
    description: string;
  }>;
  hasMatches: boolean;
  suggestedIcdCodes?: Array<{
    code: string;
    description: string;
    confidence: number;
  }>;
}

const Index = () => {
  const [codes, setCodes] = useState<{ icd: string[]; cpt: string[]; invalid: string[] }>({
    icd: [],
    cpt: [],
    invalid: []
  });
  const [results, setResults] = useState<CodeMatch[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Mock API call - replace with your actual Django API
  const processCodeMatching = async (icdCodes: string[], cptCodes: string[]) => {
    setIsLoading(true);
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock results - replace with actual API call
      const mockResults: CodeMatch[] = cptCodes.map((cptCode, index) => {
        const hasMatches = Math.random() > 0.3; // 70% chance of having matches
        
        return {
          cptCode,
          cptDescription: `Procedure Description for ${cptCode}`,
          matchedIcdCodes: hasMatches ? icdCodes.slice(0, Math.floor(Math.random() * 3) + 1).map(icd => ({
            code: icd,
            description: `Diagnosis description for ${icd}`
          })) : [],
          hasMatches,
          suggestedIcdCodes: !hasMatches ? [
            { code: 'M79.3', description: 'Panniculitis, unspecified', confidence: 85 },
            { code: 'R51.9', description: 'Headache, unspecified', confidence: 72 }
          ] : undefined
        };
      });
      
      setResults(mockResults);
      
      const matchedCount = mockResults.filter(r => r.hasMatches).length;
      const unmatchedCount = mockResults.filter(r => !r.hasMatches).length;
      
      toast({
        title: "Code matching complete!",
        description: `${matchedCount} CPT codes matched, ${unmatchedCount} need attention.`,
      });
      
    } catch (error) {
      console.error('Error processing codes:', error);
      toast({
        title: "Error processing codes",
        description: "Please try again or contact support if the issue persists.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCodesDetected = (detectedCodes: { icd: string[]; cpt: string[]; invalid: string[] }) => {
    setCodes(detectedCodes);
    
    // Auto-process if we have both ICD and CPT codes
    if (detectedCodes.icd.length > 0 && detectedCodes.cpt.length > 0) {
      processCodeMatching(detectedCodes.icd, detectedCodes.cpt);
    } else if (detectedCodes.cpt.length === 0 && detectedCodes.icd.length === 0) {
      setResults([]);
    }
  };

  const handleManualProcess = () => {
    if (codes.icd.length > 0 && codes.cpt.length > 0) {
      processCodeMatching(codes.icd, codes.cpt);
    } else {
      toast({
        title: "Missing codes",
        description: "Please enter both ICD-10 and CPT codes to process matches.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-muted">
      {/* Header */}
      <div className="bg-white border-b border-muted shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-primary mb-2">
              Codigo Medical Code Matcher
            </h1>
            <p className="text-xl text-muted-foreground mb-6">
              Intelligent ICD-10 and CPT code pairing for accurate medical billing
            </p>
            
            <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-secondary" />
                <span>Real-time validation</span>
              </div>
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-secondary" />
                <span>Smart code detection</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-secondary" />
                <span>HIPAA compliant</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">
        <CodeInput onCodesDetected={handleCodesDetected} />
        
        {/* Manual Process Button */}
        {codes.icd.length > 0 && codes.cpt.length > 0 && !isLoading && (
          <div className="text-center animate-fade-in">
            <Button
              onClick={handleManualProcess}
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 text-lg"
            >
              Process Code Matches
            </Button>
          </div>
        )}

        <ResultsDisplay 
          results={results} 
          isLoading={isLoading}
          onRetry={handleManualProcess}
        />
      </div>

      {/* Footer */}
      <div className="bg-white border-t border-muted mt-16">
        <div className="max-w-6xl mx-auto px-6 py-6 text-center text-sm text-muted-foreground">
          <p>© 2025 Codigo Medical. Advanced medical coding solutions.</p>
        </div>
      </div>
    </div>
  );
};

export default Index;
