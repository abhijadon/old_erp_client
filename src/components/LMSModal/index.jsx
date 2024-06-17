import { Button, message, Spin, Table, Modal } from 'antd';
import axios from 'axios';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { RiShieldUserFill } from "react-icons/ri";
import { LuSend } from "react-icons/lu";
import { CiViewTable } from "react-icons/ci";
import { SiWelcometothejungle } from "react-icons/si";
import { FaRenren } from "react-icons/fa";


export default function Index({ entity, id, recordDetails, onClose }) {
    console.log(recordDetails);
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

    console.log(data?.result?.data)

    return (
        <>
            <Modal
                title="LMS Details"
                open={isModalVisible}
                onOk={handleOk}
                width={500}
                onCancel={handleCancel}
                footer={null}
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
            <div className='grid grid-cols-3 gap-20'>
                <div>
                    <h3 className='flex items-center justify-start border-b'><span className='text-blue-600 mr-1'><RiShieldUserFill /></span><span className='text-blue-500'>LMS Status</span></h3>
                    <ul className='mt-3 space-y-2'>
                        <li className='border-b flex items-center justify-around'>
                            <span> Email :</span> <span className='text-'> {latestEmailStatus.status || 'N/A'} </span>
                        </li>
                        <li className='border-b flex items-center justify-around'>
                            <span>Created :</span> <span className='text-'> {latestEmailStatus.createdAt ? moment(latestEmailStatus.createdAt).format('DD-MM-YYYY HH:mm') : 'N/A'}</span>
                        </li>
                    </ul>
                    <div className='flex items-center justify-start gap-2'>
                    <Button onClick={showModal} className='bg-green-300 w-48 hover:bg-green-400 text-green-800 hover:text-green-800 border-none hover:border-none font-thin rounded-none mt-4 h-6 flex items-center gap-1'>
                            <span><CiViewTable /></span> <span>View Table</span> 
                    </Button>
                        <Button onClick={handleSubmit} className='bg-blue-200 w-48 h-6 hover:bg-blue-400 text-blue-800 hover:text-blue-800 font-thin rounded-none relative float-right mt-4 mr-6 flex items-center gap-1'>
                            <span><LuSend /></span> <span>Send LMS</span> 
                    </Button>
                    </div>
                </div>
                <div>
                    <h3 className='flex items-center justify-start border-b'><span className='text-green-600 mr-1'>  < SiWelcometothejungle /> </span><span className='text-green-500'>Welcome Status</span></h3>
                    <ul className='mt-3 space-y-2 text-justify'>
                        <li className='border-b flex items-center justify-around'>
                            <span> Email :</span> <span className='text-'> {recordDetails?.welcomeMail || 'N/A'} </span>
                        </li>
                        <li className='border-b flex items-center justify-around'>
                            <span> Whatsapp :</span> <span className='text-'> {recordDetails?.whatsappMessageStatus || 'N/A'} </span>
                        </li>
                    </ul>
                </div>
                <div>
                    <h3 className='flex items-center justify-start border-b'><span className='text-orange-600 mr-1'>  < FaRenren /> </span><span className='text-orange-500'>Enrollment Status</span></h3>
                    <ul className='mt-3 space-y-2 text-justify'>
                        <li className='border-b flex items-center justify-around'>
                            <span> Enrollment :</span> <span className='text-'> {recordDetails?.customfields?.enrollment || 'N/A'} </span>
                        </li>
                        <li className='border-b flex items-center justify-around'>
                            <span> Email :</span> <span className='text-'> {recordDetails?.welcomeEnrolled || 'N/A'} </span>
                        </li>
                        <li className='border-b flex items-center justify-around'>
                            <span> Whatsapp :</span> <span className='text-'> {recordDetails?.whatsappEnrolled || 'N/A'} </span>
                        </li>
                    </ul>
                </div>
            </div>
        </>
    );
}
