
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertCircle, FileText, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';

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

interface ResultsDisplayProps {
  results: CodeMatch[];
  isLoading: boolean;
  onRetry?: () => void;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ results, isLoading, onRetry }) => {
  if (isLoading) {
    return (
      <div className="w-full max-w-4xl mx-auto space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse-subtle">
            <CardHeader>
              <div className="h-6 bg-muted rounded w-1/3"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="h-4 bg-muted rounded w-full"></div>
                <div className="h-4 bg-muted rounded w-2/3"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="w-full max-w-4xl mx-auto text-center py-12">
        <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-foreground mb-2">
          No results yet
        </h3>
        <p className="text-muted-foreground">
          Enter some ICD-10 and CPT codes above to see matching results
        </p>
      </div>
    );
  }

  const matchedCount = results.filter(r => r.hasMatches).length;
  const unmatchedCount = results.filter(r => !r.hasMatches).length;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="bg-white border-l-4 border-l-secondary">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total CPT Codes</p>
                <p className="text-2xl font-bold text-foreground">{results.length}</p>
              </div>
              <Activity className="h-8 w-8 text-secondary" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white border-l-4 border-l-secondary">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Matched</p>
                <p className="text-2xl font-bold text-secondary">{matchedCount}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-secondary" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white border-l-4 border-l-destructive">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Need Attention</p>
                <p className="text-2xl font-bold text-destructive">{unmatchedCount}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-destructive" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Results Cards */}
      <div className="space-y-4">
        {results.map((result, index) => (
          <Card
            key={result.cptCode}
            className={`animate-slide-up transition-all duration-200 hover:shadow-md ${
              result.hasMatches
                ? 'border-l-4 border-l-secondary bg-white'
                : 'border-l-4 border-l-destructive bg-destructive/5'
            }`}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Badge
                    variant={result.hasMatches ? "default" : "destructive"}
                    className={`${
                      result.hasMatches
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-destructive text-destructive-foreground'
                    }`}
                  >
                    CPT: {result.cptCode}
                  </Badge>
                  <span className="text-lg font-semibold text-foreground">
                    {result.cptDescription}
                  </span>
                </div>
                {result.hasMatches ? (
                  <CheckCircle className="h-5 w-5 text-secondary" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-destructive" />
                )}
              </CardTitle>
            </CardHeader>
            
            <CardContent>
              {result.hasMatches ? (
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-3">
                    Matched ICD Codes ({result.matchedIcdCodes.length})
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {result.matchedIcdCodes.map((icd, icdIndex) => (
                      <div
                        key={icd.code}
                        className="flex items-start gap-3 p-3 bg-secondary/10 rounded-lg border border-secondary/20"
                      >
                        <CheckCircle className="h-4 w-4 text-secondary mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-mono text-sm font-medium text-secondary">
                            {icd.code}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {icd.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 p-3 bg-destructive/10 rounded-lg border border-destructive/20">
                    <AlertCircle className="h-4 w-4 text-destructive" />
                    <p className="text-sm text-destructive font-medium">
                      No matching ICD codes found in your input list
                    </p>
                  </div>
                  
                  {result.suggestedIcdCodes && result.suggestedIcdCodes.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-2">
                        Suggested ICD codes for this procedure:
                      </p>
                      <div className="space-y-2">
                        {result.suggestedIcdCodes.map((suggestion, suggestionIndex) => (
                          <div
                            key={suggestion.code}
                            className="flex items-center justify-between p-2 bg-muted/50 rounded border border-muted"
                          >
                            <div>
                              <span className="font-mono text-sm font-medium text-primary">
                                {suggestion.code}
                              </span>
                              <span className="text-sm text-muted-foreground ml-2">
                                {suggestion.description}
                              </span>
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {suggestion.confidence}% match
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Retry button if needed */}
      {onRetry && (
        <div className="text-center">
          <Button
            onClick={onRetry}
            variant="outline"
            className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
          >
            Process Codes Again
          </Button>
        </div>
      )}
    </div>
  );
};

export default ResultsDisplay;
