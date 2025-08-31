const API_BASE_URL =
  process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000";

export interface ContractAnalysisRequest {
  contractAddress?: string;
  contractCode?: string;
}

export interface ThreatLevel {
  level: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  score: number;
  confidence: number;
}

export interface Vulnerability {
  id: string;
  title: string;
  description: string;
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW" | "INFO";
  recommendation: string;
  cwe: string;
}

export interface ContractAnalysis {
  contractAddress: string;
  auditId: string;
  timestamp: string;
  threatLevel: ThreatLevel;
  vulnerabilities: Vulnerability[];
  summary: string;
  gasOptimizations: string[];
  securityScore: number;
  recommendations: string[];
}

export interface AnalysisResponse {
  success: boolean;
  analysis?: ContractAnalysis;
  error?: string;
}

class DuckMcpService {
  private baseUrl = API_BASE_URL;

  async analyzeContract(
    request: ContractAnalysisRequest
  ): Promise<AnalysisResponse> {
    try {
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

      return await response.json();
    } catch (error) {
      console.error("Contract analysis error:", error);
      throw error;
    }
  }

  // Fetch general threats (your existing endpoint)
  async fetchThreats() {
    try {
      const response = await fetch(`${this.baseUrl}/api/sei-mcp/threats`);
      if (!response.ok) {
        throw new Error(`Failed to fetch threats: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Failed to fetch threats:", error);
      return { threats: [] };
    }
  }
}

export const seiMcpService = new DuckMcpService();
