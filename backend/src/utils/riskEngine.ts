export interface RiskProfile {
    riskScore: number; // 0 to 1
    riskLevel: "low" | "medium" | "high";
    reasons: string[];
}

/**
 * Calculates the risk profile for a student based on their academic metrics.
 * 
 * @param attendancePct Overall attendance percentage (0-100)
 * @param averageMarksPct Average marks percentage (0-100)
 * @returns RiskProfile object
 */
export const calculateRisk = (attendancePct: number, averageMarksPct: number): RiskProfile => {
    let score = 0;
    const reasons: string[] = [];

    // 1. Attendance Risk (Weight: 0.5)
    // Critical failing point is often 75%
    if (attendancePct < 60) {
        score += 0.5;
        reasons.push(`Critical Attendance: ${attendancePct}% (Below 60%)`);
    } else if (attendancePct < 75) {
        score += 0.3;
        reasons.push(`Low Attendance: ${attendancePct}% (Below 75%)`);
    }

    // 2. Performance Risk (Weight: 0.5)
    // Failing marks usually < 40 or < 50 depending on institution. 
    // Let's assume < 50 is warning, < 35 is critical.
    if (averageMarksPct < 35) {
        score += 0.5;
        reasons.push(`Critical Grades: ${averageMarksPct}% (Failing)`);
    } else if (averageMarksPct < 50) {
        score += 0.3;
        reasons.push(`Low Grades: ${averageMarksPct}% (Below 50%)`);
    }

    // 3. Normalize score (0 to 1)
    // Max score possible with current logic is 0.5 + 0.5 = 1.0
    score = Math.min(score, 1);

    // 4. Determine Level
    let level: "low" | "medium" | "high" = "low";
    if (score >= 0.7) level = "high";
    else if (score >= 0.3) level = "medium";

    // 5. Explicit Overrides
    // If either metric is critical, force at least High risk
    if (attendancePct < 60 || averageMarksPct < 35) {
        level = "high";
        if (score < 0.7) score = 0.8; // Boost score to reflect urgency
    }

    return {
        riskScore: parseFloat(score.toFixed(2)),
        riskLevel: level,
        reasons
    };
};
