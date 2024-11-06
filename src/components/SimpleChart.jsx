import React from 'react';

function SimpleChart({ data, maxValue }) {
    const width = 600, height = 300, padding = 40;
    const chartWidth = width - (padding * 2), chartHeight = height - (padding * 2);
    const xStep = chartWidth / (data.length - 1);
    const yScale = chartHeight / maxValue;

    const generatePoints = valueKey => data.map((point, index) => ({
        x: padding + (index * xStep),
        y: height - padding - (point[valueKey] * yScale)
    }));

    const createPath = points => points.map((point, index) =>
        (index === 0 ? 'M' : 'L') + `${point.x},${point.y}`).join(' ');

    const countPoints = generatePoints('count');
    const limitPoints = generatePoints('limit');

    return (
        <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
            {/* Grid lines and y-axis labels */}
            {[...Array(6)].map((_, i) => (
                <g key={i}>
                    <line x1={padding} y1={height - padding - (i * chartHeight / 5)}
                        x2={width - padding} y2={height - padding - (i * chartHeight / 5)}
                        stroke="#e2e8f0" strokeDasharray="4 4" />
                    <text x={padding - 10} y={height - padding - (i * chartHeight / 5)}
                        className="text-xs fill-gray-500" textAnchor="end" alignmentBaseline="middle">
                        {Math.round(i * maxValue / 5)}
                    </text>
                </g>
            ))}

            {/* X-axis labels */}
            {data.map((point, i) => (
                <text key={i} x={padding + (i * xStep)} y={height - padding + 20}
                    className="text-xs fill-gray-500" textAnchor="middle">
                    {point.date}
                </text>
            ))}

            {/* Limit line (dashed) */}
            <path d={createPath(limitPoints)} fill="none" stroke="#94a3b8" strokeWidth="2" strokeDasharray="5 5" />

            {/* Data line */}
            <path d={createPath(countPoints)} fill="none" stroke="#3b82f6" strokeWidth="2" />

            {/* Data points */}
            {countPoints.map((point, i) => (
                <circle key={i} cx={point.x} cy={point.y} r="4" fill="#3b82f6" />
            ))}
        </svg>
    );
}

export default SimpleChart;
