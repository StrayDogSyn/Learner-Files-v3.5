import React from 'react';
import { DomainType } from '../../shared/types/ai';
interface AIDomainSelectorProps {
    selectedDomain: DomainType;
    onDomainChange: (domain: DomainType) => void;
    className?: string;
    variant?: 'dropdown' | 'grid' | 'tabs';
    showDescriptions?: boolean;
}
export declare const AIDomainSelector: React.FC<AIDomainSelectorProps>;
export default AIDomainSelector;
//# sourceMappingURL=AIDomainSelector.d.ts.map