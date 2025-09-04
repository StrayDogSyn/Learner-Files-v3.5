import React from 'react';
import { DomainType } from '../../shared/types/ai';
interface AIPromptBuilderProps {
    className?: string;
    domain: DomainType;
    onPromptGenerated?: (prompt: string) => void;
    initialTemplate?: string;
    showTemplates?: boolean;
}
export declare const AIPromptBuilder: React.FC<AIPromptBuilderProps>;
export default AIPromptBuilder;
//# sourceMappingURL=AIPromptBuilder.d.ts.map