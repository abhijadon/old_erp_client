import React, { useState } from 'react';
import { Table, Button, Drawer, message, Card } from 'antd';
import useFetch from '@/hooks/useFetch';
import { request } from '@/request';
import UpdateCourse from '@/forms/updateCourse';
import CourseForm from '@/forms/courseForm';
import { RiDeleteBin6Line } from "react-icons/ri";
import { TbEdit } from "react-icons/tb";
import { CiBookmarkPlus } from "react-icons/ci";
import University from "../University"
const Index = () => {
    const [visible, setVisible] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState(null);

    const { data: courseList, isLoading: instituteLoading, error } = useFetch(() =>
        request.list({ entity: 'course' })
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
            await request.delete({ entity: 'course', id: record._id });
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
            title: 'Course code',
            dataIndex: 'courseCode',
            key: 'courseCode',
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Course Duration',
            dataIndex: 'courseDuration',
            key: 'courseDuration',
        },
        {
            title: 'Course Type',
            dataIndex: 'courseType',
            key: 'courseType',
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
        <>
            <Card className='mb-3'>
                <div className='flex justify-between items-center'>
                    <div>
                        <p className='text-lg font-thin mb-5'>Institute</p>
                    </div>
                    <Button type="primary" onClick={handleAddNew} className='relative float-right mb-4 flex items-center gap-1 mr-5'>
                        <span><CiBookmarkPlus className='font-bold text-lg' /></span> <span>Add</span>
                    </Button>
                </div>
                <Table dataSource={courseList?.result} columns={columns} loading={instituteLoading} rowKey="_id" pagination={true} />
                <Drawer
                    title={selectedRecord ? 'update course' : 'Add Course'}
                    placement="right"
                    closable={false}
                    onClose={handleDrawerClose}
                    visible={visible}
                    width={400}
                >
                    {selectedRecord ? (
                        <UpdateCourse
                            onClose={handleDrawerClose}
                            onFormSubmit={handleFormSubmit}
                            selectedRecord={selectedRecord} />
                    ) : (
                        <CourseForm
                            onClose={handleDrawerClose}
                            onFormSubmit={handleFormSubmit} />
                    )}
                </Drawer>
            </Card>
        </>
    );
};

export default Index;
