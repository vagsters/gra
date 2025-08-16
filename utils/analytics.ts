import type { AnalyticsEvent } from '../types';

export const downloadAnalyticsData = (analytics: AnalyticsEvent[]): void => {
    if (!analytics || analytics.length === 0) {
        alert("No analytics data to download.");
        return;
    }

    try {
        const jsonString = JSON.stringify(analytics, null, 2);
        const blob = new Blob([jsonString], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `cosmic_clicker_analytics_${new Date().toISOString()}.json`;
        document.body.appendChild(a);
        a.click();
        
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

    } catch (error) {
        console.error("Failed to create or download analytics file:", error);
        alert("An error occurred while trying to download the analytics data.");
    }
};
