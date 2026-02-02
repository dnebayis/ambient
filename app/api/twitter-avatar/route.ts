import { NextRequest, NextResponse } from 'next/server'

/**
 * Twitter Avatar Proxy API
 * Fetches Twitter profile pictures using Unavatar.io
 * This avoids CORS issues and provides a server-side proxy
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const username = searchParams.get('username')

  if (!username) {
    return NextResponse.json(
      { error: 'Username parameter is required' },
      { status: 400 }
    )
  }

  // Validate username format (alphanumeric, underscore, 1-15 chars)
  const usernameRegex = /^[a-zA-Z0-9_]{1,15}$/
  if (!usernameRegex.test(username)) {
    return NextResponse.json(
      { error: 'Invalid Twitter username format' },
      { status: 400 }
    )
  }

  try {
    // Use Unavatar.io as a reliable proxy service
    const avatarUrl = `https://unavatar.io/twitter/${username}`

    const response = await fetch(avatarUrl, {
      headers: {
        'User-Agent': 'Ambient-Quiz-App/1.0',
      },
    })

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch avatar' },
        { status: response.status }
      )
    }

    const imageBuffer = await response.arrayBuffer()
    const contentType = response.headers.get('content-type') || 'image/jpeg'

    return new NextResponse(imageBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400', // Cache for 24 hours
      },
    })
  } catch (error) {
    console.error('Error fetching Twitter avatar:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
