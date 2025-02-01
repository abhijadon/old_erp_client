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
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [loading, setLoading] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(`lms/read/${id}`);
            setData(response.data);
        } catch (error) {
            message.error(error.response.data.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [id]);

    const handleSubmit = async (e, resend = false) => {
        e.preventDefault();
        setLoading(true);
        try {
            const url = `lms/create/${id}` + (resend ? '?resendEmail=true' : '');
            const response = await axios.post(url);
            if (response.data.message) {
                message.success(response.data.message);
                fetchData();
            } else {
                message.error(response.data.message || 'Failed to create LMS');
            }
        } catch (error) {
            message.error(error.response.data.message);
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async (type) => {
        setLoading(true);
        try {
            const requestBody = {
                full_name: recordDetails.full_name,
                contact: {
                    email: recordDetails.contact.email,
                    phone: recordDetails.contact.phone,
                },
                education: {
                    course: recordDetails.education.course,
                },
                customfields: {
                    institute_name: recordDetails.customfields.institute_name,
                    university_name: recordDetails.customfields.university_name,
                    session: recordDetails.customfields.session,
                    father_name: recordDetails.customfields.father_name,
                    dob: recordDetails.customfields.dob,
                    installment_type: recordDetails.customfields.installment_type,
                    payment_mode: recordDetails.customfields.payment_mode,
                    payment_type: recordDetails.customfields.payment_type,
                    total_course_fee: recordDetails.customfields.total_course_fee,
                    total_paid_amount: recordDetails.customfields.total_paid_amount,
                    paid_amount: recordDetails.customfields.paid_amount,
                    paymentStatus: recordDetails.customfields.paymentStatus,
                    sendfeeReciept: recordDetails.customfields.sendfeeReciept,
                },
                welcome: recordDetails.welcome,
                whatsappWelcome: recordDetails.whatsappWelcome,
            };

            const response = await axios.put(`/lead/resend/${id}`, requestBody, {
                params: { resendEmail: type === 'email', resendWhatsApp: type === 'whatsapp' }
            });
            if (response.data.success) {
                message.success(response.data.message);
                fetchData();
            } else {
                message.error(response.data.message);
            }
        } catch (error) {
            const errorMsg = error.response.data.message;
            message.error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

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

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleOk = () => {
        setIsModalVisible(false);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const latestEmailStatus = data?.result?.emailStatuses?.[data.result.emailStatuses.length - 1] || {};

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
                    <h3 className='flex items-center justify-start border-b'>
                        <span className='text-blue-600 mr-1'><RiShieldUserFill /></span>
                        <span className='text-blue-500'>LMS Status</span>
                    </h3>
                    <ul className='mt-3 space-y-2'>
                        <li className='border-b flex items-center justify-around'>
                            <span> Email :</span> <span className='text-'> {latestEmailStatus.status || 'N/A'} </span>
                        </li>
                        <li className='border-b flex items-center justify-around'>
                            <span>Created :</span> <span className='text-'> {latestEmailStatus.createdAt ? moment(latestEmailStatus.createdAt).format('DD-MM-YYYY HH:mm') : 'N/A'}</span>
                        </li>
                    </ul>
                </div>
                <div>
                    <h3 className='flex items-center justify-start border-b'>
                        <span className='text-green-600 mr-1'>  < SiWelcometothejungle /> </span>
                        <span className='text-green-500'>Welcome Status</span>
                    </h3>
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
                    <h3 className='flex items-center justify-start border-b'>
                        <span className='text-orange-600 mr-1'>  < FaRenren /> </span>
                        <span className='text-orange-500'>Enrollment Status</span>
                    </h3>
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
            <div className='flex flex-wrap gap-2 mt-4'>
                <Button onClick={(e) => handleSubmit(e, true)} className='bg-red-200 w-32 h-6 hover:bg-red-400 text-red-800 hover:text-red-800 font-thin rounded-none flex items-center gap-0.5 border-none'>
                    <span><LuSend /></span> <span>Resend LMS</span>
                </Button>
                <Button onClick={showModal} className='bg-green-300 w-48 hover:bg-green-400 text-green-800 hover:text-green-800 border-none hover:border-none font-thin rounded-none h-6 flex items-center gap-1'>
                    <span><CiViewTable /></span> <span>View Table</span>
                </Button>
                <Button onClick={(e) => handleSubmit(e)} className='bg-blue-200 w-48 h-6 hover:bg-blue-400 text-blue-800 hover:text-blue-800 font-thin rounded-none flex items-center gap-1'>
                    <span><LuSend /></span> <span>Send LMS</span>
                </Button>
                <Button onClick={() => handleResend('email')} className='bg-blue-200 w-48 h-6 hover:bg-blue-400 text-blue-800 hover:text-blue-800 font-thin rounded-none flex items-center gap-1'>
                    <span><LuSend /></span> <span>Resend Email</span>
                </Button>
                <Button onClick={() => handleResend('whatsapp')} className='bg-green-200 w-48 h-6 hover:bg-green-400 text-green-800 hover:text-green-800 font-thin rounded-none flex items-center gap-1'>
                    <span><LuSend /></span> <span>Resend WhatsApp</span>
                </Button>
            </div>
        </>
    );
}
