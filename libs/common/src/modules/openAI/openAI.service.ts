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

  public async recommendDescription(
    title: string,
    content: string,
    imagePath: string,
  ): Promise<string> {
    const response = await this.client.responses.create({
      model: 'gpt-5-mini',
      instructions:
        '당신은 매력적인 매거진 설명을 작성하는 전문 카피라이터입니다. 독자의 흥미를 유발할 수 있도록 간결하고 핵심적인 문장을 만듭니다.',
      input: [
        {
          role: 'user',
          content: [
            {
              type: 'input_text',
              text: `제목: ${title}\n내용: ${content.slice(0, 200)}\n위 정보를 바탕으로 한글로 한 문장만 추천해줘.`,
            },
            {
              type: 'input_image',
              image_url: imagePath,
              detail: 'low',
            },
          ],
        },
      ],
    });

    return response.output_text;
  }
}
