# Knowledge Graph Web Application with LLM Integration

This web application interfaces with a Large Language Model (LLM) to handle user queries and dynamically update a knowledge graph based on the responses. The backend uses **NestJS** and **Neo4j** for knowledge graph management, while the frontend provides an interactive switch to control whether the responses are added to the graph. The application also supports scheduled jobs to periodically review and optimize the graph.

## Features

- **LLM Integration**: Process conversational queries and generate responses using Azure OpenAI's GPT-35-Turbo.
- **Knowledge Graph Management**: Dynamically create and update nodes and edges in Neo4j based on LLM responses.
- **Interactive UI**: A toggle switch in the frontend UI allows users to control whether to add LLM responses to the graph.
- **Scheduled Updates**: Automatically update and optimize the graph based on regular intervals.
  
---

## System Requirements

### Backend

- **Node.js** (v18 or higher)
- **NestJS** (v10 or higher)
- **Neo4j** (v5.7 or higher) with a running Neo4j database instance
- **Azure OpenAI API** access for GPT-based responses
- **TypeScript**
- **Docker**

### Frontend

- **Plain HTML, CSS, JavaScript**

### Other Dependencies

- **Neo4j JavaScript Driver**: For database connection

---

## Installation and Setup
### 1. Backend Setup

#### a. Install Dependencies

Ensure you have **Node.js** installed, then run the following commands to install backend dependencies:

```bash
npm install
```

#### b. Run the Backend Server

Run the NestJS application using docker-compose.

```bash
docker-compose up --build
```

The frontend and backend will be available at `http://localhost:3000`.

#### d. Endpoints Overview

- **POST** `/query`: Processes the user’s query via the LLM and updates the knowledge graph.
- **GET** `/graph`: Return the Graph Object from Neo4J database.

---

## Usage Instructions

1. **Toggle the `addToGraph` Switch**: Open the frontend in your browser and toggle the switch to control whether LLM responses are added to the knowledge graph.
2. **Submit Queries**: You can send POST requests to the `/query` endpoint with the query, and the system will process it through the LLM and update the graph if `addToGraph` is `true`.
3. **Scheduled Graph Updates**: The system will automatically review and optimize the graph periodically, based on the scheduled job.

---

## API Documentation

### 1. Process LLM Query

- **URL**: `/query`
- **Method**: POST
- **Body**: `{ "query": "User's input query", "addToGraph": true | false }`

Example:

```json
{
  "query": "What is the latest information about AI?",
  "addToGraph": true
}
```

The LLM will generate a response, and based on the `addToGraph` toggle, the system will update the knowledge graph accordingly.

### 2. GET graph object

- **URL**: `/graph`
- **Method**: GET

---