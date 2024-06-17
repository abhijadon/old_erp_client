import React, { useEffect, useState } from 'react';
import { Table, Button, Drawer, message, Card, Select, Input, Modal } from 'antd';
import { request } from '@/request';
import EditCourseInfo from '@/forms/EditCourseInfo';
import { RiDeleteBin6Line } from "react-icons/ri";
import { AiOutlineMenuFold } from "react-icons/ai";
import { BiReset } from 'react-icons/bi';
import { TbEdit } from 'react-icons/tb';
import Form from '@/forms/courseInform';
import { FaFilePdf, FaRegEye } from "react-icons/fa";
import BrochuresModal from '@/components/BrochuresModal';
import Detailpage from '@/components/Detailspage';
const Index = () => {
    const [visible, setVisible] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState(null);
    const [filters, setFilters] = useState({ university: '', course: '', electives: '', mode_info: '' });
    const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
    const [dataSource, setDataSource] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState();
    const [uniqueFilters, setUniqueFilters] = useState({});
    const [brochuresVisible, setBrochuresVisible] = useState(false);
    const [showDrawer, setShowDrawer] = useState(false);
    const [drawerData, setDrawerData] = useState(null);
    const buildQueryString = (pagination, filters) => {
        const { current, pageSize } = pagination;
        let query = `?page=${current}&items=${pageSize}`;

        Object.keys(filters).forEach(key => {
            if (filters[key]) {
                query += `&filter=${key}&equal=${filters[key]}`;
            }
        });

        if (searchQuery) {
            query += `&q=${searchQuery}`;
        }

        return query;
    };

    const fetchData = async (pagination, filters = {}) => {
        setLoading(true);
        try {
            const queryString = buildQueryString(pagination, filters);
            const response = await request.list({
                entity: 'info',
                options: { queryString }
            });

            if (response.success) {
                setDataSource(response.result);
                setPagination({
                    ...pagination,
                    total: response.pagination.count,
                    current: response.pagination.page,
                    pageSize: response.pagination.limit
                });
            }
        } catch (error) {
            message.error('Failed to fetch data');
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        const fetchData = async () => {
            try {
                const { success, result } = await request.list({ entity: 'info' });
                if (success) {
                    const uniqueUniversities = [...new Set(result.map(item => item.university))];
                    const uniqueCourses = [...new Set(result.map(item => item.course))];
                    const uniqueElectives = [...new Set(result.map(item => item.electives))];
                    const uniqueModes = [...new Set(result.map(item => item.mode_info))];

                    setUniqueFilters({
                        university: uniqueUniversities,
                        course: uniqueCourses,
                        electives: uniqueElectives,
                        mode_info: uniqueModes
                    });
                }
            } catch (error) {
                message.error('Failed to fetch data');
            }
        };

        fetchData();
    }, []);
    useEffect(() => {
        fetchData(pagination, filters);
    }, [pagination.current, filters, searchQuery]);

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
            await request.delete({ entity: 'info', id: record._id });
            message.success('Record deleted successfully');
            fetchData(pagination, filters); // Refresh the data after deletion
        } catch (error) {
            message.error('Failed to delete record');
        }
    };

    const handleFormSubmit = () => {
        setVisible(false);
        setSelectedRecord(null);
        fetchData(pagination, filters); // Refresh the data after form submission
    };
    const resetValues = () => {
        setFilters({ university: '', course: '', electives: '', mode_info: '' });
        setPagination({ current: 1, pageSize: 10 });
        setSearchQuery('');
        fetchData({ current: 1, pageSize: 10 }, {});
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };
    const handleBrochuresClick = () => {
        setBrochuresVisible(true);
    };
    const handleShow = (record) => {
        setDrawerData(record); // Set the data to be imported into the drawer
        setShowDrawer(true); // Show the drawer when "Show" button is clicked
    };
    const columns = [
        {
            title: 'Mode',
            dataIndex: 'mode_info',
            key: 'mode_info',
            render: (text) => <span style={{ textTransform: 'capitalize' }}>{text}</span>,
        },
        {
            title: 'University',
            dataIndex: 'university',
            key: 'university',
            render: (text) => <span style={{ textTransform: 'capitalize' }}>{text}</span>,
        },
        {
            title: 'Course',
            dataIndex: 'course',
            key: 'course',
            render: (text) => <span style={{ textTransform: 'capitalize' }}>{text}</span>,
        },
        {
            title: 'Electives',
            dataIndex: 'electives',
            key: 'electives',
            render: (text) => <span style={{ textTransform: 'capitalize' }}>{text}</span>,
        },
        {
            title: 'Reg fees',
            dataIndex: 'reg_fee',
            key: 'reg_fee',
            render: (text) => <span style={{ textTransform: 'capitalize' }}>{text}</span>,
        },
        {
            title: 'Course fees',
            dataIndex: 'fee',
            key: 'fee',
            render: (text) => <span style={{ textTransform: 'capitalize' }}>{text}</span>,
        },
        {
            title: 'Examination fees',
            dataIndex: 'examinationFee',
            key: 'examination',
            render: (text) => <span style={{ textTransform: 'capitalize' }}>{text}</span>,
        },
        {
            title: 'Discounted total fees',
            dataIndex: 'ebd',
            key: 'ebd',
            render: (text) => <span style={{ textTransform: 'capitalize' }}>{text}</span>,
        },
        {
            title: 'Advantages',
            dataIndex: 'advantages',
            key: 'advantages',
            render: (text) => <span style={{ textTransform: 'capitalize' }}>{text}</span>,
        },
        {
            title: 'Eligibility',
            dataIndex: 'eligibility',
            key: 'eligibility',
            render: (text) => <span style={{ textTransform: 'capitalize' }}>{text}</span>,
        },
        {
            title: 'Website URL',
            dataIndex: 'website_url',
            key: 'website_url',
            render: (text) => (
                <a href={text} target="_blank" rel="noopener noreferrer">
                    {text}
                </a>
            ),
        },
        {
            title: 'Utm Link',
            dataIndex: 'utm_link',
            key: 'utm_link',
            render: (text) => (
                <a href={text} target="_blank" rel="noopener noreferrer">
                    {text}
                </a>
            ),
        },
        {
            title: 'Actions',
            dataIndex: '',
            key: 'actions',
            fixed: 'right',
            render: (text, record) => (
                <span className='flex items-center gap-2'>
                    <FaRegEye title='Show'
                        className='text-green-500 hover:text-green-700 text-base cursor-pointer'
                        onClick={() => handleShow(record)} // Attach onClick event handler to handle "Show" button click
                    />
                    <TbEdit title='Edit'
                        className='text-blue-500 hover:text-blue-800 text-base cursor-pointer'
                        onClick={() => handleEdit(record)}
                    />
                    <RiDeleteBin6Line title='Delete'
                        className='text-red-500 hover:text-red-800 text-base cursor-pointer'
                        onClick={() => handleDelete(record)}
                    />
                </span>
            ),
        },
    ];
    return (
        <Card>
            <div className='relative float-right ml-4'>
                <Button title='Reset All Filters' onClick={resetValues} className='text-red-500 hover:text-red-600 bg-white rounded-none h-8 mr-4'>
                    <BiReset />
                </Button>
            </div>
            <div className='flex items-center justify-between mb-10'>
                <h2 className='text-lg font-thin text-blue-400'>Courses & Fees</h2>
                <div>
                    <Button onClick={handleBrochuresClick} className='ml-2 relative float-right mb-4 flex items-center gap-1 text-[#006633] bg-green-200 border-green-300 hover:text-green-800 capitalize'>
                        <span><FaFilePdf /></span> <span>Download brochures</span>
                    </Button>
                    <Button type="primary" onClick={handleAddNew} className='relative float-right mb-4 flex items-center gap-1'>
                        <span><AiOutlineMenuFold className='font-light text-lg' /></span> <span>Add New</span>
                    </Button>
                </div>
            </div>
            <span className='text-red-500 font-thin text-start mb-2'>
                Total: {pagination.total}
            </span>
            <div className='mb-4 flex items-center gap-4 justify-between'>
                <div className='flex items-center gap-3'>
                    <div>
                        <Select
                            placeholder="Select mode"
                            style={{ width: 200 }}
                            onChange={value => setFilters({ ...filters, mode_info: value })}
                        >
                            {uniqueFilters.mode_info &&
                                uniqueFilters.mode_info.map(mode => (
                                    <Select.Option key={mode} value={mode}>
                                        {mode}
                                    </Select.Option>
                                ))}
                        </Select>
                    </div>
                    <div>
                        <Select
                            placeholder="Select university"
                            style={{ width: 200 }}
                            onChange={value => setFilters({ ...filters, university: value })}
                        >
                            {uniqueFilters.university &&
                                uniqueFilters.university.map(university => (
                                    <Select.Option key={university} value={university}>
                                        {university}
                                    </Select.Option>
                                ))}
                        </Select>
                    </div>
                    <div>
                        <Select
                            placeholder="Select course"
                            style={{ width: 200 }}
                            onChange={value => setFilters({ ...filters, course: value })}
                        >
                            {uniqueFilters.course &&
                                uniqueFilters.course.map(course => (
                                    <Select.Option key={course} value={course}>
                                        {course}
                                    </Select.Option>
                                ))}
                        </Select>
                    </div>
                    <div>
                        <Select
                            placeholder="Select electives"
                            style={{ width: 200 }}
                            onChange={value => setFilters({ ...filters, electives: value })}
                        >
                            {uniqueFilters.electives &&
                                uniqueFilters.electives.map(elective => (
                                    <Select.Option key={elective} value={elective}>
                                        {elective}
                                    </Select.Option>
                                ))}
                        </Select>
                    </div>
                </div>
                <div>
                    <Input
                        key={`searchFilterDataTable}`}
                        onChange={handleSearchChange}
                        value={searchQuery}
                        placeholder='Search'
                        allowClear={true}
                    />
                </div>
            </div>
            <Table
                dataSource={dataSource}
                columns={columns}
                loading={loading}
                pagination={false}

            />
            <Drawer
                title={selectedRecord ? 'Edit Course & University' : 'Add Course & University'}
                placement="right"
                closable={false}
                onClose={handleDrawerClose}
                open={visible}
                width={500}
            >
                {selectedRecord ? (
                    <EditCourseInfo
                        onClose={handleDrawerClose}
                        onFormSubmit={handleFormSubmit}
                        selectedRecord={selectedRecord}
                    />
                ) : (
                    <Form
                        onClose={handleDrawerClose}
                        onFormSubmit={handleFormSubmit}
                    />
                )}
            </Drawer>
            <Modal
                title={
                    <div className='uppercase border-b text-[#006633]'>
                        Download brochures
                    </div>
                }
                open={brochuresVisible}
                onOk={() => setBrochuresVisible(false)}
                onCancel={() => setBrochuresVisible(false)}
                width={1000}
                footer={null}
            >
                <BrochuresModal
                    visible={brochuresVisible}
                    onClose={() => setBrochuresVisible(false)}
                    university={filters.university}
                    course={filters.course}
                    electives={filters.electives}
                />
            </Modal>
            <Drawer
                title={
                    <div>
                        <div className='uppercase text-blue-600 relative float-end text-sm'>
                           University & Course Details
                        </div>
                    </div>
                }
                placement="left"
                closable={true} // Allow closing the drawer
                onClose={() => setShowDrawer(false)} // Close the drawer when the close button is clicked
                visible={showDrawer} // Set the visibility of the drawer based on state variable
                width={700}
            >
                {/* Display the imported data inside the drawer */}
                {drawerData && (
                    <Detailpage record={drawerData}/>
                )}
            </Drawer>
        </Card>
    );
};

export default Index;
