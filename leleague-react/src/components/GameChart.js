import React from "react";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

const GameChart = ({ data }) => {
  const dataWithPercentage = data.map((item) => {
    const percentage = item.value * 10;
    return { ...item, percentage };
  });

  const maxValue = Math.max(
    ...dataWithPercentage.map((item) => item.percentage)
  );

  return (
    <ResponsiveContainer width="100%" height={50 * dataWithPercentage.length}>
      <BarChart
        layout="vertical"
        margin={{ left: -40, right: 0, bottom: 0 }}
        data={dataWithPercentage}
      >
        <CartesianGrid horizontal={false} />
        <XAxis
          type="number"
          tickLine={false}
          axisLine={false}
          tick={false}
          orientation="top"
        />
        <YAxis
          dataKey="game"
          type="category"
          tickLine={false}
        />
        <Bar
          dataKey="percentage"
          label={<CustomBarLabel />}
          minPointSize={10}
          radius={[0, 10, 10, 0]}
        >
          {dataWithPercentage.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={entry.percentage === maxValue ? "#398874" : "#820458"}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

const CustomBarLabel = ({ x, y, width, height, value }) => {
  const labelValue = value.toString().replace("0", "");

  return (
    <text
      x={x + width - 18}
      y={y + height / 2}
      fill="#fff"
      textAnchor="start"
      dominantBaseline="middle"
      fontSize={12}
      className="text-[10px]"
    >
      {labelValue}
    </text>
  );
};

export default GameChart;
