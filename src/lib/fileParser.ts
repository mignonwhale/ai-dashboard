export async function parseFile(file: File): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer())

  try {
    if (file.type === 'application/pdf') {
      // Vercel 환경에서 pdf-parse 동적 import
      try {
        const pdf = await import('pdf-parse')
        const pdfParse = pdf.default || pdf
        const data = await pdfParse(buffer)
        return data.text
      } catch (pdfError) {
        console.error('PDF 파싱 실패, 기본 텍스트 추출 시도:', pdfError)
        // PDF 파싱 실패 시 기본 버퍼 텍스트 추출 시도
        const text = buffer.toString('utf-8', 0, Math.min(buffer.length, 1000))
        if (text.length > 10) {
          return text
        }
        throw new Error('PDF 파일을 읽을 수 없습니다.')
      }
    } else if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
      return buffer.toString('utf-8')
    } else if (
      file.type === 'application/msword' ||
      file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      file.name.endsWith('.doc') ||
      file.name.endsWith('.docx')
    ) {
      // DOC/DOCX 파일의 경우 기본적으로 텍스트로 처리
      // 실제 프로덕션에서는 mammoth.js 등의 라이브러리 사용 권장
      return buffer.toString('utf-8')
    } else {
      throw new Error('지원하지 않는 파일 형식입니다.')
    }
  } catch (error) {
    console.error('파일 파싱 오류:', error)
    throw new Error('파일을 읽는 중 오류가 발생했습니다.')
  }
}
