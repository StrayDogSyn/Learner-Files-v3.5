// Helper functions to avoid type comparison errors
export const isActiveStatus = (status) => {
    return status === 'busy' || status === 'in_progress';
};
export const isHealthyStatus = (status) => {
    return status === 'healthy';
};
// Factory functions for default values
export const createDefaultSystemHealth = () => ({
    status: 'healthy',
    score: 100,
    health: {
        overall: 100,
        domains: {}
    },
    lastUpdated: new Date(),
    activeIssues: 0
});
export const createDefaultCoordinationState = () => ({
    isActive: false,
    systemHealth: createDefaultSystemHealth(),
    activeTasks: [],
    availableAgents: [],
    lastSync: new Date()
});
// Type guards for runtime safety
export const isSystemHealth = (obj) => {
    return obj && typeof obj.status === 'string' && typeof obj.score === 'number';
};
export const isTask = (obj) => {
    return obj && typeof obj.id === 'string' && typeof obj.title === 'string';
};
export const isAgent = (obj) => {
    return obj && typeof obj.id === 'string' && typeof obj.name === 'string';
};
//# sourceMappingURL=system.js.map