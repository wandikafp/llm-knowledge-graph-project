import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { AzureOpenAI } from 'openai';
import { GraphDbService } from './../graph-db/graph-db.service';

@Injectable()
export class LlmService {
    private readonly logger = new Logger(LlmService.name);
    private readonly apiKey = process.env.AZURE_OPENAI_API_KEY;
    private readonly endpoint = process.env.AZURE_OPENAI_ENDPOINT;
    private readonly apiVersion = '2023-05-15';
    private readonly deployment = process.env.AZURE_OPENAI_DEPLOYMENT_NAME;

    private azureOpenAIclient: AzureOpenAI;
    
    constructor(private graphDbService: GraphDbService) {
        this.azureOpenAIclient = new AzureOpenAI({ endpoint: this.endpoint, apiKey: this.apiKey, apiVersion: this.apiVersion, deployment: this.deployment});
    }
    
    async sendQueryToLLM(query: string, addToGraph: boolean): Promise<string> {
        try {
            const response = await this.azureOpenAIclient.chat.completions.create({
                messages: [
                    { role: 'user', content: query},
                ],
                model: "",
            })
            if (addToGraph) {
                await this.generateKnowledgeGraph(response.choices[0].message.content);
            }
            return response.choices[0].message.content;
        } catch (error) {
            this.logger.log('Error fetching data from LLM API: ', error.stack);
            throw new HttpException('Failed to communicate with LLM.', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async generateKnowledgeGraph(llmResponse: string): Promise<void> {
        try {
            const prompt = `
            Convert the following response into structured data for a knowledge graph that will be inserted to Neo4J database.
            Identify key entities and relationships in the format of JSON objects containing "entities" and "relationships".
            For each entities it is mandatory to has label (that will become Neo4J database label) with Camel-case, beginning with an upper-case character.
            For each entities it is mandatory to has name.
            For each relationships it is mandatory to has fromLabel, fromName, relationshipType, toLabel, and toName.
            And foreach relationshipType must be Upper-case, using underscore to separate words
            Return the result as JSON without any explanations or additional text.
            Response: "${llmResponse}"
            `;
            const response = await this.azureOpenAIclient.chat.completions.create({
                messages: [
                    { role: 'system', content: 'You are a knowledge graph extractor.' },
                    { role: 'user', content: prompt },
                ],
                model: "",
            })
            const structuredData = response.choices[0].message.content;

            // Parse the JSON for entities and relationships
            const parsedData = JSON.parse(structuredData);
            const { entities, relationships } = parsedData;

            // Create or update nodes based on entities
            if (this.isIterable(entities)) {
                for (const entity of entities) {
                    const { label, ...withoutLabel} = entity;
                    entity.label = entity.label.replace(/\s+/g, '_');
                    await this.graphDbService.findOrCreateNode(entity.label, { ...withoutLabel });
                }
            } else {
                const { type, ...withoutType} = entities;
                entities.label = entities.label.replace(/\s+/g, '_');
                await this.graphDbService.findOrCreateNode(entities.label, { ...withoutType });
            }
            
            if (this.isIterable(relationships)) {
                for (const rel of relationships) {
                    await this.graphDbService.createRelationship(
                        rel.fromLabel,
                        rel.fromName,
                        rel.relationshipType,
                        rel.toLabel,
                        rel.toName,
                    );
                }
            } else {
                await this.graphDbService.createRelationship(
                    relationships.fromLabel,
                    relationships.fromName,
                    relationships.relationshipType,
                    relationships.toLabel,
                    relationships.toName,
                );
            }
            // Create relationships
            
        } catch (error) {
            this.logger.log('Error generating knowledge graph from LLM response: ', error.stack);
        }
    }

    isIterable(obj) {
        if (obj == null) {
            return false;
        }
        return typeof obj[Symbol.iterator] === 'function';
    }
}
