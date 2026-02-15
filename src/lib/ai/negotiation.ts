import type Anthropic from '@anthropic-ai/sdk'

let _anthropic: Anthropic | null = null

async function getAnthropic(): Promise<Anthropic> {
  if (!_anthropic) {
    const { default: Anthropic } = await import('@anthropic-ai/sdk')
    _anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY!,
    })
  }
  return _anthropic
}

interface NegotiationContext {
  offerMinPrice: number
  offerMaxDiscountPct: number
  flashPrice: number
  availableValueAdds: Array<{
    name: string
    retailValue: number
    description?: string
  }>
  attemptNumber: number
  ticketCount: number
  offeredPrice: number
  eventName: string
  venueName: string
}

export async function negotiateOffer(context: NegotiationContext): Promise<{
  response: string
  accepted: boolean
  counterPrice?: number
  includedValueAdds?: string[]
}> {
  const systemPrompt = `Du bist der TONITE Verhandlungs-Bot. Du verhandelst freundlich, charmant und auf Deutsch über Ticket-Preise.

Regeln:
- Mindestpreis für dieses Event: ${context.offerMinPrice} €
- Maximaler Rabatt: ${context.offerMaxDiscountPct * 100}% vom Flash-Preis (${context.flashPrice} €)
- Verfügbare Value-Adds: ${context.availableValueAdds.map(v => `${v.name} (Wert: ${v.retailValue}€)`).join(', ') || 'keine'}
- Der Kunde hat Angebot Nr. ${context.attemptNumber} von 3
- Angefragter Preis: ${context.offeredPrice} € pro Ticket (${context.ticketCount} Tickets)
- Event: ${context.eventName} bei ${context.venueName}

Verhalte dich wie ein charmanter Concierge, nicht wie ein Roboter. Sei kreativ mit Value-Adds um Deals zu schließen. Antworte immer auf Deutsch. Maximal 3 Sätze pro Antwort.

Wenn der Preis akzeptabel ist (>= Mindestpreis und innerhalb des max. Rabatts), bestätige sofort mit Zusammenfassung.

Antwortformat als JSON:
{
  "response": "Deine charmante Antwort auf Deutsch",
  "accepted": true/false,
  "counterPrice": <Gegenvorschlag in € oder null>,
  "includedValueAdds": ["Value-Add Name"] oder []
}`

  const anthropic = await getAnthropic()
  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 500,
    system: systemPrompt,
    messages: [
      {
        role: 'user',
        content: `Ich hätte gerne ${context.ticketCount} Tickets für je ${context.offeredPrice} Euro.`,
      },
    ],
  })

  try {
    const content = message.content[0]
    if (content.type === 'text') {
      const jsonMatch = content.text.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0])
      }
    }
    return {
      response: 'Entschuldigung, da ist etwas schiefgelaufen. Bitte versuche es erneut.',
      accepted: false,
    }
  } catch {
    return {
      response: 'Entschuldigung, da ist etwas schiefgelaufen. Bitte versuche es erneut.',
      accepted: false,
    }
  }
}
