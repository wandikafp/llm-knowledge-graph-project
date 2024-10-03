import { Controller, Post, Body } from '@nestjs/common';
import { LlmService } from './llm.service'

@Controller('query')
export class LlmController {
    constructor(
        private readonly llmService: LlmService,
    ) {}

    @Post()
    async handleQuery(
        @Body('query') query: string,
        @Body('addToGraph') addToGraph: boolean
    ) {
        const response = await this.llmService.sendQueryToLLM(query, addToGraph);
        return { response };
    }
}
