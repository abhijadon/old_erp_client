import React, { useEffect, useState, useCallback } from 'react';
import { Spin } from 'antd';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import axios from 'axios';

const Index = () => {
  const fetchChartData = useCallback(async () => {
    try {
      const response = await axios.get('/chart-data');
      return response.data;
    } catch (error) {
      console.error('Error fetching chart data:', error);
      return { data: [] };
    }
  }, []);

  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const data = await fetchChartData();

      // Process the data to ensure every month is represented
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const processedData = months.map((month) => {
        const found = data.data.find((d) => d.name.startsWith(month));
        return found ? { ...found, name: month } : { name: month, Amount: 0, Count: 0 };
      });

      setChartData(processedData);
      setLoading(false);
    };

    fetchData();
  }, [fetchChartData]);

  return (
    <div style={{ height: 300, fontFamily: 'Arial, sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {loading ? (
        <Spin />  
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={chartData || []}>
            <CartesianGrid strokeDasharray='3 3' stroke="#f0f0f0" />
            <XAxis
              dataKey="name"
              tick={{ fill: '#6e6b7b', fontSize: 12 }}
              axisLine={{ stroke: '#e0e0e0' }}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: '#6e6b7b', fontSize: 12 }}
              axisLine={{ stroke: '#e0e0e0' }}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{ backgroundColor: '#fff', border: '1px solid #e0e0e0', borderRadius: '4px', fontSize: 12 }}
              cursor={{ fill: 'rgba(130, 202, 157, 0.2)' }}
            />
            <Area
              type="natural"
              dataKey="Count"
              stroke="#8884d8"
              fillOpacity={0.3}
              fill="url(#colorAmount)"
            />
            <defs>
              <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                <stop offset="70%" stopColor="#8884d8" stopOpacity={0} />
                <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
              </linearGradient>
            </defs>
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default Index;
