import { 
  sanitizeText, 
  validateEmail, 
  validatePassword, 
  validateFileSize, 
  validateFileType,
  validateTextLength,
  isValidUUID 
} from '../validation'

describe('Validation Utils', () => {
  describe('sanitizeText', () => {
    it('should sanitize HTML entities', () => {
      expect(sanitizeText('<script>alert("xss")</script>')).toBe('&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;')
      expect(sanitizeText('Hello & World')).toBe('Hello &amp; World')
      expect(sanitizeText("It's a test")).toBe('It&#x27;s a test')
    })

    it('should trim whitespace', () => {
      expect(sanitizeText('  hello world  ')).toBe('hello world')
    })
  })

  describe('validateEmail', () => {
    it('should validate correct emails', () => {
      expect(validateEmail('test@example.com')).toBe(true)
      expect(validateEmail('user.name@domain.co.kr')).toBe(true)
    })

    it('should reject invalid emails', () => {
      expect(validateEmail('invalid-email')).toBe(false)
      expect(validateEmail('@domain.com')).toBe(false)
      expect(validateEmail('user@')).toBe(false)
    })
  })

  describe('validatePassword', () => {
    it('should validate passwords with 6+ characters', () => {
      const result = validatePassword('password123')
      expect(result.isValid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it('should reject passwords shorter than 6 characters', () => {
      const result = validatePassword('12345')
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('비밀번호는 최소 6자 이상이어야 합니다.')
    })
  })

  describe('validateFileSize', () => {
    it('should validate files under size limit', () => {
      const sizeUnder10MB = 9 * 1024 * 1024
      expect(validateFileSize(sizeUnder10MB)).toBe(true)
    })

    it('should reject files over size limit', () => {
      const sizeOver10MB = 11 * 1024 * 1024
      expect(validateFileSize(sizeOver10MB)).toBe(false)
    })
  })

  describe('validateFileType', () => {
    it('should validate allowed file types', () => {
      expect(validateFileType('document.pdf', ['.pdf', '.txt'])).toBe(true)
      expect(validateFileType('text.txt', ['.pdf', '.txt'])).toBe(true)
    })

    it('should reject disallowed file types', () => {
      expect(validateFileType('image.jpg', ['.pdf', '.txt'])).toBe(false)
      expect(validateFileType('script.exe', ['.pdf', '.txt'])).toBe(false)
    })
  })

  describe('validateTextLength', () => {
    it('should validate text under length limit', () => {
      expect(validateTextLength('short text')).toBe(true)
    })

    it('should reject text over length limit', () => {
      const longText = 'a'.repeat(10001)
      expect(validateTextLength(longText)).toBe(false)
    })
  })

  describe('isValidUUID', () => {
    it('should validate correct UUIDs', () => {
      expect(isValidUUID('123e4567-e89b-12d3-a456-426614174000')).toBe(true)
    })

    it('should reject invalid UUIDs', () => {
      expect(isValidUUID('invalid-uuid')).toBe(false)
      expect(isValidUUID('123')).toBe(false)
    })
  })
})