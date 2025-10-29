import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';

@Injectable()
export class OpenAIService {
  private readonly apiKey: string;
  private readonly client: OpenAI;

  constructor(private readonly configService: ConfigService) {
    this.apiKey = this.configService.get<string>('OPENAI_API_KEY') || '';
    this.client = new OpenAI({ apiKey: this.apiKey });
  }

  public async recommendDescription(title: string, content: string) {
    console.log(title, content);
    const completion = await this.client.chat.completions.create({
      model: 'gpt-5-mini',
      messages: [
        {
          role: 'system',
          content:
            '당신은 매력적인 매거진 설명을 작성하는 전문 카피라이터입니다. 독자의 흥미를 유발할 수 있도록 간결하고 핵심적인 문장을 만듭니다.',
        },
        {
          role: 'user',
          content: `다음 매거진의 제목과 내용을 바탕으로, 독자에게 소개할 간략한 설명(1문장)을 추천해 주세요.

- 제목: ${title}
- 주요 내용: ${content}`,
        },
      ],
      // max_completion_tokens: 150,
      n: 1,
    });

    console.log(completion.choices[0]);
    console.log(completion.choices[0].message);
    console.log(completion.choices[0].message.content);
    console.log(completion);

    return completion.choices[0].message.content;
  }
}
