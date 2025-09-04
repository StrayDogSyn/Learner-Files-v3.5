// Technical Domain AI Service for StrayDog Syndications
import { aiService } from '../../ai/services/AIService';
export class TechnicalAIService {
    constructor() {
        Object.defineProperty(this, "domain", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 'technical'
        });
    }
    /**
     * Generate code based on requirements
     */
    async generateCode(request, userId, userRole, tier) {
        return await aiService.generateCode(request, userId, userRole, tier);
    }
    /**
     * Generate technical documentation
     */
    async generateTechnicalDocumentation(request, userId, userRole, tier) {
        const prompt = this.buildDocumentationPrompt(request);
        return await aiService.generateContent(prompt, this.domain, 'technical_documentation', userId, userRole, tier);
    }
    /**
     * Perform code review
     */
    async performCodeReview(request, userId, userRole, tier) {
        const prompt = `Perform a comprehensive code review:

Language: ${request.language}
Focus Areas: ${request.focus}
Severity Level: ${request.severity}

Code to Review:
\`\`\`${request.language}
${request.code}
\`\`\`

Please provide a detailed code review that includes:
1. Code quality assessment
2. Security vulnerabilities (if any)
3. Performance optimization opportunities
4. Best practices recommendations
5. Maintainability improvements
6. Specific line-by-line feedback
7. Suggested refactoring
8. Overall rating and summary

Format: Structured code review with categorized findings, severity levels, and actionable recommendations.`;
        return await aiService.generateContent(prompt, this.domain, 'code_review', userId, userRole, tier);
    }
    /**
     * Generate system architecture
     */
    async generateArchitecture(request, userId, userRole, tier) {
        const prompt = `Design system architecture for:

Project Type: ${request.projectType}
Scalability Requirements: ${request.scalability}

Functional Requirements:
${request.requirements.map((req, i) => `• ${req}`).join('\n')}

Constraints:
${request.constraints.map((constraint, i) => `• ${constraint}`).join('\n')}

${request.technologies ? `Preferred Technologies:
${request.technologies.map((tech, i) => `• ${tech}`).join('\n')}` : ''}

Please provide a comprehensive architecture design that includes:
1. High-level system overview
2. Component architecture diagram (textual description)
3. Data flow and integration patterns
4. Technology stack recommendations
5. Scalability considerations
6. Security architecture
7. Deployment strategy
8. Performance optimization
9. Monitoring and observability
10. Risk assessment and mitigation

Format: Detailed architecture document with clear sections, diagrams descriptions, and technical specifications.`;
        return await aiService.generateContent(prompt, this.domain, 'architecture_design', userId, userRole, tier);
    }
    /**
     * Generate API documentation
     */
    async generateAPIDocumentation(endpoints, baseUrl, authentication, userId, userRole, tier) {
        const prompt = `Generate comprehensive API documentation:

Base URL: ${baseUrl}
Authentication: ${authentication}

Endpoints:
${endpoints.map(ep => `
${ep.method.toUpperCase()} ${ep.path}
Description: ${ep.description}
${ep.parameters ? `Parameters: ${JSON.stringify(ep.parameters, null, 2)}` : ''}
${ep.responses ? `Responses: ${JSON.stringify(ep.responses, null, 2)}` : ''}`).join('\n---\n')}

Please create professional API documentation that includes:
1. API overview and introduction
2. Authentication and authorization
3. Base URL and versioning
4. Detailed endpoint documentation
5. Request/response examples
6. Error handling and status codes
7. Rate limiting information
8. SDK and integration examples
9. Testing and debugging tips
10. Changelog and versioning

Format: Complete API documentation suitable for developers with clear examples and comprehensive reference.`;
        return await aiService.generateContent(prompt, this.domain, 'api_documentation', userId, userRole, tier);
    }
    /**
     * Generate test cases
     */
    async generateTestCases(request, userId, userRole, tier) {
        const prompt = `Generate ${request.testType} tests for the following code:

Language: ${request.language}
Test Type: ${request.testType}
Framework: ${request.framework || 'Standard'}
Coverage Level: ${request.coverage}

Code to Test:
\`\`\`${request.language}
${request.code}
\`\`\`

Please generate comprehensive test cases that include:
1. Test setup and teardown
2. Positive test scenarios
3. Negative test scenarios
4. Edge cases and boundary conditions
5. Error handling tests
6. Performance tests (if applicable)
7. Mock and stub implementations
8. Test data and fixtures
9. Assertions and validations
10. Test documentation and comments

Format: Complete test suite with proper structure, clear test names, and comprehensive coverage.`;
        return await aiService.generateContent(prompt, this.domain, 'test_generation', userId, userRole, tier);
    }
    /**
     * Generate deployment guide
     */
    async generateDeploymentGuide(platform, technology, environment, requirements, userId, userRole, tier) {
        const prompt = `Create a deployment guide for:

Platform: ${platform}
Technology: ${technology}
Environment: ${environment}

Requirements:
${requirements.map((req, i) => `• ${req}`).join('\n')}

Please provide a comprehensive deployment guide that includes:
1. Prerequisites and system requirements
2. Environment setup and configuration
3. Step-by-step deployment process
4. Configuration management
5. Database setup and migrations
6. Security considerations
7. Monitoring and logging setup
8. Backup and recovery procedures
9. Troubleshooting common issues
10. Rollback procedures
11. Performance optimization
12. Maintenance and updates

Format: Detailed deployment guide with clear instructions, commands, and best practices.`;
        return await aiService.generateContent(prompt, this.domain, 'deployment_guide', userId, userRole, tier);
    }
    /**
     * Generate technical specification
     */
    async generateTechnicalSpecification(project, features, constraints, integrations, userId, userRole, tier) {
        const prompt = `Create a technical specification for:

Project: ${project}

Features:
${features.map((feature, i) => `• ${feature}`).join('\n')}

Technical Constraints:
${constraints.map((constraint, i) => `• ${constraint}`).join('\n')}

Required Integrations:
${integrations.map((integration, i) => `• ${integration}`).join('\n')}

Please provide a comprehensive technical specification that includes:
1. Project overview and objectives
2. Functional requirements
3. Non-functional requirements
4. System architecture overview
5. Technology stack and dependencies
6. Data models and schemas
7. API specifications
8. Security requirements
9. Performance requirements
10. Integration specifications
11. Testing strategy
12. Deployment requirements
13. Maintenance and support

Format: Professional technical specification document with clear structure and detailed requirements.`;
        return await aiService.generateContent(prompt, this.domain, 'technical_specification', userId, userRole, tier);
    }
    /**
     * Generate database schema
     */
    async generateDatabaseSchema(entities, database, userId, userRole, tier) {
        const prompt = `Generate database schema for ${database}:

Entities:
${entities.map(entity => `
${entity.name}:
Fields:
${entity.fields.map(field => `  • ${field.name}: ${field.type}${field.constraints ? ` (${field.constraints.join(', ')})` : ''}`).join('\n')}
${entity.relationships ? `Relationships:
${entity.relationships.map(rel => `  • ${rel.type} ${rel.target}: ${rel.description}`).join('\n')}` : ''}`).join('\n---\n')}

Please generate a comprehensive database schema that includes:
1. Complete DDL statements
2. Table definitions with proper data types
3. Primary and foreign key constraints
4. Indexes for performance optimization
5. Check constraints and validations
6. Triggers (if applicable)
7. Views for common queries
8. Stored procedures (if applicable)
9. Security and permissions
10. Migration scripts
11. Sample data inserts
12. Documentation and comments

Format: Complete database schema with SQL statements, documentation, and best practices.`;
        return await aiService.generateContent(prompt, this.domain, 'database_schema', userId, userRole, tier);
    }
    // Private helper methods
    buildDocumentationPrompt(request) {
        let prompt = `Create ${request.type.replace('_', ' ')} documentation:

Project: ${request.project}
Technology: ${request.technology}
Audience: ${request.audience}
Complexity Level: ${request.complexity}
`;
        if (request.sections && request.sections.length > 0) {
            prompt += `\nRequired Sections:
${request.sections.map((section, i) => `• ${section}`).join('\n')}`;
        }
        prompt += `\nCode Examples: ${request.codeExamples ? 'Include' : 'Exclude'}`;
        prompt += `\n\nPlease create comprehensive technical documentation that:
1. Targets ${request.audience} effectively
2. Maintains ${request.complexity} complexity level
3. Provides clear, actionable information
4. Includes proper structure and navigation
5. Demonstrates best practices
6. Includes troubleshooting guidance`;
        if (request.codeExamples) {
            prompt += `\n7. Provides relevant code examples and snippets`;
        }
        return prompt;
    }
}
// Export singleton instance
export const technicalAIService = new TechnicalAIService();
//# sourceMappingURL=TechnicalAIService.js.map