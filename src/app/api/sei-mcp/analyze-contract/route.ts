// src/app/api/sei-mcp/analyze-contract/route.ts
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { contractAddress } = await request.json()
    
    if (!contractAddress) {
      return NextResponse.json(
        { success: false, error: 'Contract address is required' },
        { status: 400 }
      )
    }

    const seiMcpUrl = process.env.SEI_MCP_SERVER_URL || 'http://localhost:3001'
    
    const response = await fetch(`${seiMcpUrl}/api/analyze-contract`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.SEI_MCP_API_KEY || ''}`
      },
      body: JSON.stringify({ contractAddress })
    })

    if (!response.ok) {
      throw new Error(`SEI MCP server responded with status: ${response.status}`)
    }

    const analysis = await response.json()
    
    return NextResponse.json({ 
      success: true, 
      analysis 
    })
  } catch (error) {
    console.error('Error analyzing contract with SEI MCP server:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to analyze contract' 
      },
      { status: 500 }
    )
  }
}