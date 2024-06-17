import React, { useState, useEffect } from 'react';
import { Table, Button, Drawer, message, Card } from 'antd';
import useFetch from '@/hooks/useFetch';
import { request } from '@/request';
import UniversityForm from '@/forms/UniversityForm';
import UpdateUniversity from '@/forms/updateUniversity';
import { RiDeleteBin6Line } from "react-icons/ri";
import { TbEdit } from "react-icons/tb";
import { CiBookmarkPlus } from "react-icons/ci";

const Index = () => {
    const [visible, setVisible] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState(null);

    const { data: universityList, isLoading: universityLoading, error } = useFetch(() =>
        request.list({ entity: 'university' })
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
            await request.delete({ entity: 'university', id: record._id });
            message.success('Record deleted successfully');
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
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Location',
            dataIndex: 'location',
            key: 'location',
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
        <div>
            <div className='flex justify-between items-center'>
                <div>
                    <p className='text-lg font-thin mb-5'>University</p>
                </div>
                <Button type="primary" onClick={handleAddNew} className='relative float-right mb-4 flex items-center gap-1'>
                    <span><CiBookmarkPlus className='font-bold text-lg' /></span> <span>Add</span>
                </Button>
            </div>
            <Table dataSource={universityList?.result} columns={columns} loading={universityLoading} rowKey="_id" pagination={true} />
            <Drawer
                title={selectedRecord ? 'Edit Permission' : 'Given Permission'}
                placement="right"
                closable={false}
                onClose={handleDrawerClose}
                visible={visible}
                width={400}
            >
                {selectedRecord ? (
                    <UpdateUniversity
                        onClose={handleDrawerClose}
                        onFormSubmit={handleFormSubmit}
                        selectedRecord={selectedRecord} />
                ) : (
                    <UniversityForm
                        onClose={handleDrawerClose}
                        onFormSubmit={handleFormSubmit} />
                )}
            </Drawer>
        </div>
    );
};

export default Index;
