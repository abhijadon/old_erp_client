import React, { useEffect, useState } from 'react';
import { Select, Spin, Button, message, Form } from 'antd';
import { request } from '@/request';

const { Option } = Select;

const UpdatePermissionAllowed = ({ onClose, onFormSubmit, selectedRecord }) => {
    const [userList, setUserList] = useState([]);
    const [instituteList, setInstituteList] = useState([]);
    const [universityList, setUniversityList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [form] = Form.useForm();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const usersResponse = await request.list({ entity: 'admin' });
                const institutesResponse = await request.list({ entity: 'institute' });
                const universitiesResponse = await request.list({ entity: 'university' });

                setUserList(usersResponse.result);
                setInstituteList(institutesResponse.result);
                setUniversityList(universitiesResponse.result);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleFinish = async (values) => {
        try {
            await request.update({ entity: 'allow', id: selectedRecord._id, jsonData: values });
            onFormSubmit(); // Trigger reload in parent component
            onClose(); // Close the form
        } catch (error) {
            message.error('Failed to update record');
        }
    };

    if (isLoading) {
        return <div><Spin /></div>;
    }

    return (
        <Form form={form} layout="vertical" onFinish={handleFinish} initialValues={selectedRecord}>
            <Form.Item label="Users" name="userId">
                <Select
                    placeholder="Select users"
                    showSearch
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                        option.children.toLowerCase().includes(input.toLowerCase())
                    }
                >
                    {userList.map(user => (
                        <Option key={user._id} value={user._id}>{user.fullname}</Option>
                    ))}
                </Select>
            </Form.Item>
            <Form.Item label="Institute" name="allowedInstitutes">
                <Select
                    mode="multiple"
                    placeholder="Select institutes"
                    showSearch
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                        option.children.toLowerCase().includes(input.toLowerCase())
                    }
                >
                    {instituteList.map(ins => (
                        <Option key={ins._id} value={ins._id}>{ins.name}</Option>
                    ))}
                </Select>
            </Form.Item>
            <Form.Item label="University" name="allowedUniversities">
                <Select
                    mode="multiple"
                    placeholder="Select universities"
                    showSearch
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                        option.children.toLowerCase().includes(input.toLowerCase())
                    }
                >
                    {universityList.map(uni => (
                        <Option key={uni._id} value={uni._id}>{uni.name}</Option>
                    ))}
                </Select>
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit">
                    Submit
                </Button>
            </Form.Item>
        </Form>
    );
};

export default UpdatePermissionAllowed;
