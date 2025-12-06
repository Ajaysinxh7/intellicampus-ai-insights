export interface RegressionData {
    attendancePercentage: number;
    finalGrade: number;
}

export function calculateRegression(data: RegressionData[]) {
    const n = data.length;
    if (n < 2) return { slope: 0, intercept: 0 }; // Not enough data

    let sumX = 0;
    let sumY = 0;
    let sumXY = 0;
    let sumXX = 0;

    for (const record of data) {
        sumX += record.attendancePercentage;
        sumY += record.finalGrade;
        sumXY += (record.attendancePercentage * record.finalGrade);
        sumXX += (record.attendancePercentage * record.attendancePercentage);
    }

    // Avoid division by zero
    const denominator = (n * sumXX - sumX * sumX);
    if (denominator === 0) return { slope: 0, intercept: 0 };

    const slope = (n * sumXY - sumX * sumY) / denominator;
    const intercept = (sumY - slope * sumX) / n;

    return { slope, intercept };
}
