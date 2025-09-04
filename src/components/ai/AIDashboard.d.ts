import React from 'react';
import { UserRole, RateLimitTier } from '../../shared/types/ai';
interface DashboardProps {
    userId: string;
    userRole?: UserRole;
    tier?: RateLimitTier;
    className?: string;
}
export declare const AIDashboard: React.FC<DashboardProps>;
export default AIDashboard;
//# sourceMappingURL=AIDashboard.d.ts.map