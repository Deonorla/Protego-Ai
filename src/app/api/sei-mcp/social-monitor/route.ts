// src/app/api/sei-mcp/social-monitor/route.ts
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { platforms, keywords, groupIds } = await request.json()
    
    const seiMcpUrl = process.env.SEI_MCP_SERVER_URL || 'http://localhost:3001'
    
    const response = await fetch(`${seiMcpUrl}/api/social-monitor`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.SEI_MCP_API_KEY || ''}`
      },
      body: JSON.stringify({ platforms, keywords, groupIds })
    })

    if (!response.ok) {
      throw new Error(`SEI MCP server responded with status: ${response.status}`)
    }

    const monitoring = await response.json()
    
    return NextResponse.json({ 
      success: true, 
      monitoring 
    })
  } catch (error) {
    console.error('Error starting social monitoring with SEI MCP server:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to start social monitoring' 
      },
      { status: 500 }
    )
  }
}