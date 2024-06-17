import React, { useState } from 'react';
import { Table, Button, Drawer, message, Card, Input } from 'antd';
import useFetch from '@/hooks/useFetch';
import { request } from '@/request';
import AdminForm from '@/forms/Userform';
import { RiDeleteBin6Line } from "react-icons/ri";
import { TbEdit } from "react-icons/tb";
import { FaRegUser } from "react-icons/fa";
import { TbPasswordMobilePhone } from "react-icons/tb";
import UpdatePasswordForm from '@/forms/Updatepassword';

const Index = () => {
    const [visible, setVisible] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState(null);
    const [reload, setReload] = useState(true);
    const [updatePassword, setUpdatePassword] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const { data: adminList, isLoading: adminLoading, error } = useFetch(() =>
        request.list({ entity: 'admin' }), [reload]
    );

    const handleAddNew = () => {
        setSelectedRecord(null);
        setVisible(true);
    };

    const handleDrawerClose = () => {
        setVisible(false);
        setSelectedRecord(null);
        setUpdatePassword(false);
    };

    const handleEdit = (record) => {
        setSelectedRecord(record);
        setVisible(true);
    };

    const handleDelete = async (record) => {
        try {
            await request.delete({ entity: 'admin', id: record._id });
            message.success('Record deleted successfully');
            setReload(prev => !prev);
        } catch (error) {
            message.error('Failed to delete record');
        }
    };

    const handleUpdatePassword = (record) => {
        setSelectedRecord(record);
        setUpdatePassword(true);
        setVisible(true);
    };

    const handleFormSubmit = () => {
        setVisible(false);
        setSelectedRecord(null);
        setReload(prev => !prev);
    };

    const filteredAdminList = adminList?.result.filter((admin) => {
        const query = searchQuery.toLowerCase();
        const fullname = typeof admin.fullname === 'string' ? admin.fullname.toLowerCase() : '';
        const username = typeof admin.username === 'string' ? admin.username.toLowerCase() : '';
        const phone = typeof admin.phone === 'string' ? admin.phone.toLowerCase() : '';
        return (
            fullname.includes(query) ||
            username.includes(query) ||
            phone.includes(query)
        );
    });

    const columns = [
        {
            title: 'Name',
            dataIndex: 'fullname',
            key: 'fullname',
        },
        {
            title: 'Email',
            dataIndex: 'username',
            key: 'username',
        },
        {
            title: 'Phone',
            dataIndex: 'phone',
            key: 'phone',
        },
        {
            title: 'Role',
            dataIndex: 'role',
            key: 'role',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
        },
        {
            title: 'Actions',
            dataIndex: '',
            key: 'actions',
            fixed: 'right',
            render: (text, record) => (
                <span className='flex items-center gap-2'>
                    <TbPasswordMobilePhone
                        title='Update password'
                        className='text-green-500 text-base cursor-pointer'
                        onClick={() => handleUpdatePassword(record)}
                    />
                    <TbEdit
                        title='Edit'
                        className='text-blue-500 text-base cursor-pointer'
                        onClick={() => handleEdit(record)}
                    />
                    <RiDeleteBin6Line
                        title='Delete'
                        className='text-red-500 text-base cursor-pointer'
                        onClick={() => handleDelete(record)}
                    />
                </span>
            ),
        },
    ];

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <Card>
            <div className='flex justify-between items-center'>
                <div>
                    <p className='text-lg font-thin mb-5'>All Users</p>
                </div>
                <Button type="primary" onClick={handleAddNew} className='relative float-right mb-4 flex items-center gap-1'>
                    <span><FaRegUser /></span> <span>Add User</span>
                </Button>
            </div>
            <div className='flex gap-2 mb-4 justify-start items-center'>
                <Input allowClear className='w-52'
                    placeholder='Search by Name, Email'
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                />
            </div>
            <Table
                dataSource={filteredAdminList}
                columns={columns}
                loading={adminLoading}
                rowKey="_id"
                pagination={false}
                onChange={() => setReload(prev => !prev)}
            />
            <Drawer
                title={updatePassword ? 'Update Password' : (selectedRecord ? 'Edit User' : 'Add User')}
                placement="right"
                closable={false}
                onClose={handleDrawerClose}
                visible={visible}
                width={400}
            >
                {updatePassword ? (
                    <UpdatePasswordForm
                        record={selectedRecord}
                        onClose={handleDrawerClose}
                        onFormSubmit={handleFormSubmit}
                    />
                ) : (
                    <AdminForm
                        isUpdateForm={!!selectedRecord}
                        initialValues={selectedRecord || {}}
                        onClose={handleDrawerClose}
                        onFormSubmit={handleFormSubmit}
                    />
                )}
            </Drawer>
        </Card>
    );
};

export default Index;
