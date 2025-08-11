import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
})

export async function generateChatResponse(messages: { role: string; content: string }[]) {
  try {
    // Claude API는 system 메시지를 별도로 처리하므로 메시지 형식 변환
    const systemMessage = messages.find(msg => msg.role === 'system')?.content
    const conversationMessages = messages.filter(msg => msg.role !== 'system')

    const response = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 2000,
      temperature: 0.7,
      system: systemMessage || "당신은 친근하고 도움이 되는 AI 어시스턴트입니다. 한국어로 자연스럽고 정확한 답변을 제공해주세요.",
      messages: conversationMessages.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'assistant',
        content: msg.content
      })) as any,
    })
    
    return response.content[0].type === 'text' ? response.content[0].text : "죄송합니다. 응답을 생성할 수 없습니다."
  } catch (error) {
    console.error('Claude API Error:', error)
    throw new Error('AI 응답 생성에 실패했습니다.')
  }
}

export async function generateText(prompt: string, type: 'blog' | 'marketing' | 'general' = 'general') {
  try {
    const systemPrompts = {
      blog: "당신은 전문적인 블로그 작가입니다. 주어진 주제에 대해 매력적이고 읽기 쉬운 블로그 포스트를 한국어로 작성해주세요. SEO를 고려한 구조화된 글을 작성하세요.",
      marketing: "당신은 마케팅 전문가입니다. 주어진 제품이나 서비스에 대해 매력적이고 설득력 있는 마케팅 문구를 한국어로 작성해주세요.",
      general: "당신은 도움이 되는 AI 어시스턴트입니다. 사용자의 요청에 따라 고품질의 한국어 텍스트를 생성해주세요."
    }

    const response = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 1500,
      temperature: 0.8,
      system: systemPrompts[type],
      messages: [
        { role: 'user', content: prompt }
      ],
    })
    
    return response.content[0].type === 'text' ? response.content[0].text : "텍스트 생성에 실패했습니다."
  } catch (error) {
    console.error('Claude API Error:', error)
    throw new Error('텍스트 생성에 실패했습니다.')
  }
}

export async function analyzeFile(content: string, fileName: string) {
  try {
    const response = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 1000,
      temperature: 0.3,
      system: "당신은 문서 분석 전문가입니다. 주어진 파일의 내용을 분석하고 핵심 내용을 한국어로 요약해주세요. 구조화된 분석 결과를 제공하세요.",
      messages: [
        { 
          role: 'user', 
          content: `파일명: ${fileName}\n\n내용:\n${content}\n\n이 파일의 핵심 내용을 요약하고 주요 포인트를 정리해주세요. 다음 형식으로 답변해주세요:\n\n## 📋 문서 요약\n\n## 🔍 주요 포인트\n\n## 💡 핵심 인사이트` 
        }
      ],
    })
    
    return response.content[0].type === 'text' ? response.content[0].text : "파일 분석에 실패했습니다."
  } catch (error) {
    console.error('Claude API Error:', error)
    throw new Error('파일 분석에 실패했습니다.')
  }
}

export async function recommendTodos(existingTodos: string[], userContext: string = '') {
  try {
    const response = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 500,
      temperature: 0.7,
      system: "당신은 생산성 코치입니다. 사용자의 기존 할 일 목록을 보고 도움이 될 만한 추가 작업들을 추천해주세요. 실용적이고 실행 가능한 작업들을 제안하세요.",
      messages: [
        { 
          role: 'user', 
          content: `기존 할 일들:\n${existingTodos.join('\n')}\n\n추가 컨텍스트: ${userContext}\n\n위 정보를 바탕으로 도움이 될 만한 할 일 3-5개를 추천해주세요. 각 항목은 한 줄로 작성하고, 번호나 불릿 포인트 없이 작성해주세요.` 
        }
      ],
    })
    
    const text = response.content[0].type === 'text' ? response.content[0].text : ""
    return text.split('\n').filter(line => line.trim()).slice(0, 5)
  } catch (error) {
    console.error('Claude API Error:', error)
    throw new Error('할 일 추천에 실패했습니다.')
  }
}

export async function analyzeCSV(csvData: string, fileName: string) {
  try {
    const response = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 1000,
      temperature: 0.4,
      system: "당신은 데이터 분석 전문가입니다. CSV 데이터를 분석하고 인사이트를 제공해주세요. 차트로 시각화할 만한 데이터가 있다면 추천해주세요.",
      messages: [
        { 
          role: 'user', 
          content: `파일명: ${fileName}\n\nCSV 데이터 (처음 1000자):\n${csvData.substring(0, 1000)}\n\n이 데이터의 주요 특징과 인사이트를 분석하고, 적절한 시각화 방법을 제안해주세요.\n\n다음 형식으로 답변해주세요:\n\n## 📊 데이터 개요\n\n## 🔍 주요 특징\n\n## 📈 시각화 추천\n\n## 💡 인사이트` 
        }
      ],
    })
    
    return response.content[0].type === 'text' ? response.content[0].text : "CSV 분석에 실패했습니다."
  } catch (error) {
    console.error('Claude API Error:', error)
    throw new Error('CSV 분석에 실패했습니다.')
  }
}

export default anthropic