import { useState } from "react";
import {
  AnalysisResponse,
  ContractAnalysisRequest,
  duckMcpService,
} from "@/services/duckMcpService";

export function useContractAnalysis() {
  const [analysis, setAnalysis] = useState<AnalysisResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyzeContract = async (request: ContractAnalysisRequest) => {
    setLoading(true);
    setError(null);
    setAnalysis(null);

    try {
      const result = await duckMcpService.analyzeContract(request);
      setAnalysis(result);
      return result;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to analyze contract";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setAnalysis(null);
    setError(null);
    setLoading(false);
  };

  return {
    analysis,
    loading,
    error,
    analyzeContract,
    reset,
  };
}
