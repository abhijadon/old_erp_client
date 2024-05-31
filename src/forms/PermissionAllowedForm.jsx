import React, { useEffect, useState } from 'react';
import { Select, Form, Spin, Button, message } from 'antd';
import { request } from '@/request';
import axios from 'axios';
const { Option } = Select;

const PermissionAllowed = ({ onClose, onFormSubmit }) => {
    const [userList, setUserList] = useState([]);
    const [instituteList, setInstituteList] = useState([]);
    const [universityList, setUniversityList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedRole, setSelectedRole] = useState(null);

    useEffect(() => {
        const fetchUserList = async () => {
            try {
                const response = await request.list({ entity: 'admin' });
                setUserList(response.result);
            } catch (error) {
                console.error('Error fetching user list:', error);
            } finally {
                setIsLoading(false);
            }
        };

        if (userList.length === 0) {
            fetchUserList();
        }
    }, [userList]);

    useEffect(() => {
        const fetchInstituteList = async () => {
            try {
                const response = await request.list({ entity: 'institute' });
                setInstituteList(response.result);
            } catch (error) {
                console.error('Error fetching institute list:', error);
            } finally {
                setIsLoading(false);
            }
        };

        if (instituteList.length === 0) {
            fetchInstituteList();
        }
    }, [instituteList]);

    useEffect(() => {
        const fetchUniversityList = async () => {
            try {
                const response = await request.list({ entity: 'university' });
                setUniversityList(response.result);
            } catch (error) {
                console.error('Error fetching university list:', error);
            } finally {
                setIsLoading(false);
            }
        };

        if (universityList.length === 0) {
            fetchUniversityList();
        }
    }, [universityList]);


    const handleRoleChange = (value) => {
        setSelectedRole(value);
    };

    const filteredUserList = () => {
        if (selectedRole === 'Admin') {
            return userList.filter(user => user.role === 'admin');
        } else if (selectedRole === 'Sub Admin') {
            return userList.filter(user => user.role === 'subadmin');
        } else if (selectedRole === 'Manager') {
            return userList.filter(user => user.role === 'manager');
        } else if (selectedRole === 'Supportive Associate') {
            return userList.filter(user => user.role === 'supportiveassociate');
        } else if (selectedRole === 'Team Leader') {
            return userList.filter(user => user.role === 'teamleader');
        } else if (selectedRole === 'User') {
            return userList.filter(user => user.role === 'user');
        }
        return userList;
    };

    const onFinish = async (formValues) => {
        try {
            const response = await axios.post('/allow/create', formValues);
            if (response.data) {
                message.success(response.data.message);
                if (onFormSubmit) onFormSubmit();
                if (onClose) onClose();
            } else {
                throw new Error(response.data.message);
            }
        } catch (error) {
            message.error(error.response.data.message);
        }
    };

    if (isLoading) {
        return <div><Spin /></div>;
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
                    <Option value="User">User</Option>
                </Select>
            </Form.Item>
            <Form.Item label="Users" name="userId">
                <Select
                    placeholder={`Select ${selectedRole ? selectedRole.toLowerCase() : 'users'}`}
                    showSearch
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                >
                    {filteredUserList().map(user => (
                        <Option className="capitalize" key={user._id} value={user._id}>{user.fullname}</Option>
                    ))}
                </Select>
            </Form.Item>
            <Form.Item label="Institute" name="allowedInstitutes">
                <Select
                    mode='multiple'
                    placeholder="Select institute"
                    showSearch
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                >
                    {instituteList.map(ins => (
                        <Option className="capitalize" key={ins._id} value={ins._id}>{ins.name}</Option>
                    ))}
                </Select>
            </Form.Item>
            <Form.Item label="University" name="allowedUniversities">
                <Select
                    className="capitalize"
                    placeholder='Select university name'
                    mode='multiple'
                    showSearch
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                >
                    {universityList.map(uni => (
                        <Option className="capitalize" key={uni._id} value={uni._id}>{uni.name}</Option>
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

export default PermissionAllowed;
