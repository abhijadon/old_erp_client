import { Button, message, Spin, Table, Modal } from 'antd';
import axios from 'axios';
import moment from 'moment';
import React, { useEffect, useState } from 'react';

export default function Index({ entity, id, recordDetails, onClose }) {
    const [data, setData] = useState(null); // State to hold fetched data
    const [isLoading, setIsLoading] = useState(true); // Loading state
    const [loading, setLoading] = useState(false); // Loading state for form
    const [isModalVisible, setIsModalVisible] = useState(false); // Modal visibility state

    const fetchData = async () => {
        setIsLoading(true); // Indicate loading state
        try {
            const response = await axios.get(`lms/read/${id}`); // Fetch data
            setData(response.data); // Set fetched data
        } catch (error) {
            message.error(error.response.data.message);
            // Handle error
        } finally {
            setIsLoading(false); // Reset loading state
        }
    };

    // Fetch data on component mount or when `id` changes
    useEffect(() => {
        fetchData(); // Trigger data fetch
    }, [id]);  // Dependency array to avoid unnecessary re-renders

    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent form refresh
        setLoading(true); // Indicate loading state

        try {
            const response = await axios.post(`lms/create/${id}`); // Post new comment
            if (response.data.message) { // Check if response indicates success
                message.success(response.data.message);
                fetchData(); // Refetch data to update email status after submission
            } else {
                message.error(response.data.message || 'Failed to create LMS'); // Dynamic error message
            }
        } catch (error) {
            message.error(error.response.data.message);
        } finally {
            setLoading(false); // Reset loading state after post
        }
    };

    // Columns definition for the table
    const columns = [
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
        },
        {
            title: 'User',
            dataIndex: ['userId', 'fullname'],
            key: 'userId',
        },
        {
            title: 'Date',
            dataIndex: 'updatedAt',
            key: 'updatedAt',
            render: (text) => moment(text).format('DD-MM-YYYY HH:mm'),
        },
    ];

    // Handle modal visibility
    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleOk = () => {
        setIsModalVisible(false);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    // Extract the latest email status
    const latestEmailStatus = data?.result?.emailStatuses?.[data.result.emailStatuses.length - 1] || {};

    // Determine the style for email status
    const emailStatusStyle = {
        color: latestEmailStatus.status === 'success' ? 'green' : latestEmailStatus.status === 'failed' ? 'red' : 'black'
    };

    return (
        <>
            <Modal
                title="LMS Data"
                open={isModalVisible}
                onOk={handleOk}
                width={800}
                onCancel={handleCancel}
                footer={[
                    <Button key="back" onClick={handleCancel}>
                        Close
                    </Button>,
                ]}
            >
                <Spin spinning={isLoading} tip="Loading LMS...">
                    {data && (
                        <Table
                            dataSource={data.result.data}
                            columns={columns}
                            rowKey="_id"
                            pagination={false}
                        />
                    )}
                </Spin>
            </Modal>
            <div>
                <div className="flex justify-items-start items-center gap-10">
                    <ul className="list-disc flex items-center gap-10 capitalize mb-5">
                        <li className="grid grid-cols-2 gap-20 border-b p-1 ml-8">
                            <span className="text-base font-thin text-gray-700">Email status</span>
                            <span className="text-base font-thin" style={emailStatusStyle}>{latestEmailStatus.status || 'N/A'}</span>
                        </li>
                        <li className="grid grid-cols-2 gap-20 border-b p-1 ml-64 relative float-end">
                            <span className="text-base font-thin text-gray-700">Email Created At</span>
                            <span className="text-sm font-thin text-gray-500">{latestEmailStatus.createdAt ? moment(latestEmailStatus.createdAt).format('DD-MM-YYYY HH:mm') : 'N/A'}</span>
                        </li>
                    </ul>
                </div>
            </div>
            <div className='flex items-center justify-between'>
                <Button onClick={showModal} className='bg-blue-300 w-48 hover:bg-blue-400 text-black hover:text-black font-thin rounded-none h-8 mt-4'>
                    View Table
                </Button>
                <Button onClick={handleSubmit} className='bg-blue-300 w-48 hover:bg-blue-400 text-black hover:text-black font-thin rounded-none h-8 relative float-right mt-4 mr-6'>
                    Send LMS
                </Button>
            </div>
        </>
    );
}
