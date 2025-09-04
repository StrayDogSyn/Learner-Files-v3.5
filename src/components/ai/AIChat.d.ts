import React from 'react';
import { DomainType, UserRole, RateLimitTier } from '../../shared/types/ai';
interface AIChatProps {
    domain: DomainType;
    userId: string;
    userRole?: UserRole;
    tier?: RateLimitTier;
    className?: string;
    placeholder?: string;
    maxHeight?: string;
}
export declare const AIChat: React.FC<AIChatProps>;
export default AIChat;
//# sourceMappingURL=AIChat.d.ts.map