// YouTube API helper functions
export class YouTubeService {
  private apiKey: string

  constructor() {
    this.apiKey = process.env.YOUTUBE_API_KEY || ''
  }

  /**
   * Extract video ID from YouTube URL
   */
  static extractVideoId(url: string): string | null {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
      /youtube\.com\/watch\?.*v=([^&\n?#]+)/,
      /youtu\.be\/([^&\n?#]+)/,
      /youtube\.com\/embed\/([^&\n?#]+)/
    ]

    for (const pattern of patterns) {
      const match = url.match(pattern)
      if (match && match[1]) {
        return match[1]
      }
    }

    return null
  }

  /**
   * Get embed URL for YouTube video
   */
  static getEmbedUrl(videoId: string): string {
    return `https://www.youtube.com/embed/${videoId}`
  }

  /**
   * Get thumbnail URL for YouTube video
   */
  static getThumbnailUrl(videoId: string, quality: 'default' | 'medium' | 'high' | 'maxres' = 'default'): string {
    const qualityMap = {
      default: 'default',
      medium: 'mqdefault',
      high: 'hqdefault',
      maxres: 'maxresdefault'
    }
    return `https://img.youtube.com/vi/${videoId}/${qualityMap[quality]}.jpg`
  }

  /**
   * Get watch URL for YouTube video
   */
  static getWatchUrl(videoId: string): string {
    return `https://www.youtube.com/watch?v=${videoId}`
  }

  /**
   * Check if URL is a valid YouTube URL
   */
  static isValidYouTubeUrl(url: string): boolean {
    return url.includes('youtube.com') || url.includes('youtu.be')
  }

  /**
   * Convert YouTube URL to embed URL
   */
  static toEmbedUrl(url: string): string | null {
    const videoId = YouTubeService.extractVideoId(url)
    return videoId ? YouTubeService.getEmbedUrl(videoId) : null
  }

  /**
   * Get video info from YouTube API
   */
  async getVideoInfo(videoId: string) {
    try {
      if (!this.apiKey) {
        console.warn('YouTube API key not configured')
        return null
      }

      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails&id=${videoId}&key=${this.apiKey}`
      )

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return data.items?.[0] || null
    } catch (error) {
      console.error('Error fetching video info:', error)
      return null
    }
  }

  /**
   * Search videos on YouTube
   */
  async searchVideos(query: string, maxResults: number = 10) {
    try {
      if (!this.apiKey) {
        console.warn('YouTube API key not configured')
        return []
      }

      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&type=video&maxResults=${maxResults}&key=${this.apiKey}`
      )

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return data.items || []
    } catch (error) {
      console.error('Error searching videos:', error)
      return []
    }
  }

  /**
   * Get video duration in seconds
   */
  static parseDuration(duration: string): number {
    const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/)
    if (!match) return 0

    const hours = parseInt(match[1] || '0')
    const minutes = parseInt(match[2] || '0')
    const seconds = parseInt(match[3] || '0')

    return hours * 3600 + minutes * 60 + seconds
  }

  /**
   * Format duration to human readable format
   */
  static formatDuration(seconds: number): string {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`
  }
}

// Export singleton instance
export const youTubeService = new YouTubeService()

// Utility functions for common operations
export const YouTubeUtils = {
  /**
   * Generate iframe embed code
   */
  generateEmbedCode(videoId: string, options: {
    width?: number
    height?: number
    autoplay?: boolean
    controls?: boolean
    modestBranding?: boolean
    rel?: boolean
  } = {}): string {
    const {
      width = 560,
      height = 315,
      autoplay = false,
      controls = true,
      modestBranding = true,
      rel = false
    } = options

    const params = new URLSearchParams({
      autoplay: autoplay ? '1' : '0',
      controls: controls ? '1' : '0',
      modestbranding: modestBranding ? '1' : '0',
      rel: rel ? '1' : '0'
    })

    return `<iframe 
      width="${width}" 
      height="${height}" 
      src="https://www.youtube.com/embed/${videoId}?${params.toString()}" 
      frameborder="0" 
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
      allowfullscreen>
    </iframe>`
  },

  /**
   * Validate YouTube video ID
   */
  isValidVideoId(videoId: string): boolean {
    return /^[a-zA-Z0-9_-]{11}$/.test(videoId)
  },

  /**
   * Get video quality options
   */
  getQualityOptions() {
    return [
      { value: 'default', label: 'Default (120x90)' },
      { value: 'medium', label: 'Medium (320x180)' },
      { value: 'high', label: 'High (480x360)' },
      { value: 'maxres', label: 'Maximum Resolution (1280x720)' }
    ]
  }
}