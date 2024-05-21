import { Row, Col, Progress, Button, Select, Card, DatePicker } from 'antd';
import { request } from '@/request';
import RecentTable from '../components/RecentTable';
import PreviewCard from '../components/PreviewCard';
import CustomerPreviewCard from '../components/CustomerPreviewCard';
import DataYear from '../components/DataYear'
import { FcBearish, FcBullish, FcSalesPerformance } from "react-icons/fc";
import { useEffect, useState } from 'react';
import { BiReset } from 'react-icons/bi';
import useFetch from '@/hooks/useFetch';

const { RangePicker } = DatePicker;

export default function DashboardModule() {
    const [selectedInstitute, setSelectedInstitute] = useState(null);
    const [selectedPaymentMode, setSelectedPaymentMode] = useState(null);
    const [selectedPaymentType, setSelectedPaymentType] = useState(null);
    const [selectedUniversity, setSelectedUniversity] = useState(null);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [selectedStatus, setSelectedStatus] = useState(null);
    const [statuses, setStatuses] = useState([]);
    const [paymentMode, setPaymentMode] = useState([]);
    const [paymentType, setPaymentType] = useState([]);
    const [institutes, setInstitutes] = useState([]);
    const [universities, setUniversities] = useState([]);
    const [userNames, setUserNames] = useState([]);
    const [selectedStartDate, setSelectedStartDate] = useState(null);
    const [selectedEndDate, setSelectedEndDate] = useState(null);
    // Use state to store payment data
    const [paymentData, setPaymentData] = useState({ result: null });

    const fetchData = async () => {
        try {
            const { result } = await request.summary({
                entity: 'payment',
                params: {
                    institute_name: selectedInstitute,
                    university_name: selectedUniversity,
                    status: selectedStatus,
                    payment_mode: selectedPaymentMode,
                    payment_type: selectedPaymentType,
                    userId: selectedUserId,
                    startDate: selectedStartDate, // Pass selected start date to the API
                    endDate: selectedEndDate,
                },
            });

            // Update the payment data state
            setPaymentData({ result });
        } catch (error) {
            // Handle errors
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, [selectedUniversity, selectedInstitute, selectedStatus, selectedPaymentMode, selectedPaymentType, selectedUserId, selectedStartDate, selectedEndDate]);


    const { data: userList, isLoading: userLoading } = useFetch(() =>
        request.list({ entity: 'admin' })
    );


    useEffect(() => {
        const fetchData = async () => {
            try {
                const { result } = await request.filter({ entity: 'payment' });
                if (result) {
                    // Extract unique values for statuses, institutes, universities, and user IDs
                    const uniquePaymentMode = [...new Set(result.map(item => item.payment_mode))];
                    const uniquePaymentType = [...new Set(result.map(item => item.payment_type))];
                    const uniqueStatuses = [...new Set(result.map(item => item.status))];
                    const uniqueInstitutes = [...new Set(result.map(item => item.institute_name))];
                    const uniqueUniversities = [...new Set(result.map(item => item.university_name))];

                    setStatuses(uniqueStatuses);
                    setPaymentType(uniquePaymentType);
                    setInstitutes(uniqueInstitutes);
                    setPaymentMode(uniquePaymentMode);
                    setUniversities(uniqueUniversities);

                    // New state for unique user names
                }
            } catch (error) {
                // Handle errors
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);
    const resetValues = () => {
        setSelectedInstitute(null);
        setSelectedUniversity(null);
        setSelectedStatus(null);
        setSelectedUserId(null);
        setSelectedPaymentMode(null);
        setSelectedPaymentType(null);
        setSelectedStartDate(null);
        setSelectedEndDate(null); // Add this line to reset start and end dates
    };
    const amountCardsData = [
        {
            title: 'Total Course Fee',
            color: 'green',
            value: paymentData.result?.total_course_fee,
            total: paymentData.result?.total_course_fee_total,
            icon: <FcSalesPerformance style={{ fontSize: 48, color: 'green' }} />,
        },
        {
            title: 'Total Paid Amount',
            color: 'blue',
            value: paymentData.result?.total_paid_amount,
            total: paymentData.result?.total_paid_amount_total,
            icon: <FcBullish style={{ fontSize: 48, color: 'blue' }} />,
        },
        {
            title: 'Due Amount',
            color: 'red',
            value: paymentData.result?.due_amount,
            total: paymentData.result?.due_amount_total,
            icon: <FcBearish style={{ fontSize: 48, color: 'blue' }} />,
        },
    ];

    const amountCards = amountCardsData.map((card, index) => {
        return (
            <Card className="w-1/3 shadow drop-shadow-lg" key={index}>
                <div>
                    <div>
                        <div className="flex gap-10 justify-between items-center">
                            <div>{card.icon}</div>
                            <div>
                                <div className={`text-${card.color}-500 mb-2 text-sm font-normal`}>
                                    {card.title}
                                </div>
                                <div className={`text-${card.color}-500 text-2xl`}>₹ {card.value}</div>
                            </div>
                        </div>
                        <div className="mt-2">
                            <Progress
                                percent={Math.min(Math.round((card.value / 50000000) * 100), 100)}
                                status="active"
                                strokeColor={{
                                    '0%': 'red',
                                    '40%': 'blue',
                                    '100%': 'green',
                                }}
                                className='mt-3'
                            />
                        </div>
                    </div>
                </div>
            </Card>
        );
    });

    const handleDateRangeChange = (dates) => {
        if (dates && dates.length === 2) {
            setSelectedStartDate(dates[0]);
            setSelectedEndDate(dates[1].endOf('day')); // Set the end date to the end of the day
        } else {
            setSelectedStartDate(null);
            setSelectedEndDate(null); // Clear dates if not a valid range
        }
    };

    const filterRender = () => (
        <div>
            <div className='flex items-center space-x-2'>
                <div>
                    {/* Select for Institute */}
                    <Select showSearch optionFilterProp="children" filterOption={(input, option) =>
                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                        placeholder="Select institute"
                        className='w-60 h-10 capitalize'
                        value={selectedInstitute}
                        onChange={(value) => setSelectedInstitute(value)}
                    >
                        {institutes.map(institute => (
                            <Select.Option key={institute}>{institute}</Select.Option>
                        ))}
                    </Select>
                </div>
                <div>
                    {/* Select for University */}
                    <Select showSearch optionFilterProp="children" filterOption={(input, option) =>
                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                        placeholder="Select university"
                        className='w-60 h-10 capitalize'
                        value={selectedUniversity}
                        onChange={(value) => setSelectedUniversity(value)}
                    >
                        {universities.map(university => (
                            <Select.Option key={university}>{university}</Select.Option>
                        ))}
                    </Select>
                </div>
                <div>
                    {/* Select for Status */}
                    <Select showSearch optionFilterProp="children" filterOption={(input, option) =>
                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                        placeholder="Select status"
                        className='w-60 h-10 capitalize'
                        value={selectedStatus}
                        onChange={(value) => setSelectedStatus(value)}
                    >
                        {statuses.map(status => (
                            <Select.Option key={status}>{status}</Select.Option>
                        ))}
                    </Select>
                </div>
                {/* Select for User Full Name */}
                <div>
                    <Select showSearch optionFilterProp="children" filterOption={(input, option) =>
                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                        placeholder="Select payment mode"
                        className='w-60 h-10 capitalize'
                        value={selectedPaymentMode}
                        onChange={(value) => setSelectedPaymentMode(value)}
                    >
                        {paymentMode.map((paymentmode) => (
                            <Select.Option className="capitalize font-thin font-mono" key={paymentmode}>
                                {paymentmode}
                            </Select.Option>
                        ))}
                    </Select>
                </div>
                <div>
                    <Select showSearch optionFilterProp="children" filterOption={(input, option) =>
                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                        placeholder="Select payment type"
                        className='w-60 h-10 capitalize'
                        value={selectedPaymentType}
                        onChange={(value) => setSelectedPaymentType(value)}
                    >
                        {paymentType.map((paymenttype) => (
                            <Select.Option className="capitalize font-thin font-mono" key={paymenttype}>
                                {paymenttype}
                            </Select.Option>
                        ))}
                    </Select>
                </div>
            </div>

            <div className='flex space-x-2 mt-4'>
                {/* Select for User Full Name */}
                <div>
                    <Select placeholder="Select user full name" showSearch optionFilterProp="children" filterOption={(input, option) =>
                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                        className='w-60 h-10 capitalize' value={selectedUserId}
                        onChange={(value) => setSelectedUserId(value)}>
                        {userList && userList.result.map(user => (
                            <Option className="capitalize" key={user._id} value={user._id}>{user.fullname}</Option>
                        ))}
                    </Select>
                </div>

                <div>
                    <RangePicker
                        className='w-60 h-10 capitalize'
                        format="YYYY-MM-DD"
                        onChange={handleDateRangeChange}
                    />
                </div>
            </div>

            <div className='relative float-right -mt-10 mr-2'>
                <Button title='Reset All Filters' onClick={resetValues} className='bg-white text-red-500 text-lg h-10 hover:text-red-600'>
                    <BiReset />
                </Button>
            </div>
        </div>
    )


    return (
        <>
            <div>
                {filterRender()}
                <div className="space30"></div>
            </div>
            <div className='flex gap-4'>
                {amountCards}
            </div>
            <div className="space30"></div>
            <Row gutter={[32, 32]}>
                <Col className="gutter-row" sm={{ span: 24 }} md={{ span: 24 }} lg={{ span: 14 }}>
                    <div>
                        <Row>
                            <PreviewCard startDate={selectedStartDate} endDate={selectedEndDate} />
                        </Row>
                    </div>
                </Col>
                <Col className="gutter-row" sm={{ span: 24 }} md={{ span: 24 }} lg={{ span: 10 }}>
                    <div>
                        <Card className="shadow drop-shadow-lg w-full h-[355px]">
                            <RecentTable />
                        </Card>
                    </div>
                </Col>
            </Row><div className="space30"></div>
            <Row gutter={[32, 32]}>
                <Col className="gutter-row" sm={{ span: 24 }} md={{ span: 24 }} lg={{ span: 14 }}>
                    <Card className="shadow drop-shadow-lg w-full h-full" >
                        <CustomerPreviewCard />
                    </Card>
                </Col>
                <Col className="gutter-row bg-white" sm={{ span: 24 }} md={{ span: 24 }} lg={{ span: 10 }} >
                    <DataYear />
                </Col>

            </Row>
        </>
    );
}
