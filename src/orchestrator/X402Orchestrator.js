// X402-style Orchestration Engine
// Manages the workflow of content generation requests

class X402Orchestrator {
    constructor() {
        this.workflows = new Map();
        this.activeJobs = new Map();
    }

    // Register a new workflow
    registerWorkflow(name, steps) {
        this.workflows.set(name, steps);
        console.log(`Workflow '${name}' registered with ${steps.length} steps`);
    }

    // Execute a workflow
    async executeWorkflow(workflowName, payload) {
        const jobId = this.generateJobId();
        const workflow = this.workflows.get(workflowName);
        
        if (!workflow) {
            throw new Error(`Workflow '${workflowName}' not found`);
        }

        console.log(`Starting workflow '${workflowName}' with job ID: ${jobId}`);
        
        const job = {
            id: jobId,
            workflow: workflowName,
            status: 'running',
            startTime: new Date(),
            payload: payload,
            results: {}
        };

        this.activeJobs.set(jobId, job);

        try {
            // Execute each step in sequence
            for (let i = 0; i < workflow.length; i++) {
                const step = workflow[i];
                console.log(`Executing step ${i + 1}: ${step.name}`);
                
                const stepResult = await step.execute(payload, job.results);
                job.results[step.name] = stepResult;
                
                // Update job status
                job.status = `completed_step_${i + 1}`;
            }

            job.status = 'completed';
            job.endTime = new Date();
            console.log(`Workflow '${workflowName}' completed successfully`);
            
            return job;
        } catch (error) {
            job.status = 'failed';
            job.error = error.message;
            console.error(`Workflow '${workflowName}' failed:`, error.message);
            throw error;
        }
    }

    // Get job status
    getJobStatus(jobId) {
        return this.activeJobs.get(jobId);
    }

    // Generate unique job ID
    generateJobId() {
        return `x402_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    // List all workflows
    listWorkflows() {
        return Array.from(this.workflows.keys());
    }
}

module.exports = X402Orchestrator;
