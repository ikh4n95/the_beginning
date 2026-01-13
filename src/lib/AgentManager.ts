export interface AgentTask {
  id: string;
  type: string;
  payload: any;
}

export interface Agent {
  id: string;
  name: string;
  capabilities: string[];
  execute: (task: AgentTask) => Promise<any>;
}

export class AgentManager {
  private agents: Map<string, Agent> = new Map();

  /**
   * Register a new agent with the manager.
   */
  registerAgent(agent: Agent): void {
    if (this.agents.has(agent.id)) {
      throw new Error(`Agent with ID ${agent.id} is already registered.`);
    }
    this.agents.set(agent.id, agent);
    console.log(`Agent registered: ${agent.name} (${agent.id})`);
  }

  /**
   * Unregister an agent.
   */
  unregisterAgent(agentId: string): void {
    if (this.agents.delete(agentId)) {
      console.log(`Agent unregistered: ${agentId}`);
    } else {
      console.warn(`Agent with ID ${agentId} not found.`);
    }
  }

  /**
   * Find an agent capable of handling a specific task type.
   * This is a simple matching strategy; could be enhanced with load balancing, etc.
   */
  findAgentForTask(taskType: string): Agent | undefined {
    const agents = Array.from(this.agents.values());
    for (const agent of agents) {
      if (agent.capabilities.includes(taskType)) {
        return agent;
      }
    }
    return undefined;
  }

  /**
   * Dispatch a task to a suitable agent.
   */
  async dispatchTask(task: AgentTask): Promise<any> {
    console.log(`Manager received task: ${task.type} (ID: ${task.id})`);
    
    const agent = this.findAgentForTask(task.type);
    if (!agent) {
      throw new Error(`No agent found with capability for task type: ${task.type}`);
    }

    console.log(`Dispatching task ${task.id} to agent ${agent.name}...`);
    try {
      const result = await agent.execute(task);
      console.log(`Task ${task.id} completed by ${agent.name}.`);
      return result;
    } catch (error) {
      console.error(`Task ${task.id} failed during execution by ${agent.name}:`, error);
      throw error;
    }
  }

  /**
   * Get all registered agents.
   */
  getRegisteredAgents(): Agent[] {
    return Array.from(this.agents.values());
  }
}
