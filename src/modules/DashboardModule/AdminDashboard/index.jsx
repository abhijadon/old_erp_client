import { Row, Col, Progress, Button, Select, Card, DatePicker } from 'antd';
import { request } from '@/request';
import RecentTable from '../components/RecentTable';
import PreviewCard from '../components/PreviewCard';
import CustomerPreviewCard from '../components/CustomerPreviewCard';
import DataYear from '../components/DataYear';
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
                    startDate: selectedStartDate,
                    endDate: selectedEndDate,
                },
            });
            setPaymentData({ result });
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, [selectedUniversity, selectedInstitute, selectedStatus, selectedPaymentMode, selectedPaymentType, selectedUserId, selectedStartDate, selectedEndDate]);

    const { data: userList, isLoading: userLoading } = useFetch(() =>
        request.list({ entity: 'admin' })
    );

    const { data: uniqueOptions, isLoading: optionLoading } = useFetch(() =>
        request.filter({ entity: 'lead' })
    );

    useEffect(() => {
        if (uniqueOptions) {
            setStatuses(uniqueOptions.uniqueValues.statuses || []);
            setInstitutes(uniqueOptions.uniqueValues.institute_names || []);
            setPaymentMode(uniqueOptions.uniqueValues.payment_modes || []);
            setPaymentType(uniqueOptions.uniqueValues.payment_types || []);
            setUniversities(uniqueOptions.uniqueValues.university_names || []);
            setUserNames(uniqueOptions.uniqueValues.userIds || []);
        }
    }, [uniqueOptions]);

    const resetValues = () => {
        setSelectedInstitute(null);
        setSelectedUniversity(null);
        setSelectedStatus(null);
        setSelectedUserId(null);
        setSelectedPaymentMode(null);
        setSelectedPaymentType(null);
        setSelectedStartDate(null);
        setSelectedEndDate(null);
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
            setSelectedEndDate(dates[1].endOf('day'));
        } else {
            setSelectedStartDate(null);
            setSelectedEndDate(null);
        }
    };

    const filterRender = () => (
        <div>
            <div className='flex items-center space-x-2'>
                <div>
                    <Select
                        showSearch
                        optionFilterProp="children"
                        filterOption={(input, option) =>
                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                        placeholder="Select institute"
                        className='w-60 h-10 capitalize'
                        value={selectedInstitute}
                        onChange={(value) => setSelectedInstitute(value)}
                    >
                        {institutes.map(institute => (
                            <Select.Option key={institute} value={institute}>{institute}</Select.Option>
                        ))}
                    </Select>
                </div>
                <div>
                    <Select
                        showSearch
                        optionFilterProp="children"
                        filterOption={(input, option) =>
                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                        placeholder="Select university"
                        className='w-60 h-10 capitalize'
                        value={selectedUniversity}
                        onChange={(value) => setSelectedUniversity(value)}
                    >
                        {universities.map(university => (
                            <Select.Option key={university} value={university}>{university}</Select.Option>
                        ))}
                    </Select>
                </div>
                <div>
                    <Select
                        showSearch
                        optionFilterProp="children"
                        filterOption={(input, option) =>
                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                        placeholder="Select status"
                        className='w-60 h-10 capitalize'
                        value={selectedStatus}
                        onChange={(value) => setSelectedStatus(value)}
                    >
                        {statuses.map(status => (
                            <Select.Option key={status} value={status}>{status}</Select.Option>
                        ))}
                    </Select>
                </div>
                <div>
                    <Select
                        showSearch
                        optionFilterProp="children"
                        filterOption={(input, option) =>
                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                        placeholder="Select payment mode"
                        className='w-60 h-10 capitalize'
                        value={selectedPaymentMode}
                        onChange={(value) => setSelectedPaymentMode(value)}
                    >
                        {paymentMode.map((paymentmode) => (
                            <Select.Option className="capitalize font-thin font-mono" key={paymentmode} value={paymentmode}>
                                {paymentmode}
                            </Select.Option>
                        ))}
                    </Select>
                </div>
                <div>
                    <Select
                        showSearch
                        optionFilterProp="children"
                        filterOption={(input, option) =>
                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                        placeholder="Select payment type"
                        className='w-60 h-10 capitalize'
                        value={selectedPaymentType}
                        onChange={(value) => setSelectedPaymentType(value)}
                    >
                        {paymentType.map((paymenttype) => (
                            <Select.Option className="capitalize font-thin font-mono" key={paymenttype} value={paymenttype}>
                                {paymenttype}
                            </Select.Option>
                        ))}
                    </Select>
                </div>
            </div>

            <div className='flex space-x-2 mt-4'>
                <div>
                    <Select
                        placeholder="Select user full name"
                        showSearch
                        optionFilterProp="children"
                        filterOption={(input, option) =>
                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                        className='w-60 h-10 capitalize'
                        value={selectedUserId}
                        onChange={(value) => setSelectedUserId(value)}
                    >
                        {userNames.map(user => (
                            <Select.Option key={user.value} value={user.value}>{user.label}</Select.Option>
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
    );

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
                        <Card className="shadow drop-shadow-lg">
                            <RecentTable />
                        </Card>
                    </div>
                </Col>
                <Col className="gutter-row" sm={{ span: 24 }} md={{ span: 24 }} lg={{ span: 10 }}>
                    <div>
                        <PreviewCard />
                    </div>
                </Col>
            </Row>
            <div className="space30"></div>
            <Row gutter={[32, 32]}>
                <Col className="gutter-row" sm={{ span: 24 }} md={{ span: 24 }} lg={{ span: 14 }}>
                    <Card className="shadow drop-shadow-lg w-full h-full">
                        <CustomerPreviewCard />
                    </Card>
                </Col>
                <Col className="gutter-row bg-white" sm={{ span: 24 }} md={{ span: 24 }} lg={{ span: 10 }}>
                    <DataYear />
                </Col>
            </Row>
        </>
    );
}
