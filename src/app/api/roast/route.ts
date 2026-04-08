import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const apiKey = process.env.SILICONFLOW_API_KEY;

  if (!apiKey) {
    return Response.json(
      { error: "未配置 SILICONFLOW_API_KEY，请在 .env.local 中添加你的 API Key" },
      { status: 501 }
    );
  }

  const { code, language, systemPrompt } = await req.json();

  const response = await fetch("https://api.siliconflow.cn/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "deepseek-ai/DeepSeek-V3",
      stream: true,
      messages: [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content: `请吐槽以下 ${language} 代码：\n\n\`\`\`${language}\n${code}\n\`\`\``,
        },
      ],
    }),
  });

  if (!response.ok || !response.body) {
    return Response.json(
      { error: "SiliconFlow API 请求失败" },
      { status: response.status }
    );
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      let buffer = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          controller.close();
          break;
        }

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed || !trimmed.startsWith("data: ")) continue;

          const data = trimmed.slice(6);
          if (data === "[DONE]") {
            controller.close();
            return;
          }

          try {
            const json = JSON.parse(data);
            const content = json.choices?.[0]?.delta?.content;
            if (content) {
              controller.enqueue(encoder.encode(content));
            }
          } catch {
            // skip malformed chunks
          }
        }
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
