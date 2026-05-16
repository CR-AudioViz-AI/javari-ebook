// app/api/generate/route.ts
// Javari Books — AI Generation API
// Uses COST LAW: free models first via Javari AI engine
// Created: May 15, 2026
import { NextRequest, NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
export const maxDuration = 60

const JAVARI_AI_URL   = process.env.JAVARI_AI_URL   ?? 'https://javariai.com'
const JAVARI_CALLER_KEY = process.env.JAVARI_CALLER_KEY ?? ''
const CREDIT_COST     = 10

const SYSTEM_PROMPT = `You are a professional ebook and content creator for CR AudioViz AI. Create comprehensive, well-structured ebooks, guides, and long-form content. Include table of contents, clear chapters, actionable insights, and compelling titles.`

const AVAILABLE_ACTIONS = [
    "ebook_outline",
    "chapter_content",
    "introduction",
    "conclusion",
    "table_of_contents"
]

export async function GET() {
  return NextResponse.json({
    app:     'Javari Books',
    actions: AVAILABLE_ACTIONS,
    cost_per_generation: CREDIT_COST + ' credits',
    model:   'Javari AI (free models — Groq, Gemini, DeepSeek)',
    cost_usd: '$0.00 per generation (we use free models)',
  })
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as {
      action:     string
      input:      string
      context?:   Record<string, string>
      tone?:      string
      length?:    'short' | 'medium' | 'long'
      user_id?:   string
    }

    if (!body.input?.trim()) {
      return NextResponse.json({ error: 'input is required' }, { status: 400 })
    }

    if (!AVAILABLE_ACTIONS.includes(body.action)) {
      return NextResponse.json({
        error: 'Invalid action',
        available: AVAILABLE_ACTIONS,
      }, { status: 400 })
    }

    const lengthGuide = body.length === 'short' ? 'Be concise (200-400 words).'
      : body.length === 'long' ? 'Be comprehensive (800-1500 words).'
      : 'Be thorough but focused (400-800 words).'

    const objective = [
      `Action: ${body.action.replace(/_/g, ' ')}`,
      `User input: ${body.input}`,
      body.tone ? `Tone: ${body.tone}` : '',
      lengthGuide,
      body.context ? `Additional context: ${JSON.stringify(body.context)}` : '',
    ].filter(Boolean).join('\n')

    // Call Javari AI using COST LAW free models
    const plan = {
      plan_id:              `gen-${Date.now()}`,
      created_at:           new Date().toISOString(),
      total_estimated_cost: 0,
      tasks: [{
        id:           'task-generate',
        role:         'builder' as const,
        objective:    SYSTEM_PROMPT + '\n\n' + objective,
        inputs:       [],
        outputs:      ['result'],
        dependencies: [],
        model:        'deepseek/deepseek-v4-flash:free',  // FREE via OpenRouter
        max_cost:     0.0,
        status:       'pending' as const,
      }],
    }

    if (!JAVARI_CALLER_KEY) {
      // Fallback: direct Groq call if caller key not set
      const groqKey = process.env.GROQ_API_KEY
      if (groqKey) {
        const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${groqKey}` },
          body: JSON.stringify({
            model: 'llama-3.3-70b-versatile',
            max_tokens: 2048,
            temperature: 0.7,
            messages: [
              { role: 'system', content: SYSTEM_PROMPT },
              { role: 'user',   content: objective },
            ],
          }),
        })
        if (res.ok) {
          const data = await res.json() as { choices?: Array<{ message?: { content?: string } }> }
          const result = data.choices?.[0]?.message?.content ?? ''
          return NextResponse.json({ result, action: body.action, model: 'groq-llama-free', cost_usd: '$0.00', credits_used: CREDIT_COST })
        }
      }
      return NextResponse.json({ error: 'AI service not configured' }, { status: 503 })
    }

    // Execute via Javari AI engine
    const execRes = await fetch(`${JAVARI_AI_URL}/api/execute`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json', 'x-javari-caller-key': JAVARI_CALLER_KEY },
      body:    JSON.stringify(plan),
    })

    if (!execRes.ok || !execRes.body) {
      return NextResponse.json({ error: 'AI execution failed' }, { status: 502 })
    }

    // Parse SSE stream
    const reader  = execRes.body.getReader()
    const decoder = new TextDecoder()
    let buf = '', result = '', model = 'javari-ai'

    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      buf += decoder.decode(value, { stream: true })
      const parts = buf.split('\n\n')
      buf = parts.pop() ?? ''
      for (const part of parts) {
        if (!part.startsWith('data: ')) continue
        try {
          const evt = JSON.parse(part.slice(6))
          if (evt.type === 'task_complete') {
            const out = evt.result?.output ?? ''
            try {
              const p = JSON.parse(out)
              result = p.artifact ?? p.blueprint ?? p.result ?? out
              model  = p.model_used ?? 'javari-ai'
            } catch { result = out }
          }
        } catch { /* skip */ }
      }
    }

    if (!result) {
      return NextResponse.json({ error: 'No result generated' }, { status: 500 })
    }

    return NextResponse.json({
      result,
      action:       body.action,
      model,
      cost_usd:     '$0.00',
      credits_used: CREDIT_COST,
      generated_at: new Date().toISOString(),
    })

  } catch (err) {
    console.error('[generate/route] error:', err)
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
