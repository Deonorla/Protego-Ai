import React, { useState } from "react";
import { X, Shield, AlertTriangle, CheckCircle, XCircle } from "lucide-react";
import { useContractAnalysis } from "@/hooks/useContractAnalysis";

interface ContractAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialAddress?: string;
}

export const ContractAnalysisModal: React.FC<ContractAnalysisModalProps> = ({
  isOpen,
  onClose,
  initialAddress = "",
}) => {
  const [contractAddress, setContractAddress] = useState(initialAddress);
  const [contractCode, setContractCode] = useState("");
  const [analysisMode, setAnalysisMode] = useState<"address" | "code">(
    "address"
  );

  const { analysis, loading, error, analyzeContract, reset } =
    useContractAnalysis();

  const handleAnalyze = async () => {
    try {
      await analyzeContract(
        analysisMode === "address"
          ? { contractAddress: contractAddress.trim() }
          : { contractCode: contractCode.trim() }
      );
    } catch (err) {
      console.error("Analysis failed:", err);
    }
  };

  const getThreatLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case "low":
        return "text-green-600 bg-green-100";
      case "medium":
        return "text-yellow-600 bg-yellow-100";
      case "high":
        return "text-red-600 bg-red-100";
      case "critical":
        return "text-red-800 bg-red-200";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity.toLowerCase()) {
      case "critical":
        return <XCircle className="w-4 h-4 text-red-500" />;
      case "high":
        return <AlertTriangle className="w-4 h-4 text-orange-500" />;
      case "medium":
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case "low":
        return <CheckCircle className="w-4 h-4 text-blue-500" />;
      default:
        return <Shield className="w-4 h-4 text-gray-500" />;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-slate-700">
          <h2 className="text-[1rem] font-semibold flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-600" />
            Smart Contract Security Analysis
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Analysis Mode Toggle */}
          <div className="flex space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                value="address"
                checked={analysisMode === "address"}
                onChange={(e) => setAnalysisMode(e.target.value as "address")}
                className="mr-2"
              />
              Analyze by Contract Address
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="code"
                checked={analysisMode === "code"}
                onChange={(e) => setAnalysisMode(e.target.value as "code")}
                className="mr-2"
              />
              Analyze by Contract Code
            </label>
          </div>

          {/* Input Fields */}
          {analysisMode === "address" ? (
            <div>
              <label className="block text-sm font-medium mb-2">
                Contract Address
              </label>
              <input
                type="text"
                value={contractAddress}
                onChange={(e) => setContractAddress(e.target.value)}
                placeholder="0x742d35Cc6479C532c7C3Bc4c4e5E1234567890"
                className="w-full p-3 border border-gray-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
              />
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium mb-2">
                Contract Code
              </label>
              <textarea
                value={contractCode}
                onChange={(e) => setContractCode(e.target.value)}
                placeholder="pragma solidity ^0.8.0;..."
                rows={8}
                className="w-full p-3 border border-gray-300 dark:border-slate-600 rounded-md font-mono text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
              />
            </div>
          )}

          {/* Action Button */}
          <button
            onClick={handleAnalyze}
            disabled={loading}
            className="w-full px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                Analyzing Contract...
              </>
            ) : (
              <>
                <Shield className="w-4 h-4" />
                Analyze Contract Security
              </>
            )}
          </button>

          {/* Error Display */}
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4">
              <div className="flex items-center gap-2 text-red-800 dark:text-red-400">
                <XCircle className="w-4 h-4" />
                <span className="font-medium">Analysis Error</span>
              </div>
              <p className="mt-1 text-sm text-red-700 dark:text-red-300">
                {error}
              </p>
            </div>
          )}

          {/* Analysis Results */}
          {analysis?.analysis && (
            <div className="space-y-6">
              <div className="border-t border-gray-200 dark:border-slate-700 pt-6">
                <h3 className="text-lg font-semibold mb-4">Analysis Results</h3>

                {/* Overview Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-gray-50 dark:bg-slate-700/50 p-4 rounded-md">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                      Threat Level
                    </h4>
                    <div
                      className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${getThreatLevelColor(analysis.analysis.threatLevel.level)}`}
                    >
                      {analysis.analysis.threatLevel.level}
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                      Score: {analysis.analysis.threatLevel.score}/100
                    </p>
                  </div>

                  <div className="bg-gray-50 dark:bg-slate-700/50 p-4 rounded-md">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                      Security Score
                    </h4>
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {analysis.analysis.securityScore}/100
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-slate-600 rounded-full h-2 mt-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${analysis.analysis.securityScore}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="bg-gray-50 dark:bg-slate-700/50 p-4 rounded-md">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                      Vulnerabilities
                    </h4>
                    <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                      {analysis.analysis.vulnerabilities.length}
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                      Issues detected
                    </p>
                  </div>
                </div>

                {/* Summary */}
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-md mb-6">
                  <h4 className="font-medium text-blue-900 dark:text-blue-200 mb-2">
                    Analysis Summary
                  </h4>
                  <p className="text-sm text-blue-800 dark:text-blue-300">
                    {analysis.analysis.summary}
                  </p>
                </div>

                {/* Vulnerabilities */}
                {analysis.analysis.vulnerabilities.length > 0 && (
                  <div className="mb-6">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                      Vulnerabilities
                    </h4>
                    <div className="space-y-3">
                      {analysis.analysis.vulnerabilities.map((vuln) => (
                        <div
                          key={vuln.id}
                          className="border border-gray-200 dark:border-slate-600 rounded-md p-4"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              {getSeverityIcon(vuln.severity)}
                              <h5 className="font-medium text-gray-900 dark:text-white">
                                {vuln.title}
                              </h5>
                            </div>
                            <span
                              className={`px-2 py-1 rounded text-xs font-medium ${
                                vuln.severity === "CRITICAL"
                                  ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                                  : vuln.severity === "HIGH"
                                    ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                                    : vuln.severity === "MEDIUM"
                                      ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                                      : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                              }`}
                            >
                              {vuln.severity}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                            {vuln.description}
                          </p>
                          <p className="text-xs text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 p-2 rounded">
                            <strong>Recommendation:</strong>{" "}
                            {vuln.recommendation}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recommendations */}
                {analysis.analysis.recommendations.length > 0 && (
                  <div className="mb-6">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                      Recommendations
                    </h4>
                    <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md p-4">
                      <ul className="space-y-2">
                        {analysis.analysis.recommendations.map((rec, index) => (
                          <li
                            key={index}
                            className="text-sm text-green-800 dark:text-green-300 flex items-start"
                          >
                            <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {/* Gas Optimizations */}
                {analysis.analysis.gasOptimizations.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                      Gas Optimizations
                    </h4>
                    <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-md p-4">
                      <ul className="space-y-2">
                        {analysis.analysis.gasOptimizations.map(
                          (opt, index) => (
                            <li
                              key={index}
                              className="text-sm text-purple-800 dark:text-purple-300 flex items-start"
                            >
                              <span className="text-purple-600 dark:text-purple-400 mr-2">
                                ⚡
                              </span>
                              {opt}
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
