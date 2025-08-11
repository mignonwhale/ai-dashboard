import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
})

export async function generateChatResponse(messages: { role: string; content: string }[]) {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: messages as any,
      max_tokens: 2000,
      temperature: 0.7,
    })
    
    return completion.choices[0]?.message?.content || "죄송합니다. 응답을 생성할 수 없습니다."
  } catch (error) {
    console.error('OpenAI API Error:', error)
    throw new Error('AI 응답 생성에 실패했습니다.')
  }
}

export async function generateText(prompt: string, type: 'blog' | 'marketing' | 'general' = 'general') {
  try {
    const systemPrompts = {
      blog: "당신은 전문적인 블로그 작가입니다. 주어진 주제에 대해 매력적이고 읽기 쉬운 블로그 포스트를 작성해주세요.",
      marketing: "당신은 마케팅 전문가입니다. 주어진 제품이나 서비스에 대해 매력적인 마케팅 문구를 작성해주세요.",
      general: "당신은 도움이 되는 AI 어시스턴트입니다. 사용자의 요청에 따라 고품질의 텍스트를 생성해주세요."
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompts[type] },
        { role: "user", content: prompt }
      ],
      max_tokens: 1500,
      temperature: 0.8,
    })
    
    return completion.choices[0]?.message?.content || "텍스트 생성에 실패했습니다."
  } catch (error) {
    console.error('OpenAI API Error:', error)
    throw new Error('텍스트 생성에 실패했습니다.')
  }
}

export async function analyzeFile(content: string, fileName: string) {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { 
          role: "system", 
          content: "당신은 문서 분석 전문가입니다. 주어진 파일의 내용을 분석하고 핵심 내용을 요약해주세요." 
        },
        { 
          role: "user", 
          content: `파일명: ${fileName}\n\n내용:\n${content}\n\n이 파일의 핵심 내용을 요약하고 주요 포인트를 정리해주세요.` 
        }
      ],
      max_tokens: 1000,
      temperature: 0.3,
    })
    
    return completion.choices[0]?.message?.content || "파일 분석에 실패했습니다."
  } catch (error) {
    console.error('OpenAI API Error:', error)
    throw new Error('파일 분석에 실패했습니다.')
  }
}

export async function recommendTodos(existingTodos: string[], userContext: string = '') {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { 
          role: "system", 
          content: "당신은 생산성 코치입니다. 사용자의 기존 할 일 목록을 보고 도움이 될 만한 추가 작업들을 추천해주세요. 실용적이고 실행 가능한 작업들을 제안하세요." 
        },
        { 
          role: "user", 
          content: `기존 할 일들:\n${existingTodos.join('\n')}\n\n추가 컨텍스트: ${userContext}\n\n위 정보를 바탕으로 도움이 될 만한 할 일 3-5개를 추천해주세요. 각 항목은 한 줄로 작성해주세요.` 
        }
      ],
      max_tokens: 500,
      temperature: 0.7,
    })
    
    const response = completion.choices[0]?.message?.content || ""
    return response.split('\n').filter(line => line.trim()).slice(0, 5)
  } catch (error) {
    console.error('OpenAI API Error:', error)
    throw new Error('할 일 추천에 실패했습니다.')
  }
}

export async function analyzeCSV(csvData: string, fileName: string) {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { 
          role: "system", 
          content: "당신은 데이터 분석 전문가입니다. CSV 데이터를 분석하고 인사이트를 제공해주세요. 차트로 시각화할 만한 데이터가 있다면 추천해주세요." 
        },
        { 
          role: "user", 
          content: `파일명: ${fileName}\n\nCSV 데이터 (처음 1000자):\n${csvData.substring(0, 1000)}\n\n이 데이터의 주요 특징과 인사이트를 분석하고, 적절한 시각화 방법을 제안해주세요.` 
        }
      ],
      max_tokens: 1000,
      temperature: 0.4,
    })
    
    return completion.choices[0]?.message?.content || "CSV 분석에 실패했습니다."
  } catch (error) {
    console.error('OpenAI API Error:', error)
    throw new Error('CSV 분석에 실패했습니다.')
  }
}

export default openai