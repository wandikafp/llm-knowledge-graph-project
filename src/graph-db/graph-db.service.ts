import { Injectable, Logger } from '@nestjs/common';
import neo4j from 'neo4j-driver'

@Injectable()
export class GraphDbService {
  private driver;
  constructor() {
    const uri = process.env.NEO4J_URI || 'neo4j://localhost:7687';
    const user = process.env.NEO4J_USER || 'neo4j';
    const password = process.env.NEO4J_PASSWORD || 'test_password';

    this.driver = neo4j.driver(uri, neo4j.auth.basic(user, password));
  }

  async getGraph(): Promise<any> {
    try {
      const result = await this.driver.session().run('MATCH (n)-[r]->(m) RETURN n, r, m', {});
      const nodes = [];
      const relationships = [];
      result.records.map(record => {
        const source = record.get('n');
        const relationship = record.get('r').type;
        const target = record.get('m');

        if (!nodes.some(node => node.properties.name === source.properties.name)) {
          const { labels, properties } = source;
          nodes.push({labels, properties});
        } 
        if (!nodes.some(node => node.properties.name === target.properties.name)) {
          const { labels, properties } = target;
          nodes.push({labels, properties});
        }
        relationships.push({
          source: source.properties.name,
          target: target.properties.name,
          relationship,
        })
      });
      return {nodes, relationships};
    } finally {
      await this.driver.session().close();
    }
  }

  async addNode(label: string, properties: Record<string, any>) {
    try {
      let chipher = `CREATE (n:${label} `;

      const propertyConditions = Object.keys(properties).map(key => {
          const value = properties[key];
          const formattedValue = typeof value === 'string' ? `'${value}'` : value;
          return `n.${key} = ${formattedValue}`;
      });
      chipher += propertyConditions.join(', ') + `) RETURN n`;
      const result = await this.driver.session().run(chipher);
      return result.record[0];
    } finally {
      await this.driver.session().close();
    }
  }

  async createRelationship(
    node1Label: string,
    node1Name: string,
    relationshipType: string,
    node2Label: string,
    node2Name: string
  ) {
    let chiper = `MATCH (n1:${node1Label} {name: "${node1Name}"}), (n2:${node2Label} {name: "${node2Name}"})
       CREATE (n1)-[r:${relationshipType}]->(n2)
       RETURN r`;
    const result = await this.driver.session().run(chiper);
    return result.records[0];
  }

  async findOrCreateNode(label: string, properties: Record<string, any>) {
    let chipher = `MERGE (n:${label} {name: "${properties.name}"}`;

    const propertyConditions = Object.keys(properties).map(key => {
        const value = properties[key];
        const formattedValue = typeof value === 'string' ? `'${value}'` : value;
        return `n.${key} = ${formattedValue}`;
    });
    chipher += `) SET ` + propertyConditions.join(', ');
    const result = await this.driver.session().run(chipher);
    return result.records[0];
  }
}
