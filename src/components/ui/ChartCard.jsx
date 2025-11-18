import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';

const ChartCard = ({ title, data, type = 'bar', dataKeyX, dataKeyY, pieDataKey, pieNameKey, colors }) => {
  const renderChart = () => {
    if (!data || data.length === 0) {
      return <p className="text-center" style={{ color: 'var(--color-muted)' }}>No data to display.</p>;
    }

    if (type === 'bar') {
      return (
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={data}>
            <XAxis dataKey={dataKeyX} stroke="var(--color-muted)" />
            <YAxis stroke="var(--color-muted)" />
            <Tooltip cursor={{ fill: 'rgba(0,0,0,0.05)' }} contentStyle={{ backgroundColor: 'var(--color-ink)', borderColor: 'var(--color-ink)', color: 'var(--color-text-light)' }} />
            <Legend />
            {dataKeyY && Array.isArray(dataKeyY) ? (
              dataKeyY.map((key, index) => (
                <Bar key={key} dataKey={key} fill={colors[index % colors.length]} />
              ))
            ) : (
              <Bar dataKey={dataKeyY} fill={colors[0]} />
            )}
          </BarChart>
        </ResponsiveContainer>
      );
    } else if (type === 'pie') {
      return (
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={data}
              dataKey={pieDataKey}
              nameKey={pieNameKey}
              cx="50%"
              cy="50%"
              outerRadius={80}
              fill="#8884d8"
              label
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            <Tooltip contentStyle={{ backgroundColor: 'var(--color-ink)', borderColor: 'var(--color-ink)', color: 'var(--color-text-light)' }} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      );
    }
    return <p>Unsupported chart type.</p>;
  };

  return (
    <div className="chart-card">
      <h5>{title}</h5>
      {renderChart()}
    </div>
  );
};

export default ChartCard;