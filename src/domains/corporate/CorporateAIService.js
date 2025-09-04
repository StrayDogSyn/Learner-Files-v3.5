// Corporate Domain AI Service for StrayDog Syndications
import { aiService } from '../../ai/services/AIService';
export class CorporateAIService {
    constructor() {
        Object.defineProperty(this, "domain", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 'corporate'
        });
    }
    /**
     * Generate corporate content
     */
    async generateCorporateContent(request, userId, userRole, tier) {
        const prompt = this.buildCorporateContentPrompt(request);
        return await aiService.generateContent(prompt, this.domain, 'corporate_content', userId, userRole, tier);
    }
    /**
     * Generate executive summary
     */
    async generateExecutiveSummary(topic, keyMetrics, objectives, userId, userRole, tier) {
        const prompt = `Create an executive summary for: ${topic}

Key Metrics:
${this.formatMetrics(keyMetrics)}

Objectives:
${objectives.map((obj, i) => `${i + 1}. ${obj}`).join('\n')}

Please provide a comprehensive executive summary that:
1. Highlights key achievements and metrics
2. Outlines strategic objectives
3. Demonstrates leadership and vision
4. Maintains professional corporate tone
5. Includes actionable insights

Format: Professional executive summary with clear sections and compelling narrative.`;
        return await aiService.generateContent(prompt, this.domain, 'executive_summary', userId, userRole, tier);
    }
    /**
     * Generate leadership profile
     */
    async generateLeadershipProfile(leader, userId, userRole, tier) {
        const prompt = `Create a leadership profile for:

Position: ${leader.position}
Vision: ${leader.vision}

Experience:
${leader.experience.map((exp, i) => `• ${exp}`).join('\n')}

Key Achievements:
${leader.achievements.map((ach, i) => `• ${ach}`).join('\n')}

Expertise Areas:
${leader.expertise.map((exp, i) => `• ${exp}`).join('\n')}

Please create a compelling leadership profile that:
1. Showcases expertise and experience
2. Highlights key achievements
3. Communicates vision and leadership style
4. Maintains authoritative yet approachable tone
5. Demonstrates thought leadership

Format: Professional biography suitable for corporate website or investor materials.`;
        return await aiService.generateContent(prompt, this.domain, 'leadership_content', userId, userRole, tier);
    }
    /**
     * Generate investor update
     */
    async generateInvestorUpdate(quarter, metrics, highlights, challenges, outlook, userId, userRole, tier) {
        const prompt = `Create an investor update for ${quarter}:

Financial Metrics:
${this.formatMetrics(metrics)}

Key Highlights:
${highlights.map((highlight, i) => `• ${highlight}`).join('\n')}

Challenges Addressed:
${challenges.map((challenge, i) => `• ${challenge}`).join('\n')}

Future Outlook:
${outlook}

Please provide a comprehensive investor update that:
1. Presents financial performance clearly
2. Highlights strategic achievements
3. Addresses challenges transparently
4. Communicates future growth potential
5. Maintains investor confidence
6. Includes relevant market context

Format: Professional investor communication with executive summary, detailed sections, and forward-looking statements.`;
        return await aiService.generateContent(prompt, this.domain, 'investor_update', userId, userRole, tier);
    }
    /**
     * Generate strategic plan content
     */
    async generateStrategicPlan(timeframe, objectives, initiatives, resources, metrics, userId, userRole, tier) {
        const prompt = `Develop a strategic plan for ${timeframe}:

Strategic Objectives:
${objectives.map((obj, i) => `${i + 1}. ${obj}`).join('\n')}

Key Initiatives:
${initiatives.map((init, i) => `• ${init}`).join('\n')}

Required Resources:
${resources.map((res, i) => `• ${res}`).join('\n')}

Success Metrics:
${metrics.map((metric, i) => `• ${metric}`).join('\n')}

Please create a comprehensive strategic plan that:
1. Clearly defines objectives and outcomes
2. Outlines actionable initiatives
3. Identifies resource requirements
4. Establishes measurable success criteria
5. Demonstrates strategic thinking
6. Aligns with corporate vision

Format: Executive strategic plan with clear structure, timelines, and accountability measures.`;
        return await aiService.generateContent(prompt, this.domain, 'strategic_plan', userId, userRole, tier);
    }
    /**
     * Generate press release
     */
    async generatePressRelease(announcement, details, quotes, contact, userId, userRole, tier) {
        const prompt = `Create a press release for:

Announcement: ${announcement}

Key Details:
${details.map((detail, i) => `• ${detail}`).join('\n')}

Executive Quotes:
${quotes.map(q => `"${q.quote}" - ${q.speaker}, ${q.role}`).join('\n\n')}

Media Contact:
${contact.name}\n${contact.email}\n${contact.phone}

Please create a professional press release that:
1. Follows standard press release format
2. Includes compelling headline and subheadline
3. Provides clear, newsworthy information
4. Incorporates executive quotes effectively
5. Maintains professional media tone
6. Includes proper contact information

Format: Standard press release with dateline, headline, body paragraphs, quotes, and boilerplate.`;
        return await aiService.generateContent(prompt, this.domain, 'press_release', userId, userRole, tier);
    }
    /**
     * Generate company announcement
     */
    async generateCompanyAnnouncement(type, subject, message, action, userId, userRole, tier, deadline) {
        const prompt = `Create a ${type} company announcement:

Subject: ${subject}
Message: ${message}
Required Action: ${action}
${deadline ? `Deadline: ${deadline}` : ''}

Please create a clear company announcement that:
1. Communicates the message effectively
2. Specifies required actions clearly
3. Maintains appropriate tone for audience
4. Includes relevant deadlines or timelines
5. Demonstrates leadership communication
6. Encourages engagement and compliance

Format: Professional company communication with clear structure and call-to-action.`;
        return await aiService.generateContent(prompt, this.domain, 'company_announcement', userId, userRole, tier);
    }
    /**
     * Generate corporate vision statement
     */
    async generateVisionStatement(industry, values, goals, impact, userId, userRole, tier) {
        const prompt = `Create a corporate vision statement for a ${industry} company:

Core Values:
${values.map((value, i) => `• ${value}`).join('\n')}

Long-term Goals:
${goals.map((goal, i) => `• ${goal}`).join('\n')}

Desired Impact: ${impact}

Please create an inspiring vision statement that:
1. Reflects core company values
2. Articulates long-term aspirations
3. Demonstrates commitment to impact
4. Inspires stakeholders and employees
5. Differentiates from competitors
6. Remains memorable and actionable

Format: Concise, powerful vision statement with supporting narrative.`;
        return await aiService.generateContent(prompt, this.domain, 'vision_statement', userId, userRole, tier);
    }
    // Private helper methods
    buildCorporateContentPrompt(request) {
        const lengthGuide = {
            brief: '200-300 words',
            standard: '400-600 words',
            detailed: '800-1200 words'
        };
        let prompt = `Create ${request.type.replace('_', ' ')} content:

Topic: ${request.topic}
Audience: ${request.audience}
Tone: ${request.tone}
Length: ${lengthGuide[request.length]}
`;
        if (request.keyPoints && request.keyPoints.length > 0) {
            prompt += `\nKey Points to Include:
${request.keyPoints.map((point, i) => `• ${point}`).join('\n')}`;
        }
        if (request.callToAction) {
            prompt += `\nCall to Action: ${request.callToAction}`;
        }
        prompt += `\n\nPlease create professional corporate content that:
1. Maintains ${request.tone} tone throughout
2. Targets ${request.audience} effectively
3. Communicates key messages clearly
4. Demonstrates thought leadership
5. Aligns with corporate brand standards
6. Includes compelling narrative structure`;
        if (request.callToAction) {
            prompt += `\n7. Incorporates clear call-to-action`;
        }
        return prompt;
    }
    formatMetrics(metrics) {
        const formatted = [];
        if (metrics.revenue)
            formatted.push(`• Revenue: $${metrics.revenue.toLocaleString()}`);
        if (metrics.growth)
            formatted.push(`• Growth: ${metrics.growth}%`);
        if (metrics.employees)
            formatted.push(`• Employees: ${metrics.employees.toLocaleString()}`);
        if (metrics.clients)
            formatted.push(`• Clients: ${metrics.clients.toLocaleString()}`);
        if (metrics.projects)
            formatted.push(`• Projects: ${metrics.projects.toLocaleString()}`);
        if (metrics.satisfaction)
            formatted.push(`• Client Satisfaction: ${metrics.satisfaction}%`);
        return formatted.length > 0 ? formatted.join('\n') : '• Metrics to be provided';
    }
}
// Export singleton instance
export const corporateAIService = new CorporateAIService();
//# sourceMappingURL=CorporateAIService.js.map