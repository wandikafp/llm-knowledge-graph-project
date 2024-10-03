import { Controller, Get } from '@nestjs/common';
import { GraphDbService } from './graph-db.service';

@Controller('graph')
export class GraphDbController {
    constructor(private readonly graphDbService: GraphDbService) {}

    @Get()
    async getGraph() {
        const graph = await this.graphDbService.getGraph();
        return { graph }
    }
}
