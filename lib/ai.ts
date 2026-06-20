import type { Message } from '@/types';

export async function sendMessage(
  messages: Message[],
  systemPrompt: string,
  apiKey?: string
): Promise<{ content: string; feedback?: Message['feedback'] }> {

  // If OpenAI API key is provided, use real AI
  if (apiKey || process.env.OPENAI_API_KEY) {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey || process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o',
          messages: [
            { role: 'system', content: systemPrompt },
            ...messages.map((m) => ({ role: m.role, content: m.content })),
          ],
          temperature: 0.85,
          max_tokens: 500,
        }),
      });
      const data = await response.json();
      const content = data.choices?.[0]?.message?.content ?? 'Sorry, I had trouble responding.';
      return { content };
    } catch {
      return { content: getMockResponse(messages, systemPrompt) };
    }
  }

  // Fallback: intelligent mock responses
  await new Promise((r) => setTimeout(r, 800 + Math.random() * 600));
  return { content: getMockResponse(messages, systemPrompt) };
}

function getMockResponse(messages: Message[], systemPrompt: string): string {
  const lastUser = messages.filter((m) => m.role === 'user').pop()?.content.toLowerCase() ?? '';
  const msgCount = messages.filter((m) => m.role === 'user').length;

  // Opening message
  if (msgCount === 0) {
    if (systemPrompt.includes('Mt. Fuji') || systemPrompt.includes('Fuji')) {
      return `Oh wow, standing here at the base of Fuji is just... overwhelming. I wasn't prepared for how *massive* it is in person. I've seen so many photos but nothing compares.\n\nI was reading on the plane that Mt. Fuji is actually considered a sacred mountain in Japan? Like, people actually worship it? Can you explain what that means exactly — is it a religious thing, or more of a cultural thing?`;
    }
    if (systemPrompt.includes('Tokyo') || systemPrompt.includes('Shinjuku')) {
      return `I just got out of Shinjuku Station and honestly I have no idea what just happened to me. There were people *everywhere*, signs in every direction, and the station is apparently the busiest in the world?? \n\nHow do people here navigate this every single day without having a breakdown? And why is everyone moving so fast but also being so... polite? Nobody bumped into me once.`;
    }
    if (systemPrompt.includes('ryokan') || systemPrompt.includes('onsen')) {
      return `Hello! We just arrived at the ryokan and the woman at the entrance greeted us in this beautiful kimono and bowed so deeply — I didn't know what to do so I just kind of... waved? Was that wrong?\n\nAnd I saw the sign about the onsen and I'm a little nervous — I've never bathed with strangers before. Can you walk me through the rules? I really don't want to offend anyone.`;
    }
    if (systemPrompt.includes('food') || systemPrompt.includes('cuisine')) {
      return `I run a food blog back in Sydney and I have to say, everything I've eaten in Japan in just two days has completely changed how I think about food. Even the convenience store onigiri was incredible.\n\nBut I want to understand *why* Japanese food tastes so different. Is it a technique thing? The ingredients? I keep reading about this concept of "umami" but what does it actually mean in practice?`;
    }
    return `I've been really looking forward to this conversation! I've been doing a lot of reading about Japan before my trip and I have so many questions.\n\nWhere should I start? I suppose my biggest question is: what do Japanese people most want visitors to understand about Japan that they often get wrong?`;
  }

  // Context-sensitive responses
  if (lastUser.includes('sacred') || lastUser.includes('holy') || lastUser.includes('spiritual')) {
    return `That's fascinating. So it's like the mountain itself is divine — not a place where gods live, but the *mountain is* a god. That's so different from how we think about sacred mountains in the West, where they're sacred *because* of what happened there, not because of what they *are*.\n\nI have to ask — you mentioned people used to climb it as a religious act. Do modern Japanese people still feel that spiritual connection when they climb, or has it become more of a physical challenge, like hiking Mount Everest base camp?\n\n[Coach: "I have to ask" is a very natural way to introduce a follow-up question — better than "I want to ask."]`;
  }

  if (lastUser.includes('train') || lastUser.includes('punctual') || lastUser.includes('shinkansen')) {
    return `Thirty-six seconds average delay per year?! That's physically unbelievable to me. A London Underground delay of thirty-six minutes barely makes the news.\n\nBut I want to understand — is this purely an engineering achievement, or is there something *cultural* behind it? Because I noticed on the local train that everyone was completely silent, nobody was on the phone, people apologized if they bumped you accidentally... It feels like the whole society is participating in maintaining this precision somehow.`;
  }

  if (lastUser.includes('tip') || lastUser.includes('omotenashi') || lastUser.includes('service')) {
    return `Wait, so the waiter actually looked *offended* when my husband tried to leave a tip? We weren't trying to be rude — in Canada, not tipping is the rude thing!\n\nBut what you said about service being a matter of personal pride makes so much sense now. The quality of service here is genuinely the best I've ever experienced anywhere in the world, and the fact that it's not transactional makes it feel so much more... sincere?\n\nBut doesn't that system ever get exploited? What stops someone from doing a bad job if there's no financial incentive?`;
  }

  if (lastUser.includes('samurai') || lastUser.includes('bushido') || lastUser.includes('warrior')) {
    return `The comparison to how bushido shaped modern corporate culture is something I hadn't considered at all. The loyalty, the self-sacrifice, the idea that your identity is tied to the group you serve — that's not just historical, is it?\n\nI've been reading about "karoshi" — death from overwork. Do you think that tragic phenomenon is actually a dark legacy of bushido? The samurai were willing to die for their lord; is the modern salaryman willing to die for their company in a similar way?\n\n[Coach: "That's not just historical, is it?" — using a tag question like this is a very natural, engaging way to invite the other person to confirm or deny something.]`;
  }

  if (lastUser.includes('wabi') || lastUser.includes('imperfect') || lastUser.includes('aesthetic')) {
    return `The kintsugi comparison is perfect — fixing broken pottery with gold and making the cracks the most beautiful part. We would never do that in Europe. We would either restore it perfectly or throw it away.\n\nI'm curious: does this aesthetic philosophy affect how Japanese people deal with failure in their personal lives? In France, we have a somewhat romantic relationship with beautiful suffering, but it's different from what you're describing. It seems like wabi-sabi is more... accepting? Less dramatic?`;
  }

  // Generic follow-up responses that keep conversation going
  const followUps = [
    `That's really illuminating. I hadn't thought about it from that angle before.\n\nBut it raises another question for me: does that attitude exist across all generations of Japanese people, or do you notice a difference between older and younger Japanese people in how they relate to these traditions?\n\n[Coach: "That's really illuminating" is a great phrase — more sophisticated than "interesting" or "cool."]`,
    `Okay, that makes complete sense. And it explains something I noticed yesterday that I couldn't explain — I saw a construction site where the workers were doing this elaborate ceremony with salt and sake before starting work. Is that connected to what you're describing?\n\nAlso, I want to make sure I'm understanding correctly — when you say "harmony," does that mean Japanese people never disagree or argue, or is there a specific way disagreement is handled?`,
    `I love that explanation. It's making me see Japan completely differently.\n\nActually, that connects to something my guidebook mentioned but didn't really explain — the concept of "ma" or negative space. Is that related to what you're talking about? It seems like Japanese culture is very comfortable with silence and emptiness in a way that Western culture isn't.\n\n[Coach: "It's making me see Japan completely differently" is a lovely way to express that something has changed your perspective.]`,
    `You know, I've been to maybe thirty countries, and nowhere have I felt as safe as I do here. I left my phone on a café table for ten minutes and nobody touched it. Back home that would be gone in thirty seconds.\n\nWhat do you think is the real reason Japan is so safe? Is it cultural? Economic? Related to some of the things you've been explaining about social harmony and group identity?\n\n[Coach: "nowhere have I felt as safe as I do here" — using "nowhere" at the start of a sentence creates a strong, emphatic statement. Very natural in English.]`,
  ];

  return followUps[Math.min(msgCount - 1, followUps.length - 1)] ?? followUps[followUps.length - 1];
}
