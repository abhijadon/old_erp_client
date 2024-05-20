import React, { useEffect, useState } from 'react';
import { Table, Button, Drawer, message, Card, Select, Input } from 'antd';
import { request } from '@/request';
import EditCourseInfo from '@/forms/EditCourseInfo';
import { RiDeleteBin6Line } from "react-icons/ri";
import { AiOutlineMenuFold } from "react-icons/ai";
import { BiReset } from 'react-icons/bi';
import { TbEdit } from 'react-icons/tb';
import Form from '@/forms/courseInform';

const Index = () => {
    const [visible, setVisible] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState(null);
    const [filters, setFilters] = useState({ university: '', course: '', electives: '', mode_info: '' });
    const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
    const [dataSource, setDataSource] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState();

    const buildQueryString = (pagination, filters) => {
        const { current, pageSize } = pagination;
        let query = `?page=${current}&items=${pageSize}`;

        Object.keys(filters).forEach(key => {
            if (filters[key]) {
                query += `&filter=${key}&equal=${filters[key]}`;
            }
        });

        if (searchQuery) {
            query += `&fields=university&q=${searchQuery}`;
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
        fetchData(pagination, filters);
    }, [pagination.current, filters, searchQuery]);

    const handleTableChange = (pagination) => {
        setPagination((prevPagination) => ({
            ...prevPagination,
            current: pagination.current,
            pageSize: pagination.pageSize,
        }));
    };

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

    const handleFilterChange = (field, value) => {
        setFilters((prevFilters) => ({ ...prevFilters, [field]: value }));
        setPagination({ ...pagination, current: 1 });
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

    const columns = [
        {
            title: 'Mode Info',
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
            title: 'Fee',
            dataIndex: 'fee',
            key: 'fee',
            render: (text) => <span style={{ textTransform: 'capitalize' }}>{text}</span>,
        },
        {
            title: 'EBD',
            dataIndex: 'ebd',
            key: 'ebd',
            render: (text) => <span style={{ textTransform: 'capitalize' }}>{text}</span>,
        },
        {
            title: 'Reg Fee',
            dataIndex: 'reg_fee',
            key: 'reg_fee',
            render: (text) => <span style={{ textTransform: 'capitalize' }}>{text}</span>,
        },
        {
            title: 'Examination',
            dataIndex: 'examination',
            key: 'examination',
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
            title: 'Website_url',
            dataIndex: 'website_url',
            key: 'website_url',
            render: (text) => <span style={{ textTransform: 'capitalize' }}>{text}</span>,
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
    return (
        <Card>
            <div className='relative float-right ml-4'>
                <Button title='Reset All Filters' onClick={resetValues} className='text-red-500 hover:text-red-600 bg-white rounded-none h-8 mr-4'>
                    <BiReset />
                </Button>
            </div>
            <div className='flex items-center justify-between mb-10'>
                <h2 className='text-lg font-thin'>Courses</h2>
                <Button type="primary" onClick={handleAddNew} className='relative float-right mb-4 flex items-center gap-1'>
                    <span><AiOutlineMenuFold className='font-light text-lg' /></span> <span>Add New</span>
                </Button>
            </div>
            <div className='mb-4 flex items-center gap-4 justify-between'>
                <div>
                    <Input
                        key={`searchFilterDataTable}`}
                        onChange={handleSearchChange}
                        value={searchQuery}
                        placeholder='Search'
                        allowClear={true}
                    />
                </div>
                <div className='flex items-center gap-4'>
                    <div>
                        <Select
                            className='w-48 h-8 capitalize hover:border-blue-500'
                            onChange={(value) => handleFilterChange('university', value)}
                            showSearch
                            placeholder="Select university"
                            optionFilterProp='children'
                            value={filters.university}
                            options={[
                                { value: 'SGVU', label: 'SGVU' },
                                { value: 'CU', label: 'CU' },
                                { value: 'AMRITA', label: 'AMRITA' },
                                { value: 'AMITY', label: 'AMITY' },
                                { value: 'SPU', label: 'SPU' },
                                { value: 'LPU', label: 'LPU' },
                                { value: 'DPU', label: 'DPU' },
                                { value: 'JAIN', label: 'JAIN' },
                                { value: 'SVSU', label: 'SVSU' },
                                { value: 'VIGNAN', label: 'VIGNAN' },
                                { value: 'MANIPAL', label: 'MANIPAL' },
                                { value: 'SMU', label: 'SMU' },
                                { value: 'HU', label: 'HU' },
                                { value: 'BOSSE', label: 'BOSSE' },
                                { value: 'UU', label: 'UU' },
                                { value: 'UPES', label: 'UPES' },
                                { value: 'MANGALAYATAN DISTANCE', label: 'MANGALAYATAN DISTANCE' },
                                { value: 'MANGALAYATAN ONLINE', label: 'MANGALAYATAN ONLINE' },
                            ]}
                        ></Select>
                    </div>
                    <div>
                        <Select
                            className='w-48 h-8 capitalize hover:border-blue-500'
                            onChange={(value) => handleFilterChange('course', value)}
                            showSearch
                            placeholder="Select course"
                            value={filters.course}
                            optionFilterProp='children'
                            options={[
                                { value: 'BBA', label: 'BBA' },
                                { value: 'BCA', label: 'BCA' },
                            ]}
                        ></Select>
                    </div>
                    <div>
                        <Select
                            className='w-48 h-8 capitalize hover:border-blue-500'
                            onChange={(value) => handleFilterChange('electives', value)}
                            showSearch
                            placeholder="Select Electives"
                            value={filters.electives}
                            optionFilterProp='children'
                            options={[
                                { value: 'Data Science, AI', label: 'Data Science, AI' },
                            ]}
                        ></Select>
                    </div>
                    <div>
                        <Select
                            className='w-48 h-8 capitalize hover:border-blue-500'
                            onChange={(value) => handleFilterChange('mode_info', value)}
                            showSearch
                            placeholder="Select mode_info"
                            value={filters.mode_info}
                            optionFilterProp='children'
                            options={[
                                { value: 'Online', label: 'Online' },
                                { value: 'Distance', label: 'Distance' },
                            ]}
                        ></Select>
                    </div>
                </div>
            </div>
            <Table
                dataSource={dataSource}
                columns={columns}
                loading={loading}
                pagination={true}
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
        </Card>
    );
};

export default Index;
