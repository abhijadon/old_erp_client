import React, { useCallback, useEffect, useState } from 'react';
import { useFetch } from '@/hooks/useFetch';
import { request } from '@/request';
import { ResponsiveContainer, PieChart, Pie, Tooltip, Legend, Cell } from 'recharts';
import { scaleOrdinal } from 'd3-scale';
import { schemeCategory10 } from 'd3-scale-chromatic';
import { Dropdown, Menu, Button, Table, Card } from 'antd';
import { VscSettings } from "react-icons/vsc";
import { useSelector } from 'react-redux';
import { selectCreatedItem } from '@/redux/crud/selectors';
import { BiReset } from "react-icons/bi";

const Index = () => {
  const { isSuccess } = useSelector(selectCreatedItem);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [userNames, setUserNames] = useState([]);
  const [data, setData] = useState([]);

  const fetchPaymentData = useCallback(() => request.filter({ entity: 'payment' }), []);

  const { data: paymentResult } = useFetch(fetchPaymentData);

  useEffect(() => {
    if (paymentResult?.result) {
      setData(paymentResult.result);
      const uniqueUserNames = [...new Set(paymentResult.result.map(item => item.userId?.fullname))];
      setUserNames(uniqueUserNames);
    }
  }, [paymentResult]);

  const resetValues = () => {
    setSelectedUserId(null);
  };

  const filteredData = selectedUserId
    ? data.filter(item => item.userId?.fullname.toLowerCase() === selectedUserId.toLowerCase())
    : data;

  const userDataCount = {};
  filteredData.forEach((payment) => {
    const userName = payment.userId?.fullname;
    userDataCount[userName] = (userDataCount[userName] || 0) + 1;
  });

  const capitalizeWords = (str) => {
    return str.replace(/\b\w/g, (match) => match.toUpperCase());
  };

  const chartData = Object.keys(userDataCount)
    .map((userName) => ({
      name: capitalizeWords(userName),
      count: userDataCount[userName],
    }))
    .sort((a, b) => b.count - a.count);

  const colorScale = scaleOrdinal(schemeCategory10);

  const menu = (
    <Menu>
      {userNames.map((userName) => (
        <Menu.Item key={userName} onClick={() => setSelectedUserId(userName)}>
          {userName}
        </Menu.Item>
      ))}
    </Menu>
  );

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: text => <span style={{ fontWeight: 'bold' }}>{text}</span>,
    },
    {
      title: 'Count',
      dataIndex: 'count',
      key: 'count',
      render: text => <span style={{ color: '#8884d8' }}>{text}</span>,
    },
  ];

  return (
    <Card style={{ fontFamily: 'Arial, sans-serif', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px' }}>
        <Dropdown overlay={menu} placement="bottomLeft" arrow>
          <Button type="primary" icon={<VscSettings />} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            Filter
          </Button>
        </Dropdown>
        <Button type="primary" icon={<BiReset />} onClick={resetValues}>
          Reset
        </Button>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', padding: '16px' }}>
        <ResponsiveContainer width="50%" height={400}>
          <PieChart>
            <Tooltip
              contentStyle={{ backgroundColor: '#fff', border: '1px solid #e0e0e0', borderRadius: '4px', fontSize: 12 }}
              labelStyle={{ backgroundColor: 'gray', color: '#fff', borderRadius: '2px' }}
            />
            <Pie
              data={chartData}
              dataKey="count"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={120}
              label
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colorScale(index)} />
              ))}
            </Pie>
            <Legend
              layout="vertical"
              verticalAlign="middle"
              align="right"
              wrapperStyle={{ maxWidth: '200px' }}
            />
          </PieChart>
        </ResponsiveContainer>
        <Table
          columns={columns}
          dataSource={chartData}
          pagination={true}
          style={{ width: '50%', marginTop: '20px', marginLeft: '20px' }}
          size="small"
        />
      </div>
    </Card>
  );
};

export default Index;
