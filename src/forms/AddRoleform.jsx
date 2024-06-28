import React, { useEffect, useState } from 'react';
import { Input, Select, Form, Spin, Button, message } from 'antd';
import { request } from '@/request';
import axios from 'axios';
import Cookies from 'js-cookie';


const { Option } = Select;

const AddRoleform = ({ onClose, onFormSubmit }) => {
    const [userList, setUserList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedRole, setSelectedRole] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await request.list({ entity: 'admin' });
                setUserList(response.result);
            } catch (error) {
                console.error('Error fetching user list:', error);
            } finally {
                setIsLoading(false);
            }
        };

        // Fetch data only if userList is empty
        if (userList.length === 0) {
            fetchData();
        }
    }, [userList]);

    const handleRoleChange = (value) => {
        setSelectedRole(value);
    };

    const filteredUserList = () => {
        // Custom logic to filter users based on the selectedRole
        if (selectedRole === 'Admin') {
            return userList.filter(user => user.role === 'admin');
        } else if (selectedRole === 'Sub Admin') {
            return userList.filter(user => user.role === 'subadmin');
        }
        else if (selectedRole === 'Manager') {
            return userList.filter(user => user.role === 'manager');
        }
        else if (selectedRole === 'Supportive Associate') {
            return userList.filter(user => user.role === 'supportiveassociate');
        }
        else if (selectedRole === 'Team Leader') {
            return userList.filter(user => user.role === 'teamleader');
        }
        // For other roles or when no role is selected, return the full user list
        return userList;
    };

    if (isLoading) {
        // You can add a loading state or spinner while the data is being fetched
        return <div><Spin /></div>;
    }

    const onFinish = async (formValues) => {
        setIsLoading(true);
        try {
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_SERVER}api/teams/create`, formValues, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${Cookies.get('token')}`,
                },
            });

            const data = response.data;

            if (response.status === 201) {
                message.success('Team created successfully');
                onFormSubmit(); // Trigger parent component's onFormSubmit function
                onClose(); // Close the form
            } else {
                throw new Error(data.message || 'Failed to create team');
            }
        } catch (error) {
            console.error('Error:', error);
            message.error(error.message || 'Failed to create team');
        } finally {
            setIsLoading(false);
        }
    }


    return (
        <Form onFinish={onFinish} layout='vertical'>
            <Form.Item label="Role" name="role">
                <Select
                    placeholder='Select role'
                    onChange={handleRoleChange}
                >
                    <Option value="Admin">Admin</Option>
                    <Option value="Sub Admin">Sub Admin</Option>
                    <Option value="Manager">Manager</Option>
                    <Option value="Supportive Associate">Supportive Associate</Option>
                    <Option value="Team Leader">Team Leader</Option>
                </Select>
            </Form.Item>
            <Form.Item label="Team leader" name="userId">
                <Select
                    placeholder={`Select ${selectedRole ? selectedRole.toLowerCase() : 'users'}`}
                    showSearch
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                >
                    {filteredUserList().map(user => (
                        <Option classname="capitalize" key={user._id} value={user._id}>{user.fullname}</Option>
                    ))}
                </Select>
            </Form.Item>
            {(selectedRole === 'Team Leader' || selectedRole === 'Supportive Associate') && (
                <Form.Item label="Team Members" name="teamMembers">
                    <Select className="capitalize" placeholder="Select team members" mode="multiple" showSearch optionFilterProp="children" filterOption={(input, option) =>
                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }>
                        {userList.map(user => (
                            <Option key={user._id} value={user._id}>{user.fullname}</Option>
                        ))}
                    </Select>
                </Form.Item>
            )}
            <Form.Item label="Institute" name="institute">
                <Select placeholder="select institute" mode='multiple'
                    showSearch
                    optionFilterProp='children'
                    options={[
                        { value: 'HES', label: 'HES' },
                        { value: 'DES', label: 'DES' },
                    ]}
                ></Select>
            </Form.Item>
            <Form.Item label="University" name="university">
                <Select placeholder="Select university" mode='multiple'
                    showSearch
                    optionFilterProp='children'
                    options={[
                        { value: 'SGVU', label: 'SGVU' },
                        { value: 'CU', label: 'CU' },
                        { value: 'SPU', label: 'SPU' },
                        { value: 'LPU', label: 'LPU' },
                        { value: 'DPU', label: 'DPU' },
                        { value: 'AMRITA', label: 'AMRITA' },
                        { value: 'AMITY', label: 'AMITY' },
                        { value: 'JAIN', label: 'JAIN' },
                        { value: 'SVSU', label: 'SVSU' },
                        { value: 'VIGNAN', label: 'VIGNAN' },
                        { value: 'MANIPAL', label: 'MANIPAL' },
                        { value: 'SMU', label: 'SMU' },
                        { value: 'HU', label: 'HU' },
                        { value: 'BOSSE', label: 'BOSSE' },
                        { value: 'SHOOLINI', label: 'SHOOLINI' },
                        { value: 'VGU', label: 'VGU' },
                        { value: 'SHARDA', label: 'SHARDA' },
                        { value: 'UU', label: 'UU' },
                        { value: 'UPES', label: 'UPES' },
                        { value: 'MANGALAYATAN DISTANCE', label: 'MANGALAYATAN DISTANCE' },
                        { value: 'MANGALAYATAN ONLINE', label: 'MANGALAYATAN ONLINE' },
                    ]}
                ></Select>
            </Form.Item>
            <Form.Item label="Team Name" name="teamName">
                <Input placeholder='Enter teamname' />
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit">
                    Submit
                </Button>
            </Form.Item>
        </Form>
    );
};

export default AddRoleform;
