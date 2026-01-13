import { AgentManager, Agent, AgentTask } from './AgentManager';

// 1. Define specific agents
const researchAgent: Agent = {
    id: 'agent-001',
    name: 'ResearchBot',
    capabilities: ['web-search', 'data-analysis'],
    execute: async (task: AgentTask) => {
        console.log(`[ResearchBot] Processing ${task.type}...`);
        // Simulate work
        await new Promise(resolve => setTimeout(resolve, 1000));
        return { summary: 'Found 10 relevant articles.' };
    }
};

const writerAgent: Agent = {
    id: 'agent-002',
    name: 'WriterBot',
    capabilities: ['content-writing'],
    execute: async (task: AgentTask) => {
        console.log(`[WriterBot] Writing content based on: ${JSON.stringify(task.payload)}`);
        return { content: 'Here is the generated blog post...' };
    }
};

async function main() {
    const manager = new AgentManager();

    // 2. Register agents
    manager.registerAgent(researchAgent);
    manager.registerAgent(writerAgent);

    console.log('--- Agents Registered ---');
    console.log(manager.getRegisteredAgents().map(a => a.name));

    // 3. Dispatch tasks
    const searchTask: AgentTask = {
        id: 'task-101',
        type: 'web-search',
        payload: { query: 'Agentic AI trends 2025' }
    };

    try {
        const searchResult = await manager.dispatchTask(searchTask);
        console.log('Search Result:', searchResult);

        const writeTask: AgentTask = {
            id: 'task-102',
            type: 'content-writing',
            payload: { context: searchResult }
        };

        const writeResult = await manager.dispatchTask(writeTask);
        console.log('Write Result:', writeResult);

    } catch (error) {
        console.error('Workflow failed:', error);
    }
}

main();
