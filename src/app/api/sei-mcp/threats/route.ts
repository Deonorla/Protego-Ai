import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Replace with your actual SEI MCP server endpoint
    const seiMcpUrl = process.env.SEI_MCP_SERVER_URL || 'http://localhost:3001'
    
    const response = await fetch(`${seiMcpUrl}/api/threats`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // Add any required authentication headers
        'Authorization': `Bearer ${process.env.SEI_MCP_API_KEY || ''}`
      }
    })

    if (!response.ok) {
      throw new Error(`SEI MCP server responded with status: ${response.status}`)
    }

    const threats = await response.json()
    
    return NextResponse.json({ 
      success: true, 
      threats: threats || [] 
    })
  } catch (error) {
    console.error('Error fetching threats from SEI MCP server:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch threats',
        threats: [] 
      },
      { status: 500 }
    )
  }
}