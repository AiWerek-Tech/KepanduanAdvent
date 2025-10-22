import { Readable } from 'stream'
import { google } from 'googleapis'

// Google Drive API helper functions
export class GoogleDriveService {
  private auth: any
  private drive: any

  constructor() {
    // Initialize Google Drive API with service account or OAuth2
    this.initializeAuth()
  }

  private initializeAuth() {
    try {
      const auth = new google.auth.GoogleAuth({
        credentials: {
          client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
          private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        },
        scopes: ['https://www.googleapis.com/auth/drive'],
      })

      this.auth = auth
      this.drive = google.drive({ version: 'v3', auth })
    } catch (error) {
      console.error('Error initializing Google Drive auth:', error)
    }
  }

  /**
   * Get embed URL for Google Drive file
   */
  static getEmbedUrl(fileId: string): string {
    return `https://drive.google.com/file/d/${fileId}/preview`
  }

  /**
   * Get direct download URL for Google Drive file
   */
  static getDownloadUrl(fileId: string): string {
    return `https://drive.google.com/uc?export=download&id=${fileId}`
  }

  /**
   * Extract file ID from Google Drive URL
   */
  static extractFileId(url: string): string | null {
    const patterns = [
      /\/file\/d\/([a-zA-Z0-9_-]+)/,
      /id=([a-zA-Z0-9_-]+)/,
      /\/d\/([a-zA-Z0-9_-]+)/
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
   * Upload file to Google Drive
   */
  async uploadFile(
    fileName: string,
    fileBuffer: Buffer,
    mimeType: string,
    folderId?: string
  ): Promise<string | null> {
    try {
      const media = {
        mimeType,
        body: Readable.from(fileBuffer),
      }

      const fileMetadata: any = {
        name: fileName,
      }

      if (folderId) {
        fileMetadata.parents = [folderId]
      }

      const response = await this.drive.files.create({
        resource: fileMetadata,
        media: media,
        fields: 'id',
      })

      // Make file publicly accessible
      await this.drive.permissions.create({
        fileId: response.data.id,
        requestBody: {
          role: 'reader',
          type: 'anyone',
        },
      })

      return response.data.id
    } catch (error) {
      console.error('Error uploading file to Google Drive:', error)
      return null
    }
  }

  /**
   * Get file info from Google Drive
   */
  async getFileInfo(fileId: string) {
    try {
      const response = await this.drive.files.get({
        fileId: fileId,
        fields: 'id, name, mimeType, size, webViewLink',
      })
      return response.data
    } catch (error) {
      console.error('Error getting file info:', error)
      return null
    }
  }

  /**
   * List files in a folder
   */
  async listFiles(folderId?: string) {
    try {
      const query = folderId 
        ? `'${folderId}' in parents and trashed=false`
        : "trashed=false"

      const response = await this.drive.files.list({
        q: query,
        fields: 'files(id, name, mimeType, size, webViewLink)',
        pageSize: 100,
      })

      return response.data.files
    } catch (error) {
      console.error('Error listing files:', error)
      return []
    }
  }

  /**
   * Delete file from Google Drive
   */
  async deleteFile(fileId: string): Promise<boolean> {
    try {
      await this.drive.files.delete({
        fileId: fileId,
      })
      return true
    } catch (error) {
      console.error('Error deleting file:', error)
      return false
    }
  }
}

// Export singleton instance
export const googleDriveService = new GoogleDriveService()

// Utility functions for common operations
export const GoogleDriveUtils = {
  /**
   * Check if URL is a valid Google Drive URL
   */
  isValidDriveUrl(url: string): boolean {
    return url.includes('drive.google.com') && 
           (url.includes('/file/d/') || url.includes('id='))
  },

  /**
   * Convert Google Drive URL to embed URL
   */
  toEmbedUrl(url: string): string | null {
    const fileId = GoogleDriveService.extractFileId(url)
    return fileId ? GoogleDriveService.getEmbedUrl(fileId) : null
  },

  /**
   * Convert Google Drive URL to download URL
   */
  toDownloadUrl(url: string): string | null {
    const fileId = GoogleDriveService.extractFileId(url)
    return fileId ? GoogleDriveService.getDownloadUrl(fileId) : null
  },

  /**
   * Get file type from Google Drive URL
   */
  getFileType(url: string): 'pdf' | 'audio' | 'video' | 'other' {
    const urlLower = url.toLowerCase()
    if (urlLower.includes('.pdf')) return 'pdf'
    if (urlLower.includes('.mp3') || urlLower.includes('.wav') || urlLower.includes('.m4a')) return 'audio'
    if (urlLower.includes('.mp4') || urlLower.includes('.avi') || urlLower.includes('.mov')) return 'video'
    return 'other'
  }
}