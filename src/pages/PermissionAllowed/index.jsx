import React, { useState } from 'react';
import { Table, Button, Drawer, message, Card } from 'antd';
import useFetch from '@/hooks/useFetch';
import { request } from '@/request';
import PermissionAllowed from '@/forms/PermissionAllowedForm';
import UpdatePermissionallowed from '@/forms/updatePermissionallowed';
import { RiDeleteBin6Line } from "react-icons/ri";
import { TbEdit } from "react-icons/tb";
import { CiBookmarkPlus } from "react-icons/ci";
const Index = () => {
    const [visible, setVisible] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState(null);

    const { data: userList, isLoading: userLoading, error } = useFetch(() =>
        request.list({ entity: 'allow' })
    );

    const handleAddNew = () => {
        setSelectedRecord(null);
        setVisible(true);
    };

    const handleDrawerClose = () => {
        setVisible(false);
        setSelectedRecord(null);
    };

    const handleEdit = (record) => {
        setSelectedRecord(record);
        setVisible(true);
    };

    const handleDelete = async (record) => {
        try {
            await request.delete({ entity: 'allow', id: record._id });
        } catch (error) {
            message.error('Failed to delete record');
        }
    };

    const handleFormSubmit = () => {
        setVisible(false);
        setSelectedRecord(null);
    };

    const columns = [
        {
            title: 'Full Name',
            dataIndex: ['userId', 'fullname'],
            key: 'fullname',
            render: (text) => <span style={{ textTransform: 'capitalize' }}>{text}</span>,
        },
        {
            title: 'Institute',
            dataIndex: 'allowedInstitutes',
            key: 'institutes',
            render: (institutes) => institutes.map(inst => inst.name).join(', '),
        },
        {
            title: 'University',
            dataIndex: 'allowedUniversities',
            key: 'university',
            render: (universities) => universities.map(uni => uni.name).join(', '),
        },
        {
            title: 'Actions',
            dataIndex: '',
            key: 'actions',
            fixed: 'right',
            render: (text, record) => (
                <span className='flex items-center gap-4'>
                    <TbEdit
                        className='text-blue-500 text-base cursor-pointer'
                        onClick={() => handleEdit(record)}
                    />
                    <RiDeleteBin6Line
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
        <><div>
            <div className='flex justify-between items-center'>
                <div>
                    <p className='text-lg font-thin'>Permissions Allowed</p>
                </div>
                <Button type="primary" onClick={handleAddNew} className='relative float-right mb-4 flex items-center gap-1'>
                    <span><CiBookmarkPlus className='font-bold text-lg' /></span> <span>Add</span>
                </Button>

            </div>

            <Table dataSource={userList?.result} columns={columns} loading={userLoading} className='mr-10 ml-8' />
            <Drawer
                title={selectedRecord ? 'Edit Permission' : 'Given Permission'}
                placement="right"
                closable={false}
                onClose={handleDrawerClose}
                visible={visible}
                width={400}
            >
                {selectedRecord ? (
                    <UpdatePermissionallowed
                        onClose={handleDrawerClose}
                        onFormSubmit={handleFormSubmit}
                        selectedRecord={selectedRecord} />
                ) : (
                    <PermissionAllowed
                        onClose={handleDrawerClose}
                        onFormSubmit={handleFormSubmit} />
                )}
            </Drawer>
        </div>
        </>
    );
};

export default Index;
