import React, { useCallback, useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
import {
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  FilePdfOutlined,
  PlusOutlined,
  EllipsisOutlined,
} from '@ant-design/icons';
import { Dropdown, Table, Button, Input, Select, Card, Modal, DatePicker, Drawer } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import useLanguage from '@/locale/useLanguage';
import { erp } from '@/redux/erp/actions';
import { selectListItems } from '@/redux/erp/selectors';
import { useErpContext } from '@/context/erp';
import { generate as uniqueId } from 'shortid';
import { useNavigate } from 'react-router-dom';
import useResponsiveTable from '@/hooks/useResponsiveTable';
import { DOWNLOAD_BASE_URL } from '@/config/serverApiConfig';
import { request } from '@/request';
import { BiReset } from 'react-icons/bi';
import { FcBearish, FcBullish, FcSalesPerformance } from 'react-icons/fc';
import { LiaFileDownloadSolid } from 'react-icons/lia';
import { GrHistory } from 'react-icons/gr';
import HistoryModal from './HistoryModal';
import CommentForm from '@/forms/comment'
import { RiChatFollowUpLine } from "react-icons/ri";
const { Search } = Input;
const { RangePicker } = DatePicker;

function AddNewItem({ config, hasCreate = true }) {
  const navigate = useNavigate();
  const { ADD_NEW_ENTITY, entity } = config;

  const handleClick = () => {
    navigate(`/${entity.toLowerCase()}/create`);
  };

  if (hasCreate)
    return (
      <Button onClick={handleClick} type="primary" icon={<PlusOutlined />}>
        {ADD_NEW_ENTITY}
      </Button>
    );
  else return null;
}
export default function DataTable({ config, extra = [] }) {
  const translate = useLanguage();
  let { entity, dataTableColumns, create = true } = config;
  const { result: listResult, isLoading: listIsLoading } = useSelector(selectListItems);
  const { items: dataSource, pagination } = listResult;
  const { erpContextAction } = useErpContext();
  const { modal } = erpContextAction;
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
  const [paymentData, setPaymentData] = useState({ result: null });
  const [searchQuery, setSearchQuery] = useState('');
  const [historyData, setHistoryData] = useState(null); // State to hold history data
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [role, setRole] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [selectedFollowup, setSelectedFollowup] = useState(null);
  const [commentRecord, setCommentRecord] = useState(null);
  const [showCommentDrawer, setShowCommentDrawer] = useState(false);
  const [followstartDate, setFollowStartDate] = useState(null);
  const [followendDate, setFollowEndDate] = useState(null);
  // Retrieve the role from localStorage
  useEffect(() => {
    const userData = JSON.parse(window.localStorage.getItem('auth'));
    setRole(userData.current.role);
  }, []);

  const handelDataTableLoad = useCallback((pagination) => {
    const options = { page: pagination.current || 1, items: pagination.pageSize || 10 };
    dispatch(erp.list({
      entity, options
    }));
  }, []);

  const handleExportToExcel = () => {
    if (dataSource.length === 0) {
      return;
    }
    const fileName = 'data.xlsx';

    const exportData = [
      dataTableColumns.map(column => column.title),
      ...dataSource.map(item => dataTableColumns.map(column => {
        let value = item;
        const dataIndex = column.dataIndex;
        const keys = dataIndex ? (Array.isArray(dataIndex) ? dataIndex : dataIndex.split('.')) : [];
        keys.forEach(key => {
          value = value?.[key];
        });
        return value;
      })),
    ];

    const ws = XLSX.utils.aoa_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Lead Data');

    try {
      XLSX.writeFile(wb, fileName);
    } catch (error) {
      console.error('Error exporting data to Excel:', error);
    }
  };

  const handleDateRangeChange = (dates) => {
    if (dates && dates.length === 2) {
      setStartDate(dates[0]);
      setEndDate(dates[1].endOf('day')); // Set the end date to the end of the day
    } else {
      setStartDate(null);
      setEndDate(null); // Clear dates if not a valid range
    }
  };

  useEffect(() => {
    handelDataTableLoad({}, searchQuery); // Call the function initially without filters
  }, []);

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
          startDate: startDate,
          endDate: endDate,
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
  }, [selectedUniversity, selectedInstitute, selectedStatus, selectedPaymentMode, selectedPaymentType, startDate, endDate]);


  useEffect(() => {
    const fetchData = async () => {
      const { result } = await request.filter({ entity: 'payment' });
      if (result) {
        const uniquePaymentMode = [...new Set(result.map(item => item.payment_mode))];
        const uniquePaymentType = [...new Set(result.map(item => item.payment_type))];
        const uniqueStatuses = [...new Set(result.map(item => item.status))];
        const uniqueInstitutes = [...new Set(result.map(item => item.institute_name))];
        const uniqueUniversities = [...new Set(result.map(item => item.university_name))];
        const uniqueUserNames = [...new Set(result.map(item => item.userId?.fullname))];
        setStatuses(uniqueStatuses);
        setPaymentType(uniquePaymentType);
        setInstitutes(uniqueInstitutes);
        setPaymentMode(uniquePaymentMode);
        setUniversities(uniqueUniversities);
        setUserNames(uniqueUserNames); // New state for unique user names
      }
    };

    fetchData();
    handelDataTableLoad({}, searchQuery); // Include searchQuery here
  }, [searchQuery, handelDataTableLoad]);

  // Function to reset all values
  const resetValues = () => {
    setSelectedInstitute(null);
    setSelectedUniversity(null);
    setSelectedStatus(null);
    setSelectedUserId(null);
    setSelectedPaymentMode(null)
    setSelectedPaymentType(null)
    setStartDate(null);
    setEndDate(null);
    setFollowStartDate(null);
    setFollowEndDate(null);
    setSelectedFollowup(null);
  };
  useEffect(() => {
    const controller = new AbortController();
    return () => {
      controller.abort();
    };
  }, []);


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
    window.open(`${DOWNLOAD_BASE_URL}${entity}/${entity}-${record._id}.pdf`, '_blank');
  };

  const handleDelete = (record) => {
    dispatch(erp.currentAction({ actionType: 'delete', data: record }));
    modal.open();
  };


  const handleFollowup = (record) => {
    setCommentRecord(record); // Store the record
    setShowCommentDrawer(true); // Open the Drawer
  };
  const closeCommentDrawer = () => {
    setShowCommentDrawer(false); // Close the Drawer
    setCommentRecord(null); // Clear the record
  };

  // Function to handle history button click
  const handleHistory = async (record) => {
    try {
      const historyData = await request.history({ entity: 'payment', id: record._id });
      // Sort the history data in descending order based on the time it was changed
      if (historyData && historyData.history) {
        historyData.history.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      }
      setHistoryData(historyData);
      setShowHistoryModal(true); // Show history modal
    } catch (error) {
      console.error("Error fetching history data:", error);
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
          menu={{
            items,
            onClick: ({ key }) => {
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
            },
          }}
          trigger={['click']}
        >
          <EllipsisOutlined
            style={{ cursor: 'pointer', fontSize: '24px' }}
            onClick={(e) => e.preventDefault()}
          />
        </Dropdown>
      ),
    },
  ];

  const dispatch = useDispatch();

  const filterDataSource = (data) => {
    return data.filter(item => {
      // Extract the date from your data source (assuming it's stored as a Date object)
      const itemDate = new Date(item.created); // Change 'created' to the key where your date is stored

      // Check if the item date falls within the selected date range
      const dateMatch = (!startDate || !endDate || (itemDate >= startDate && itemDate <= endDate));


      const followDate = new Date(item.followUpDate); // Change 'created' to the key where your date is stored

      // Check if the item date falls within the selected date range
      const followUpdateMatch = (!followstartDate || !followendDate || (followDate >= followstartDate && followDate <= followendDate));


      // Your existing filters
      const instituteMatch = !selectedInstitute || (item && item.institute_name === selectedInstitute);
      const universityMatch = !selectedUniversity || (item && item.university_name === selectedUniversity);
      const statusMatch = !selectedStatus || (item && item.status === selectedStatus);
      const userMatch = !selectedUserId || (item && item.userId?.fullname === selectedUserId);


      const phoneAsString = item && item.phone?.toString();
      const emailLowerCase = item && item.email?.toLowerCase();

      const searchMatch = !searchQuery || (
        (item && item.lead_id && item.lead_id.includes(searchQuery)) ||
        (emailLowerCase && emailLowerCase.includes(searchQuery.toLowerCase())) ||
        (typeof phoneAsString === 'string' && phoneAsString.includes(searchQuery)) ||
        (item && item.full_name && item.full_name.includes(searchQuery))
      );

      // Check if follow-up status matches
      let followupMatch = true;
      if (selectedFollowup === 'follow-up') {
        followupMatch = item.followStatus === 'follow-up';
      }

      // Return true only if all conditions match
      return dateMatch && instituteMatch && universityMatch && statusMatch && userMatch && followupMatch && followUpdateMatch && searchMatch;
    });
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
  const handleSearch = (value) => {
    setSearchQuery(value);
    handelDataTableLoad({}, value); // Trigger search on each keystroke
  };
  const renderTable = () => {
    const filteredData = filterDataSource(dataSource);
    return (
      <>
        <Card>
          <div ref={tableHeader}>
            <div>
              <div className='flex justify-between items-center'>
                <div className='grid grid-rows-1 gap-1 font-thin text-xs text-red-500 '>
                  {entity === 'payment' && (
                    <div className='flex items-center gap-2'>
                      <div className="flex justify-center items-center text-red-500">
                        <span className='font-thin text-sm'>Total:</span> <span className='font-thin text-sm'> {pagination.total}</span>
                      </div>
                      <Search
                        placeholder="Search by email"
                        onSearch={handleSearch} // Remove this line
                        onChange={(e) => handleSearch(e.target.value)} // Add this line
                        className='w-full'
                      />
                    </div>
                  )}
                </div>
                <div className='flex items-center gap-1'>
                  {entity === 'teams' && (
                    <AddNewItem config={config} key={`${uniqueId()}`} hasCreate={create} />
                  )}
                  <div>
                    <LiaFileDownloadSolid title='Export excel' onClick={handleExportToExcel} className='text-3xl text-blue-500 hover:text-blue-700 cursor-pointer font-thin' />
                  </div>
                </div>
              </div>
            </div>

          </div>
          <div className='space30'></div>
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
    )
  }


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
                <div className={`text-${card.color}-500 mb-2 text-sm font-normal font-serif`}>
                  {card.title}
                </div>
                <div className={`text-${card.color}-500 text-2xl`}>₹ {card.value}</div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    );
  });

  const handlePaymentStatus = (status) => {
    setSelectedFollowup(status);
  };

  const handleFollowupDateRangeChange = (dates) => {
    if (dates && dates.length === 2) {
      setFollowStartDate(dates[0]);
      setFollowEndDate(dates[1].endOf('day')); // Set the end date to the end of the day
    } else {
      setFollowStartDate(null);
      setFollowEndDate(null); // Clear dates if not a valid range
    }
  };

  const filterRender = () => {
    const filtered = filterDataSource(dataSource);
    const followupCount = filtered.filter(item => item.followStatus === 'follow-up').length;
    return (
      <div>
        <div className='flex items-center space-x-2'>
          <div>
            {/* Select for Institute */}
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
                <Select.Option key={institute}>{institute}</Select.Option>
              ))}
            </Select>
          </div>
          <div>
            {/* Select for University */}
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
                <Select.Option key={university}>{university}</Select.Option>
              ))}
            </Select>
          </div>
          <div>
            {/* Select for Status */}
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
                <Select.Option key={status}>{status}</Select.Option>
              ))}
            </Select>
          </div>
          {/* Select for User Full Name */}
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
                <Select.Option className="capitalize font-thin font-mono" key={paymentmode}>
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
                <Select.Option className="capitalize font-thin font-mono" key={paymenttype}>
                  {paymenttype}
                </Select.Option>
              ))}
            </Select>
          </div>
        </div>
        <div className='flex items-center space-x-2'>
          <div>
            <Select
              showSearch
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              placeholder="Select user full name"
              className='w-60 h-10 capitalize mt-3'
              value={selectedUserId}
              onChange={(value) => setSelectedUserId(value)}
            >
              {userNames.map((userName) => (
                <Select.Option className="capitalize font-thin font-mono" key={userName}>
                  {userName}
                </Select.Option>
              ))}
            </Select>
          </div>
          <div>
            <RangePicker
              className='w-60 h-10 mt-3 capitalize'
              onChange={handleDateRangeChange}
              style={{ width: '100%' }}
              placeholder={['Start Date', 'End Date']}
            />
          </div>
          <div>
            {/* Button to filter Payment Received */}
            <Button className='w-48 h-9 mt-3 capitalize text-center text-sm font-thin hover:bg-cyan-100 bg-cyan-100 hover:text-cyan-700 text-cyan-700 border-cyan-500 hover:border-cyan-500 rounded-none' onClick={() => handlePaymentStatus('follow-up')}>
              <span className="font-thin text-sm -ml-2">Follow-uP</span>
              <span className="font-thin text-sm ml-1">({followupCount})</span>
            </Button>
          </div>
          <div>
            <RangePicker
              className='w-60 h-10 mt-3 capitalize'
              onChange={handleFollowupDateRangeChange}
              style={{ width: '100%' }}
              placeholder={['Follow-UP Date', 'End Date']}
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
  };

  return (
    <>
      <div>
        {filterRender()}
      </div>
      <div className='space30'></div>
      {['admin', 'subadmin'].includes(role) && (
        <div>
          <div className='space30'></div>
          <div className='flex gap-4'>
            {amountCards}
          </div>
        </div>
      )}
      <div className='space30'></div>
      <div>
        {renderTable()}
      </div>
      <HistoryModal
        showHistoryModal={showHistoryModal}
        historyData={historyData}
        onClose={() => setShowHistoryModal(false)}
      />
      <Drawer
        title={
          <div>
            <div className='relative float-right font-thin text-lg'>FollowUP & Comments</div>
          </div>
        }
        placement="right" // The Drawer opens from the right
        open={showCommentDrawer} // Controlled by state
        onClose={closeCommentDrawer} // Close action
        width={500}
      >
        {/* Render the CommentForm only if a record is set */}
        {commentRecord && (
          <CommentForm
            entity="lead"
            id={commentRecord.applicationId}
            recordDetails={commentRecord}
          />
        )}
      </Drawer>
    </>
  );
}


