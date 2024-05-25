import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Drawer, Modal, Button, Spin, message } from 'antd';
import moment from 'moment';
import { PiStudent } from 'react-icons/pi';
import { SiContactlesspayment } from 'react-icons/si';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { IoDocumentAttachOutline } from 'react-icons/io5';
import InstallmentTable from '../InstallmentTable';
import DocumentPreview from '../DocumentPreview';
import Comment from '../CommentModal';
const StudentDetailsModal = ({ student, id }) => {
    const [installmentData, setInstallmentData] = useState([]);
    const [dueAmount, setDueAmount] = useState(0);
    const [documentUrls, setDocumentUrls] = useState([]);
    const [installmentModalVisible, setInstallmentModalVisible] = useState(false);
    const [documentModalVisible, setDocumentModalVisible] = useState(false);
    const [commentModalVisible, setCommentModalVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        if (student) {
            const totalDue = parseFloat(student.customfields.total_course_fee) - parseFloat(student.customfields.total_paid_amount);
            setDueAmount(totalDue);

            // Extract document URLs
            const urls = [student.feeDocument, student.studentDocument].flat();
            setDocumentUrls(urls);
        }
    }, [student]);

    const handleViewDocuments = (documentType) => {
        let documents;

        // Determine which documents to display based on the document type
        if (documentType === 'studentDocument') {
            documents = student.studentDocument;
        } else if (documentType === 'feeDocument') {
            documents = student.feeDocument;
        }

        // Set the selected document URLs to display in the modal
        setDocumentUrls(documents);

        // Show the document modal
        setDocumentModalVisible(true);
    };

    const onDownload = (url) => {
        // Create a temporary link element
        const link = document.createElement('a');
        link.href = url;
        link.download = true;

        // Trigger the click event on the link to start the download
        document.body.appendChild(link);
        link.click();

        // Clean up
        document.body.removeChild(link);
    };

    const handleViewComments = () => {
        setCommentModalVisible(true); // Open the comment modal
    };


    const handleViewInstallment = () => {
        if (student) {
            const combinedData = student.previousData.map((data) => ({
                installment_type: data.installment_type,
                paymentStatus: data.paymentStatus,
                payment_mode: data.payment_mode,
                sendfeeReciept: data.sendfeeReciept,
                payment_type: data.payment_type,
                total_course_fee: data.total_course_fee,
                total_paid_amount: data.total_paid_amount,
                paid_amount: data.paid_amount,
                due_amount: data.due_amount,
                date: moment(data.date).format('DD/MM/YYYY'),
            }));
            setInstallmentData(combinedData);
            setInstallmentModalVisible(true);
        }
    };


    const handleSendEmail = async (record) => {
        setLoading(true);

        try {
            const { full_name } = student; // From student
            const {
                installment_type,
                paymentStatus,
                payment_mode,
                payment_type,
                sendfeeReciept,
                total_course_fee,
                total_paid_amount,
                paid_amount,
                due_amount
            } = record; // From table record

            // Consolidate all required data for the email
            const data = {
                full_name,
                customfields: {
                    installment_type,
                    paymentStatus,
                    payment_mode,
                    payment_type,
                    sendfeeReciept,
                    total_course_fee,
                    total_paid_amount,
                    paid_amount,
                    due_amount,
                    institute_name: student.customfields.institute_name,
                    university_name: student.customfields.university_name,
                    session: student.customfields.session,
                    dob: student.customfields.dob,
                    father_name: student.customfields.father_name,
                },
                contact: {
                    phone: student.contact.phone,
                    email: student.contact.email,
                },
                education: {
                    course: student.education.course,
                },
            };

            const response = await axios.post(`/applications/${student._id}/resend-email`, data);
            if (response.data.success) {
                message.success(response.data.message);
            }
        } catch (error) {
            if (error.response) {
                const { status, data } = error.response;

                if (status === 403) {
                    message.error(data.message);
                } else if (status === 401) {
                    message.error("Unauthorized: Please log in.");
                } else {
                    message.error(data.message);
                }
            } else {
                // Network error or other issues
                message.error("An unexpected error occurred.");
            }
        } finally {
            setLoading(false);
        }
    };

    const columns = [
        {
            title: 'Installment Type',
            dataIndex: 'installment_type',
            key: 'installment_type',
        },
        {
            title: 'Payment Status',
            dataIndex: 'paymentStatus',
            key: 'paymentStatus',
            render: (text) => {
                let icon;
                let color;

                switch (text) {
                    case 'Payment Approved':
                        icon = <CheckCircleOutlined style={{ color: '#009933' }} />;
                        break;
                    case 'Payment Rejected':
                        icon = <CloseCircleOutlined style={{ color: '#E50201' }} />;
                        break;
                    default:
                        color = '#336699';
                        break;
                }

                return (
                    <span style={{ color }}>
                        {text} {icon}
                    </span>
                );
            },
        },
        {
            title: 'Payment Mode',
            dataIndex: 'payment_mode',
            key: 'payment_mode',
        },
        {
            title: 'Payment Type',
            dataIndex: 'payment_type',
            key: 'payment_type',
        },
        {
            title: 'Fee Receipt',
            dataIndex: 'sendfeeReciept',
            key: 'sendfeeReciept',
        },
        {
            title: 'Total course fee',
            dataIndex: 'total_course_fee',
            key: 'total_course_fee',
        },
        {
            title: 'Total paid amount',
            dataIndex: 'total_paid_amount',
            key: 'total_paid_amount',
        },
        {
            title: 'Paid amount',
            dataIndex: 'paid_amount',
            key: 'paid_amount',
        },
        {
            title: 'Due amount',
            dataIndex: 'due_amount',
            key: 'due_amount',
        },
        {
            title: 'Date',
            dataIndex: 'date',
            key: 'date',
        },
        {
            title: 'Resend Email',
            key: 'resend_email',
            render: (text, record) => {
                if (record.paymentStatus === 'payment approved') {
                    return (
                        <Button className='bg-blue-200 text-blue-700 hover:bg-blue-50 hover:text-blue-800 text-justify font-thin'
                            type="link"
                            onClick={() => handleSendEmail(record)}
                            disabled={loading}
                        >
                            Resend feeReciept
                        </Button>
                    );
                }
                return null; // No button for other statuses
            },
        },
    ];



    return (
        <> <div>
            {student && (
                <>
                    <div className="flex items-center gap-1 mb-5 -mt-5 ml-4">
                        <span className="font-thin text-lg">
                            <PiStudent />
                        </span>
                        <span className="font-thin text-lg">Student Details</span>
                    </div>
                    <div className="relative float-right -mt-10 font-thin text-base">
                        {moment(student.created).format('DD/MM/YYYY')}
                    </div>
                    <div className="flex justify-items-start items-center gap-10">
                        <ul className="list-disc">
                            <li className="grid grid-cols-2 gap-20 border-b p-1 ml-8">
                                <span className="text-base font-thin text-gray-700">Student ID</span>
                                <span className="text-sm font-thin text-gray-500">{student.lead_id}</span>
                            </li>
                            <li className="border-b p-1 ml-8 grid grid-cols-2 gap-20">
                                <span className="text-base font-thin text-gray-700">Fullname</span>
                                <span className="text-sm font-thin text-gray-500">{student.full_name}</span>
                            </li>
                            <li className="border-b p-1 ml-8 grid grid-cols-2 gap-20 ">
                                <span className="text-base font-thin text-gray-700">Email</span>
                                <span className="text-sm font-thin text-left text-gray-500">{student.contact.email}</span>
                            </li>
                            <li className="border-b p-1 ml-8 grid grid-cols-2 gap-20">
                                <span className="text-base font-thin text-gray-700">Phone</span>
                                <span className="text-sm font-thin text-gray-500">{student.contact.phone}</span>
                            </li>
                            <li className="border-b p-1 ml-8 grid grid-cols-2 gap-20">
                                <span className="text-base font-thin text-gray-700 capitalize">alternate phone</span>
                                <span className="text-sm font-thin text-gray-500">{student.contact.alternate_phone}</span>
                            </li>
                            <li className="border-b p-1 ml-8 grid grid-cols-2 gap-20">
                                <span className="text-base font-thin text-gray-700">Course</span>
                                <span class="text-sm font-thin text-gray-500">{student.education.course}</span>
                            </li>
                            <li className="grid grid-cols-2 gap-20 border-b p-1 ml-8">
                                <span className="text-base font-thin text-gray-700">Specialization</span>
                                <span className="text-sm font-thin text-gray-500">{student.customfields.enter_specialization}</span>
                            </li>
                            <li className="grid grid-cols-2 gap-20 border-b p-1 ml-8">
                                <span className="text-base font-thin text-gray-700">Session</span>
                                <span className="text-sm font-thin text-gray-500">{student.customfields.session}</span>
                            </li>
                            <li className="grid grid-cols-2 gap-20 border-b p-1 ml-8">
                                <span className="text-base font-thin text-gray-700">Father Name</span>
                                <span className="text-sm font-thin text-gray-500 capitalize">{student.customfields.father_name}</span>
                            </li>
                            <li className="grid grid-cols-2 gap-20 border-b p-1 ml-8">
                                <span className="text-base font-thin text-gray-700">Mother Name</span>
                                <span className="text-sm font-thin text-gray-500 capitalize">{student.customfields.mother_name}</span>
                            </li>
                        </ul>
                        <ul>
                            <li className="grid grid-cols-2 gap-20 border-b p-1 ml-8">
                                <span className="text-base font-thin text-gray-700">Admission Type</span>
                                <span className="text-sm font-thin text-gray-500">{student.customfields.admission_type}</span>
                            </li>
                            <li className="grid grid-cols-2 gap-20 border-b p-1 ml-8">
                                <span className="text-base font-thin text-gray-700">Institute Name</span>
                                <span class="text-sm font-thin text-gray-500">{student.customfields.institute_name}</span>
                            </li>
                            <li className="grid grid-cols-2 gap-20 border-b p-1 ml-8">
                                <span className="text-base font-thin text-gray-700">University Name</span>
                                <span class="text-sm font-thin text-gray-500">{student.customfields.university_name}</span>
                            </li>
                            <li className="grid grid-cols-2 gap-20 border-b p-1 ml-8">
                                <span className="text-base font-thin text-gray-700">User</span>
                                <span class="text-sm font-thin text-gray-500">{student.userId?.fullname}</span>
                            </li>
                            <li className="grid grid-cols-2 gap-20 border-b p-1 ml-8">
                                <span className="text-base font-thin text-gray-700">Date of Birth</span>
                                <span class="text-sm font-thin text-gray-500">{moment(student.customfields.dob).format('DD-MM-YYYY')}</span>
                            </li>
                            <li className="grid grid-cols-2 gap-20 border-b p-1 ml-8">
                                <span className="text-base font-thin text-gray-700">Gender</span>
                                <span class="text-sm font-thin text-gray-500">{student.customfields.gender}</span>
                            </li>

                            <li className="grid grid-cols-2 gap-20 border-b p-1 ml-8">
                                <span className="text-base font-thin text-gray-700">Remark</span>
                                <span class="text-sm font-thin text-gray-500">{student.customfields.remark}</span>
                            </li>
                            <li className="grid grid-cols-2 gap-20 border-b p-1 ml-8">
                                <span className="text-base font-thin text-gray-700">LMS Status</span>
                                <span class="text-sm font-thin text-gray-500">{student.customfields.lmsStatus}</span>
                            </li>
                            <li className="grid grid-cols-2 gap-20 border-b p-1 ml-8">
                                <span className="text-base font-thin text-gray-700">Enrollment Number</span>
                                <span class="text-sm font-thin text-gray-500">{student.customfields.enrollment}</span>
                            </li>
                            <li className="grid grid-cols-2 gap-20 border-b p-1 ml-8">
                                <span className="text-base font-thin text-gray-700">Status</span>
                                <span class="text-sm font-thin text-gray-500">
                                    {student.customfields.status === 'New' && (
                                        <span
                                            className="mt-3 capitalize text-center text-sm font-thin hover:bg-blue-100 bg-blue-100 hover:text-blue-700 text-blue-700 pl-2 pr-2"
                                        >
                                            New
                                        </span>
                                    )}
                                    {student.customfields.status === 'Approved' && (
                                        <span
                                            className="mt-3 capitalize text-center text-sm font-thin hover:bg-green-100 bg-green-100 hover:text-green-700 text-green-700 pl-2 pr-2"
                                        >
                                            Approved
                                        </span>
                                    )}
                                    {student.customfields.status === 'Cancel' && (
                                        <span
                                            className="mt-3 capitalize text-center text-sm font-thin hover:bg-red-100 bg-red-100 hover:text-red-700 text-red-700 pl-2 pr-2"
                                        >
                                            Cancel
                                        </span>
                                    )}
                                    {student.customfields.status === 'Alumini' && (
                                        <span
                                            className="mt-3 capitalize text-center text-sm font-thin hover:bg-green-100 bg-green-100 hover:text-green-700 text-green-700 pl-2 pr-2"
                                        >
                                            Alumini
                                        </span>
                                    )}
                                    {student.customfields.status === 'Not Interested' && (
                                        <span style={{ color: 'orange' }}>Not Interested</span>
                                    )}
                                    {student.customfields.status === 'Enrolled' && (
                                        <span className="capitalize text-center text-sm font-thin hover:bg-yellow-100 bg-yellow-100 hover:text-yellow-700 text-yellow-700 pl-2 pr-2"
                                        >
                                            Enrolled
                                        </span>
                                    )}
                                    {student.customfields.status === 'Refunded' && (
                                        <span className="capitalize text-center text-sm font-thin hover:bg-yellow-100 bg-yellow-100 hover:text-yellow-700 text-yellow-700 pl-2 pr-2"
                                        >
                                            Refunded
                                        </span>
                                    )}
                                </span>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <div className="flex items-center gap-1 mb-5 mt-10 ml-4">
                            <span className="font-thin text-xl">
                                <SiContactlesspayment />
                            </span>
                            <span className="font-thin text-lg">Payment Details</span>
                        </div>
                        <ul>
                            <li className="grid grid-cols-2 gap-20 border-b p-1.5 ml-8">
                                <span className="text-base font-thin text-gray-700">Payment Mode</span>
                                <span class="text-sm font-thin text-gray-500">{student.customfields.payment_mode}</span>
                            </li>
                            <li className="grid grid-cols-2 gap-20 border-b p-1.5 ml-8">
                                <span className="text-base font-thin text-gray-700">Payment Type</span>
                                <span class="text-sm font-thin text-gray-500">{student.customfields.payment_type}</span>
                            </li>
                            <li className="grid grid-cols-2 gap-20 border-b p-1.5 ml-8">
                                <span className="text-base font-thin text-gray-700">Fee Receipt</span>
                                <span class="text-sm font-thin text-gray-500 capitalize">{student.customfields.sendfeeReciept}</span>
                            </li>
                            <li className="grid grid-cols-2 gap-20 border-b p-1.5 ml-8">
                                <span className="text-base font-thin text-gray-700">Installment</span>
                                <span className="text-sm font-thin text-gray-500">{student.customfields.installment_type}</span>
                            </li>
                            <li className="grid grid-cols-2 gap-20 border-b p-1.5 ml-8">
                                <span className="text-base font-thin text-gray-700">Total Course Fee</span>
                                <span className="text-sm font-thin text-[#FF0066] relative text-justify">
                                    <span className="mr-1">&#x20B9;</span>
                                    {student.customfields.total_course_fee}
                                </span>
                            </li>
                            <li className="grid grid-cols-2 gap-20 border-b p-1.5 ml-8">
                                <span className="text-base font-thin text-gray-700">Total Paid Amount</span>
                                <span class="text-sm font-thin text-[#FF0066] relative text-justify">
                                    <span className="mr-1">&#x20B9;</span>
                                    {student.customfields.total_paid_amount}
                                </span>
                            </li>
                            <li className="grid grid-cols-2 gap-20 border-b p-1.5 ml-8">
                                <span className="text-base font-thin text-gray-700">Paid Amount</span>
                                <span class="text-sm font-thin text-[#FF0066] relative text-justify">
                                    <span className="mr-1">&#x20B9;</span>
                                    {student.customfields.paid_amount}
                                </span>
                            </li>
                            <li className="grid grid-cols-2 gap-20 border-b p-1.5 ml-8">
                                <span className="text-base font-thin text-gray-700">Due Amount</span>
                                <span class="text-sm font-thin text-[#FF0066] relative text-justify">
                                    <span className="mr-1">&#x20B9;</span>
                                    {dueAmount}
                                </span>
                            </li>

                            <li className="grid grid-cols-2 gap-20 border-b p-1.5 ml-8">
                                <span className="text-base font-thin text-gray-700">Payments</span>
                                <div className='grid grid-cols-2 justify-items-start'>
                                    <Button
                                        onClick={handleViewInstallment}
                                        className="hover:bg-[#CCFFCC] pl-2 pr-2 bg-[#CCFFCC] hover:text-[#333300] text-[#333300] max-w-32 text-center font-thin text-sm"
                                    >
                                        View Payments
                                    </Button>
                                    <Button
                                        className="hover:bg-[#CCFFCC] pl-2 pr-2 bg-[#CCFFCC] hover:text-[#333300] text-[#333300] max-w-32 text-center font-thin text-sm"
                                        onClick={handleViewComments} // Opens the comment modal
                                    >
                                        View Comments
                                    </Button>
                                </div>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <div className="flex items-center gap-1 mb-5 mt-10 ml-4">
                            <span className="font-thin text-xl">
                                <IoDocumentAttachOutline />
                            </span>
                            <span className="font-thin text-lg">Student Documents</span>
                        </div>
                        <ul>
                            <li className="grid grid-cols-2 gap-20 border-b p-1.5 ml-8">
                                <span className="text-base font-thin text-gray-700">Student document</span>
                                <Button
                                    onClick={() => handleViewDocuments('studentDocument')}
                                    className="hover:bg-[#CCFFCC] pl-2 pr-2 bg-[#CCFFCC] hover:text-[#333300] text-[#333300] max-w-32 text-center font-thin text-sm"
                                >
                                    View Documents
                                </Button>
                            </li>
                            <li className="grid grid-cols-2 gap-20 border-b p-1.5 ml-8">
                                <span className="text-base font-thin text-gray-700">Fee Receipt</span>
                                <Button
                                    onClick={() => handleViewDocuments('feeDocument')}
                                    className="hover:bg-[#CCFFCC] pl-2 pr-2 bg-[#CCFFCC] hover:text-[#333300] text-[#333300] max-w-32 text-center font-thin text-sm"
                                >
                                    View Fee Receipt
                                </Button>
                            </li>
                        </ul>
                    </div>
                </>
            )}

        </div>
            <Modal
                title="Comments"
                open={commentModalVisible} // Visibility controlled by state
                onCancel={() => setCommentModalVisible(false)} // Function to close modal
                footer={null} // No footer
                width={1000}
            >
                <Comment entity="lead" id={student._id} /> {/* Pass the student ID to the Comment component */}
            </Modal>


            <Modal
                title="Previous Installments"
                open={installmentModalVisible}
                onCancel={() => setInstallmentModalVisible(false)}
                footer={null}
                width={1500}
            >
                <InstallmentTable installmentData={installmentData} columns={columns} />
            </Modal>

            <Modal
                title={
                    <div className="font-thin text-lg border-b mb-10">
                        Student Documents
                    </div>
                }
                open={documentModalVisible}
                onCancel={() => setDocumentModalVisible(false)}
                footer={null}
                width={1000}
            >
                <DocumentPreview documentUrls={documentUrls} onDownload={onDownload} />
            </Modal>
        </>
    );
};

export default StudentDetailsModal;
