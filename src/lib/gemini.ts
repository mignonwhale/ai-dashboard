import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export async function generateChatResponse(messages: { role: string; content: string }[]) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })
    
    // 시스템 메시지와 대화 메시지 분리
    const systemMessage = messages.find(msg => msg.role === 'system')?.content
    const conversationMessages = messages.filter(msg => msg.role !== 'system')
    
    // Gemini는 대화 형태로 변환
    let prompt = systemMessage || "당신은 친근하고 도움이 되는 AI 어시스턴트입니다. 한국어로 자연스럽고 정확한 답변을 제공해주세요."
    
    // 대화 기록을 프롬프트에 포함
    if (conversationMessages.length > 0) {
      prompt += "\n\n대화 기록:\n"
      conversationMessages.forEach(msg => {
        const role = msg.role === 'user' ? '사용자' : '어시스턴트'
        prompt += `${role}: ${msg.content}\n`
      })
    }
    
    // 마지막 사용자 메시지만 실제 질문으로 처리
    const lastUserMessage = conversationMessages.filter(msg => msg.role === 'user').pop()
    if (lastUserMessage) {
      prompt += `\n현재 질문에 대해 답변해주세요: ${lastUserMessage.content}`
    }
    
    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()
    
    return text
  } catch (error: unknown) {
    const apiError = error as { status?: number; message?: string }
    console.error('Gemini API Error:', error)
    
    if (apiError?.status === 401) {
      throw new Error('Gemini API 키가 유효하지 않습니다.')
    }
    
    if (apiError?.status === 429) {
      throw new Error('API 요청 한도를 초과했습니다. 잠시 후 다시 시도해주세요.')
    }
    
    if (apiError?.message?.includes('quota')) {
      throw new Error('Gemini API 할당량을 초과했습니다. 내일 다시 시도해주세요.')
    }
    
    throw new Error('AI 응답 생성에 실패했습니다.')
  }
}

export async function generateText(prompt: string, type: 'blog' | 'marketing' | 'general' = 'general') {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })
    
    const systemPrompts = {
      blog: "당신은 전문적인 블로그 작가입니다. 주어진 주제에 대해 매력적이고 읽기 쉬운 블로그 포스트를 한국어로 작성해주세요. SEO를 고려한 구조화된 글을 작성하세요.",
      marketing: "당신은 마케팅 전문가입니다. 주어진 제품이나 서비스에 대해 매력적이고 설득력 있는 마케팅 문구를 한국어로 작성해주세요.",
      general: "당신은 도움이 되는 AI 어시스턴트입니다. 사용자의 요청에 따라 고품질의 한국어 텍스트를 생성해주세요."
    }
    
    const fullPrompt = `${systemPrompts[type]}\n\n요청: ${prompt}`
    
    const result = await model.generateContent(fullPrompt)
    const response = await result.response
    const text = response.text()
    
    return text
  } catch (error: unknown) {
    const apiError = error as { status?: number; message?: string }
    console.error('Gemini API Error:', error)
    
    if (apiError?.message?.includes('quota')) {
      throw new Error('Gemini API 할당량을 초과했습니다. 내일 다시 시도해주세요.')
    }
    
    throw new Error('텍스트 생성에 실패했습니다.')
  }
}

export async function analyzeFile(content: string, fileName: string) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })
    
    const prompt = `당신은 문서 분석 전문가입니다. 주어진 파일의 내용을 분석하고 핵심 내용을 한국어로 요약해주세요. 구조화된 분석 결과를 제공하세요.

파일명: ${fileName}

내용:
${content}

이 파일의 핵심 내용을 요약하고 주요 포인트를 정리해주세요. 다음 형식으로 답변해주세요:

## 📋 문서 요약

## 🔍 주요 포인트

## 💡 핵심 인사이트`
    
    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()
    
    return text
  } catch (error: unknown) {
    const apiError = error as { status?: number; message?: string }
    console.error('Gemini API Error:', error)
    
    if (apiError?.message?.includes('quota')) {
      throw new Error('Gemini API 할당량을 초과했습니다. 내일 다시 시도해주세요.')
    }
    
    throw new Error('파일 분석에 실패했습니다.')
  }
}

export async function recommendTodos(existingTodos: string[], userContext: string = '') {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })
    
    const prompt = `당신은 생산성 코치입니다. 사용자의 기존 할 일 목록을 보고 도움이 될 만한 추가 작업들을 추천해주세요. 실용적이고 실행 가능한 작업들을 제안하세요.

기존 할 일들:
${existingTodos.join('\n')}

추가 컨텍스트: ${userContext}

위 정보를 바탕으로 도움이 될 만한 할 일 3-5개를 추천해주세요. 각 항목은 한 줄로 작성하고, 번호나 불릿 포인트 없이 작성해주세요.`
    
    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()
    
    return text.split('\n').filter(line => line.trim()).slice(0, 5)
  } catch (error: unknown) {
    const apiError = error as { status?: number; message?: string }
    console.error('Gemini API Error:', error)
    
    if (apiError?.message?.includes('quota')) {
      throw new Error('Gemini API 할당량을 초과했습니다. 내일 다시 시도해주세요.')
    }
    
    throw new Error('할 일 추천에 실패했습니다.')
  }
}

export async function analyzeCSV(csvData: string, fileName: string) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })
    
    const prompt = `당신은 데이터 분석 전문가입니다. CSV 데이터를 분석하고 인사이트를 제공해주세요. 차트로 시각화할 만한 데이터가 있다면 추천해주세요.

파일명: ${fileName}

CSV 데이터 (처음 1000자):
${csvData.substring(0, 1000)}

이 데이터의 주요 특징과 인사이트를 분석하고, 적절한 시각화 방법을 제안해주세요.

다음 형식으로 답변해주세요:

## 📊 데이터 개요

## 🔍 주요 특징

## 📈 시각화 추천

## 💡 인사이트`
    
    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()
    
    return text
  } catch (error: unknown) {
    const apiError = error as { status?: number; message?: string }
    console.error('Gemini API Error:', error)
    
    if (apiError?.message?.includes('quota')) {
      throw new Error('Gemini API 할당량을 초과했습니다. 내일 다시 시도해주세요.')
    }
    
    throw new Error('CSV 분석에 실패했습니다.')
  }
}

export default genAI