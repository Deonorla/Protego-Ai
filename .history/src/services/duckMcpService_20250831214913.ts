const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";

export interface ContractAnalysisRequest {
  contractAddress?: string;
  contractCode?: string;
}

export interface ThreatAnalysis {
  level: string;
  score: number;
  description: string;
}

export interface ContractAnalysis {
  threatLevel: ThreatAnalysis;
  securityScore: number;
  vulnerabilities: Array<{
    type: string;
    severity: string;
    description: string;
  }>;
  recommendations: string[];
}

export interface ContractAnalysisResponse {
  success: boolean;
  analysis?: ContractAnalysis;
  error?: string;
}

class ContractAnalysisService {
  private baseUrl = API_BASE_URL;

  async analyzeContract(
    request: ContractAnalysisRequest
  ): Promise<ContractAnalysisResponse> {
    try {
      console.log("Sending contract for analysis:", request.contractAddress);

      const response = await fetch(
        `${this.baseUrl}/api/sei-mcp/analyze-contract`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(request),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error || `HTTP ${response.status}: ${response.statusText}`
        );
      }

      const data: ContractAnalysisResponse = await response.json();

      if (!data.success) {
        throw new Error(data.error || "Analysis failed");
      }

      return data;
    } catch (error) {
      console.error("Contract analysis error:", error);
      throw error;
    }
  }

  async analyzeByAddress(
    contractAddress: string
  ): Promise<ContractAnalysisResponse> {
    return this.analyzeContract({ contractAddress });
  }

  async analyzeByCode(contractCode: string): Promise<ContractAnalysisResponse> {
    return this.analyzeContract({ contractCode });
  }
}

export const contractAnalysisService = new ContractAnalysisService();
