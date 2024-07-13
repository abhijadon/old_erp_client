import React, { useEffect, useState } from 'react';
import moment from 'moment';
import * as XLSX from 'xlsx';
import {
  EyeOutlined,
  DeleteOutlined,
  FilePdfOutlined,
  EllipsisOutlined,
} from '@ant-design/icons';
import {
  Dropdown,
  Table,
  Button,
  Input,
  Select,
  Card,
  DatePicker,
  Drawer,
  Menu,
  Radio,
} from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import useLanguage from '@/locale/useLanguage';
import { erp } from '@/redux/erp/actions';
import { selectListItems } from '@/redux/erp/selectors';
import { useErpContext } from '@/context/erp';
import { useNavigate } from 'react-router-dom';
import useResponsiveTable from '@/hooks/useResponsiveTable';
import { DOWNLOAD_BASE_URL } from '@/config/serverApiConfig';
import { request } from '@/request';
import { RiChatFollowUpLine } from 'react-icons/ri';
import { GrHistory } from 'react-icons/gr';
import HistoryModal from './HistoryModal';
import CommentForm from '@/forms/comment';
import { LiaFileDownloadSolid } from 'react-icons/lia';
import { PiMicrosoftTeamsLogo } from 'react-icons/pi';
import useFetch from '@/hooks/useFetch';
const { RangePicker } = DatePicker;

