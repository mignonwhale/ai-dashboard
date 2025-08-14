// Input validation utilities

export function sanitizeText(text: string): string {
  return text
    .replace(/[<>&"']/g, (char) => {
      const entities: { [key: string]: string } = {
        '<': '&lt;',
        '>': '&gt;',
        '&': '&amp;',
        '"': '&quot;',
        "'": '&#x27;'
      }
      return entities[char]
    })
    .trim()
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function validatePassword(password: string): { isValid: boolean; errors: string[] } {
  const errors: string[] = []
  
  if (password.length < 6) {
    errors.push('비밀번호는 최소 6자 이상이어야 합니다.')
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

export function validateFileSize(size: number, maxSizeMB: number = 10): boolean {
  return size <= maxSizeMB * 1024 * 1024
}

export function validateFileType(filename: string, allowedExtensions: string[]): boolean {
  const extension = filename.toLowerCase().split('.').pop()
  return allowedExtensions.includes(`.${extension}`)
}

export function validateTextLength(text: string, maxLength: number = 10000): boolean {
  return text.length <= maxLength
}

export function isValidUUID(uuid: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
  return uuidRegex.test(uuid)
}