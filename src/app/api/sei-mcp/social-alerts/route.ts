// src/app/api/sei-mcp/social-alerts/route.ts
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const seiMcpUrl = process.env.SEI_MCP_SERVER_URL || 'http://localhost:3001'
    
    const response = await fetch(`${seiMcpUrl}/api/social-alerts`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.SEI_MCP_API_KEY || ''}`
      }
    })

    if (!response.ok) {
      throw new Error(`SEI MCP server responded with status: ${response.status}`)
    }

    const alerts = await response.json()
    
    return NextResponse.json({ 
      success: true, 
      alerts: alerts || [] 
    })
  } catch (error) {
    console.error('Error fetching social alerts from SEI MCP server:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch social alerts',
        alerts: [] 
      },
      { status: 500 }
    )
  }
}