export default function DataTable({ config, extra = [] }) {
  const translate = useLanguage();
  let { entity, dataTableColumns, searchConfig } = config;
  const { result: listResult, isLoading: listIsLoading } = useSelector(selectListItems);
  const { items: dataSource, pagination } = listResult;
  const { erpContextAction } = useErpContext();
  const { modal } = erpContextAction;
  const [statuses, setStatuses] = useState([]);
  const [paymentMode, setPaymentMode] = useState([]);
  const [paymentType, setPaymentType] = useState([]);
  const [institutes, setInstitutes] = useState([]);
  const [universities, setUniversities] = useState([]);
  const [userNames, setUserNames] = useState([]);
  const [historyData, setHistoryData] = useState(null);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [commentRecord, setCommentRecord] = useState(null);
  const [showCommentDrawer, setShowCommentDrawer] = useState(false);
  const [selectedInstitute, setSelectedInstitute] = useState(null);
  const [selectedUniversity, setSelectedUniversity] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [selectedPaymentMode, setSelectedPaymentMode] = useState(null);
  const [selectedPaymentType, setSelectedPaymentType] = useState(null);
  const [selectedUserName, setSelectedUserName] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [followStartDate, setFollowStartDate] = useState(null);
  const [followEndDate, setFollowEndDate] = useState(null);
  const [selectedFollowup, setSelectedFollowup] = useState(null);
  const [isFollowUpActive, setIsFollowUpActive] = useState(false);
  const [isTeam, setIsTeam] = useState('false');

  const handleDateRangeChange = (dates) => {
    if (dates && dates.length === 2) {
      setStartDate(dates[0]);
      setEndDate(dates[1].endOf('day')); // Set end date to the end of the day
    } else {
      setStartDate(null);
      setEndDate(null);
    }
  };

  const handleFollowupDateRangeChange = (dates) => {
    if (dates && dates.length === 2) {
      setFollowStartDate(dates[0]);
      setFollowEndDate(dates[1].endOf('day')); // Set follow-up end date to the end of the day
    } else {
      setFollowStartDate(null);
      setFollowEndDate(null);
    }
  };

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

  const items = [
    {
      label: translate('Show'),
      key: 'read',
      icon: <EyeOutlined />,
    },
    {
      label: translate('Follow_up'),
      key: 'followup',
      icon: <RiChatFollowUpLine />,
    },
    {
      label: translate('Download'),
      key: 'download',
      icon: <FilePdfOutlined />,
    },
    {
      label: translate('History'),
      key: 'history',
      icon: <GrHistory />,
    },
    ...extra,
    {
      type: 'divider',
    },
    {
      label: translate('Delete'),
      key: 'delete',
      icon: <DeleteOutlined />,
    },
  ];

  const navigate = useNavigate();

  const handleRead = (record) => {
    dispatch(erp.currentItem({ data: record }));
    navigate(`/${entity}/read/${record._id}`);
  };

  const handleDownload = (record) => {
    window.open(
      `${DOWNLOAD_BASE_URL}${entity}/${entity}-${record._id}.pdf`,
      '_blank'
    );
  };

  const handleDelete = (record) => {
    dispatch(erp.currentAction({ actionType: 'delete', data: record }));
    modal.open();
  };

  const handleFollowup = (record) => {
    setCommentRecord(record);
    setShowCommentDrawer(true);
  };

  const closeCommentDrawer = () => {
    setShowCommentDrawer(false);
    setCommentRecord(null);
  };

  const handleHistory = async (record) => {
    try {
      const historyData = await request.history({
        entity: 'payment',
        id: record._id,
      });
      if (historyData && historyData.history) {
        historyData.history.sort(
          (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
        );
      }
      setHistoryData(historyData);
      setShowHistoryModal(true);
    } catch (error) {
      console.error('Error fetching history data:', error);
    }
  };

  dataTableColumns = [
    ...dataTableColumns,
    {
      title: 'Action',
      key: 'action',
      fixed: 'right',
      render: (_, record) => (
        <Dropdown
          overlay={
            <Menu onClick={({ key }) => {
              switch (key) {
                case 'read':
                  handleRead(record);
                  break;
                case 'followup':
                  handleFollowup(record);
                  break;
                case 'download':
                  handleDownload(record);
                  break;
                case 'history':
                  handleHistory(record);
                  break;
                case 'delete':
                  handleDelete(record);
                  break;
                default:
                  break;
              }
            }}>
              {items.map(item => {
                if (item.type === 'divider') {
                  return <Menu.Divider key={item.key} />;
                }
                return (
                  <Menu.Item key={item.key} icon={item.icon}>
                    {item.label}
                  </Menu.Item>
                );
              })}
            </Menu>
          }
          trigger={['click']}
        >
          <EllipsisOutlined style={{ cursor: 'pointer', fontSize: '24px' }} />
        </Dropdown>
      ),
    },
  ];

  const dispatch = useDispatch();

  const handelDataTableLoad = (pagination) => {
    const options = {
      page: pagination.current || 1,
      items: pagination.pageSize || 10, // Set the page size to 20
    };

    // Add selected filters if they are not null
    if (selectedInstitute !== null) {
      options.institute_name = selectedInstitute;
    }
    if (selectedUniversity !== null) {
      options.university_name = selectedUniversity;
    }
    if (selectedStatus !== null) {
      options.status = selectedStatus;
    }
    if (selectedPaymentMode !== null) {
      options.payment_mode = selectedPaymentMode;
    }
    if (selectedPaymentType !== null) {
      options.payment_type = selectedPaymentType;
    }
    if (isTeam === 'true' && selectedUserName !== null) {
      options.team = isTeam;
      options.teamLeader = selectedUserName;
    } else if (selectedUserName !== null) {
      options.userId = selectedUserName;
    }
    if (selectedFollowup !== null) {
      options.followup = selectedFollowup;
    }
    if (followStartDate !== null && followEndDate !== null) {
      options.followupdate_start = followStartDate.format('DD/MM/YYYY');
      options.followupdate_end = followEndDate.format('DD/MM/YYYY');
    }
    if (startDate !== null && endDate !== null) {
      options.start_date = startDate.format('DD/MM/YYYY');
      options.end_date = endDate.format('DD/MM/YYYY');
    }
    // Dispatch API call with updated options
    dispatch(erp.list({ entity, options }));
  };

  const dispatcher = () => {
    dispatch(erp.list({ entity }));
  };

  useEffect(() => {
    const controller = new AbortController();
    dispatcher();
    return () => {
      controller.abort();
    };
  }, []);

  const { tableColumns, tableHeader } = useResponsiveTable(
    dataTableColumns,
    items
  );

  const filterTable = (e) => {
    const value = e.target.value;
    const options = { q: value, fields: searchConfig?.searchFields || '' };
    dispatch(erp.list({ entity, options }));
  };

  const handlePaymentStatus = (status) => {
    setSelectedFollowup(status);
    setIsFollowUpActive(true); // Activate the follow-up state
  };

  useEffect(() => {
    if (selectedFollowup) {
      applyFilters();
    }
  }, [selectedFollowup]);

  const handleFilterChange = (filterType, value) => {
    switch (filterType) {
      case 'institute':
        setSelectedInstitute(value);
        break;
      case 'university':
        setSelectedUniversity(value);
        break;
      case 'status':
        setSelectedStatus(value);
        break;
      case 'paymentMode':
        setSelectedPaymentMode(value);
        break;
      case 'paymentType':
        setSelectedPaymentType(value);
        break;
      case 'userName':
        setSelectedUserName(value);
        break;
      case 'team':
        setIsTeam(value);
        break;
      default:
        break;
    }
  };

  const applyFilters = () => {
    const options = {};

    // Add selected filters if they are not null
    if (selectedInstitute !== null) {
      options.institute_name = selectedInstitute;
    }
    if (selectedUniversity !== null) {
      options.university_name = selectedUniversity;
    }
    if (selectedStatus !== null) {
      options.status = selectedStatus;
    }
    if (selectedPaymentMode !== null) {
      options.payment_mode = selectedPaymentMode;
    }
    if (selectedPaymentType !== null) {
      options.payment_type = selectedPaymentType;
    }
    if (isTeam === 'true' && selectedUserName !== null) {
      options.team = isTeam;
      options.teamLeader = selectedUserName;
    } else if (selectedUserName !== null) {
      options.userId = selectedUserName;
    }
    if (selectedFollowup !== null) {
      options.followup = selectedFollowup;
    }
    if (followStartDate !== null && followEndDate !== null) {
      options.followupdate_start = followStartDate.format('DD/MM/YYYY');
      options.followupdate_end = followEndDate.format('DD/MM/YYYY');
    }
    if (startDate !== null && endDate !== null) {
      options.start_date = startDate.format('DD/MM/YYYY');
      options.end_date = endDate.format('DD/MM/YYYY');
    }
    // Dispatch API call with updated options
    dispatch(erp.list({ entity, options }));
  };

  useEffect(() => {
    applyFilters();
  }, [selectedInstitute, selectedUniversity, selectedStatus, selectedPaymentMode, selectedPaymentType, selectedUserName, isTeam, startDate, endDate, followStartDate, followEndDate]);

  const resetFilters = () => {
    setSelectedInstitute(null);
    setSelectedUniversity(null);
    setSelectedStatus(null);
    setSelectedPaymentMode(null);
    setSelectedPaymentType(null);
    setSelectedUserName(null);
    setStartDate(null);
    setEndDate(null);
    setFollowStartDate(null);
    setFollowEndDate(null);
    setSelectedFollowup(null);
    setIsFollowUpActive(false);
    setIsTeam('false');
    applyFilters(); // Ensure filters are applied after resetting
  };

  const filterRender = () => {
    return (
      <Card>
        <div className='ml-4'>
          <div className='flex flex-wrap items-center gap-2'>
            <Select
              showSearch
              allowClear
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              placeholder="Select institute"
              className='w-44 h-8'
              onChange={(value) => handleFilterChange('institute', value)}
              value={selectedInstitute}
            >
              {institutes.map(institute => (
                <Select.Option key={institute} value={institute}>{institute}</Select.Option>
              ))}
            </Select>

            <Select
              showSearch
              allowClear
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              placeholder="Select university"
              className='w-44 h-8'
              onChange={(value) => handleFilterChange('university', value)}
              value={selectedUniversity}
            >
              {universities.map(university => (
                <Select.Option key={university} value={university}>{university}</Select.Option>
              ))}
            </Select>

            <Select
              showSearch
              allowClear
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              placeholder="Select status"
              className='w-44 h-8'
              onChange={(value) => handleFilterChange('status', value)}
              value={selectedStatus}
            >
              {statuses.map(status => (
                <Select.Option key={status} value={status}>{status}</Select.Option>
              ))}
            </Select>

            <Select
              showSearch
              allowClear
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              placeholder="Select payment mode"
              className='w-44 h-8'
              onChange={(value) => handleFilterChange('paymentMode', value)}
              value={selectedPaymentMode}
            >
              {paymentMode.map(mode => (
                <Select.Option key={mode} value={mode}>{mode}</Select.Option>
              ))}
            </Select>

            <Select
              showSearch
              allowClear
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              placeholder="Select payment type"
              className='w-44 h-8'
              onChange={(value) => handleFilterChange('paymentType', value)}
              value={selectedPaymentType}
            >
              {paymentType.map(type => (
                <Select.Option key={type} value={type}>{type}</Select.Option>
              ))}
            </Select>

            <Select
              showSearch
              allowClear
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              placeholder="Select user name"
              className='w-44 h-8'
              onChange={(value) => handleFilterChange('userName', value)}
              value={selectedUserName}
            >
              {userNames.map(user => (
                <Select.Option key={user.value} value={user.value}>{user.label}</Select.Option>
              ))}
            </Select>

            <RangePicker
              onChange={handleDateRangeChange}
              value={startDate && endDate ? [startDate, endDate] : null}
              className='w-44 h-8'
              format='DD/MM/YYYY'
              placeholder={['Start Date', 'End Date']}
            />

            <RangePicker
              onChange={handleFollowupDateRangeChange}
              value={followStartDate && followEndDate ? [followStartDate, followEndDate] : null}
              className='w-44 h-8'
              format='DD/MM/YYYY'
              placeholder={['Follow-up Start Date', 'Follow-up End Date']}
            />
            <Button className={isFollowUpActive ? 'bg-green-500 border-blue-400 border w-40' : 'bg-green-200 text-green-800 hover:text-green-700 hover:bg-green-100 hover:border-none border-none w-44'}
              onClick={() => handlePaymentStatus('follow-up')}
            >
              <span>Follow Status </span><span className='text-red-500'>({pagination.followUpCount})</span>
            </Button>
            <Button className="bg-red-200 text-red-800 hover:text-red-700 hover:bg-red-100 hover:border-none border-none w-28"
              onClick={resetFilters}
            >
              Reset Filters
            </Button>
          </div>
        </div>
      </Card>
    );
  };

  const menu = (
    <Menu>
      <Menu.Item key="team">
        <Radio.Group
          onChange={(e) => handleFilterChange('team', e.target.value)} // Fix the onChange handler
          value={isTeam}
        >
          <Radio.Button value="true">Yes</Radio.Button>
          <Radio.Button value="false">No</Radio.Button>
        </Radio.Group>
      </Menu.Item>
    </Menu>
  );

  const exportToExcel = async () => {
    const options = {
      export: 'true',
      sortBy: 'updated',
      sortValue: -1,
    };

    // Add selected filters if they are not null
    if (selectedInstitute !== null) {
      options.institute_name = selectedInstitute;
    }
    if (selectedUniversity !== null) {
      options.university_name = selectedUniversity;
    }
    if (selectedStatus !== null) {
      options.status = selectedStatus;
    }
    if (selectedPaymentMode !== null) {
      options.payment_mode = selectedPaymentMode;
    }
    if (selectedPaymentType !== null) {
      options.payment_type = selectedPaymentType;
    }
    if (isTeam === 'true' && selectedUserName !== null) {
      options.team = isTeam;
      options.teamLeader = selectedUserName;
    } else if (selectedUserName !== null) {
      options.userId = selectedUserName;
    }
    if (selectedFollowup !== null) {
      options.followup = selectedFollowup;
    }
    if (followStartDate !== null && followEndDate !== null) {
      options.followupdate_start = followStartDate.format('DD/MM/YYYY');
      options.followupdate_end = followEndDate.format('DD/MM/YYYY');
    }
    if (startDate !== null && endDate !== null) {
      options.start_date = startDate.format('DD/MM/YYYY');
      options.end_date = endDate.format('DD/MM/YYYY');
    }

    const { result } = await request.list({ entity, options });

    const data = result.map(item => ({
      'Student Name': item.student_name,
      'Email': item.email,
      'Phone': item.phone,
      'Institute': item.institute_name,
      'University': item.university_name,
      'Session': item.session,
      'Payment Type': item.payment_type,
      'Total Course Fee': item.total_course_fee,
      'Total Paid Amount': item.total_paid_amount,
      'Paid Amount': item.paid_amount,
      'Due Amount': item.due_amount,
      'Payment Mode': item.payment_mode,
      'Follow Up Date': item.followUpDate ? moment(item.followUpDate).format('DD/MM/YYYY') : '',
      'Status': item.status,
      'Created': moment(item.created).format('DD/MM/YYYY'),
      'Updated': moment(item.updated).format('DD/MM/YYYY'),
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');
    XLSX.writeFile(workbook, 'data.xlsx');
  };

  const renderTable = () => {
    return (
      <>
        <div className='space30'></div>
        <Card>
          <div ref={tableHeader}>
            <div className='flex justify-between items-center mb-4'>
              <div className='flex items-center space-x-2'>
                <Input
                  key={`searchFilterDataTable}`}
                  onChange={filterTable}
                  placeholder={translate('search')}
                  allowClear
                  className='w-44'
                />
                <div className='flex items-center text-red-500'>
                  <span className='font-thin text-sm'>Total:</span>
                  <span className='font-thin text-sm'> {pagination.total}</span>
                </div>
              </div>
              <div className='flex items-center gap-1'>
                <Dropdown overlay={menu} trigger={['click']}>
                  <div className='flex items-center gap-1 text-sm uppercase rounded-full border border-gray-400 bg-gray-50 px-1 h-6 cursor-pointer'>
                    <span><PiMicrosoftTeamsLogo /></span>
                    <span>Team</span>
                  </div>
                </Dropdown>
                <Button onClick={exportToExcel} className='flex items-center gap-0.5 capitalize text-sm font-thin bg-green-300 text-green-800 border-none hover:border-none hover:text-green-700 hover:bg-green-100'>
                  <span><LiaFileDownloadSolid /></span><span>excel</span>
                </Button>
              </div>
            </div>
          </div>
          <Table
            columns={tableColumns}
            rowKey={(item) => item._id}
            loading={listIsLoading}
            dataSource={dataSource}
            pagination={pagination}
            onChange={handelDataTableLoad}
          />
        </Card>
      </>
    );
  };

  return (
    <>
      <div>
        {filterRender()}
        {renderTable()}
      </div>
      <HistoryModal
        showHistoryModal={showHistoryModal}
        historyData={historyData}
        onClose={() => setShowHistoryModal(false)}
      />
      <Drawer
        title={<div className='font-thin text-lg'>FollowUP & Comments</div>}
        placement='right'
        visible={showCommentDrawer}
        onClose={closeCommentDrawer}
        width={500}
      >
        {commentRecord && (
          <CommentForm
            entity='lead'
            id={commentRecord.applicationId}
            recordDetails={commentRecord}
          />
        )}
      </Drawer>
    </>
  );
}
