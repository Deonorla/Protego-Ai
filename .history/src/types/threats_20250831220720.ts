import { ContractAnalysis } from "@/services/duckMcpService";

export interface Threat {
  id: string;
  type: "contract" | "social" | "transaction";
  severity: "low" | "medium" | "high" | "critical";
  title: string;
  description: string;
  source: string;
  timestamp: string;
  action?: string;
  contractAnalysis?: ContractAnalysis;
}
