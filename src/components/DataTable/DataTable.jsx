import React, { useCallback, useEffect, useState } from 'react';
import { EyeOutlined, EditOutlined, DeleteOutlined, EllipsisOutlined } from '@ant-design/icons';
import { Dropdown, Table, Button, Card, Select, Input, DatePicker, Menu, Drawer, Modal } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { crud } from '@/redux/crud/actions';
import { LiaRupeeSignSolid } from "react-icons/lia";
import { selectCreatedItem, selectListItems } from '@/redux/crud/selectors';
import useLanguage from '@/locale/useLanguage';
import useResponsiveTable from '@/hooks/useResponsiveTable';
import { GrHistory } from "react-icons/gr";
import { useCrudContext } from '@/context/crud';
import * as XLSX from 'xlsx';
import { request } from '@/request';
import { BiReset } from 'react-icons/bi';
import { LiaFileDownloadSolid } from "react-icons/lia";
import { debounce } from 'lodash';
import UpdatePaymentForm from '@/forms/AddPayment';
import UploadDocumentForm from '@/forms/uploadDocument';
import { IoDocumentAttachOutline } from "react-icons/io5";
import StudentDetailsModal from '../StudentDetailsModal';
import LMSModal from '../LMSModal';
import { AiOutlineComment } from "react-icons/ai";
import HistoryModal from '../HistoryModal';
import { IoFilterOutline } from "react-icons/io5";
import { selectCurrentAdmin } from '@/redux/auth/selectors';
import CommentForm from '@/forms/comment'
import { BsSend } from "react-icons/bs";
const { Search } = Input;
const { RangePicker } = DatePicker;

function AddNewItem({ config }) {
  const { crudContextAction } = useCrudContext();
  const { collapsedBox, panel } = crudContextAction;
  const { ADD_NEW_ENTITY } = config;

  const handelClick = () => {
    panel.open();
    collapsedBox.close();
  };

  return (
    <Button onClick={handelClick} type="primary">
      {ADD_NEW_ENTITY}
    </Button>
  );
}

export default function DataTable({ config, extra = [] }) {
  let { entity, dataTableColumns } = config;
  const { isSuccess } = useSelector(selectCreatedItem);
  const dispatch = useDispatch();
  const { crudContextAction } = useCrudContext();
  const { panel, collapsedBox, modal, editBox, advancedBox } = crudContextAction;
  const translate = useLanguage();
  const [selectedInstitute, setSelectedInstitute] = useState(null);
  const [selectedInstallment, setSelectedInstallment] = useState(null);
  const [selectedUniversity, setSelectedUniversity] = useState(null);
  const [selectedSession, setSelectedSession] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [statuses, setStatuses] = useState([]);
  const [institutes, setInstitutes] = useState([]);
  const [installment, setInstallment] = useState([]);
  const [universities, setUniversities] = useState([]);
  const [session, setSession] = useState([]);
  const [userNames, setUserNames] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [historyData, setHistoryData] = useState(null);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showAddPaymentModal, setShowAddPaymentModal] = useState(false);
  const [updatePaymentRecord, setUpdatePaymentRecord] = useState(null);
  const [Paymentstatus, setSelectedPaymentstatus] = useState(null);
  const [lmsFilter, setLmsFilter] = useState(null);
  const [showUploadDocumentDrawer, setShowUploadDocumentDrawer] = useState(false); // New state to control the drawer
  const [recordForUploadDocument, setRecordForUploadDocument] = useState(null); // Record to be used in the upload document form
  const [selectedPaymentMode, setSelectedPaymentMode] = useState(null);
  const [paymentMode, setPaymentMode] = useState([]);
  const [showCommentDrawer, setShowCommentDrawer] = useState(false);
  const [commentRecord, setCommentRecord] = useState(null);
  const currentAdmin = useSelector(selectCurrentAdmin);
  const [showStudentDetailsDrawer, setShowStudentDetailsDrawer] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null); // To track selected team leader
  const [prevStartDate, setPrevStartDate] = useState(null);
  const [prevEndDate, setPrevEndDate] = useState(null);
  const [showLMSDrawer, setShowLMSDrawer] = useState(false);
  const [LMSRecord, setLMSRecord] = useState(null);
  // buttons call function 
  const isAdmin = ['admin', 'subadmin', 'manager', 'supportiveassociate'].includes(currentAdmin?.role);

  const handleShowStudentDetails = (record) => {
    setSelectedStudent(record); // Store selected student details
    setShowStudentDetailsDrawer(true); // Open the drawer
  };

  const handleComment = (record) => {
    setCommentRecord(record); // Store the record
    setShowCommentDrawer(true); // Open the Drawer
  };

  const handleLMS = (record) => {
    setLMSRecord(record); // Store the record
    setShowLMSDrawer(true); // Open the Drawer
  };

  const closeCommentDrawer = () => {
    setShowCommentDrawer(false); // Close the Drawer
    setCommentRecord(null); // Clear the record
  };

  const closeLMSDrawer = () => {
    setShowLMSDrawer(false); // Close the Drawer
    setLMSRecord(null); // Clear the record
  };


  const handleCancelAddPaymentModal = () => {
    setShowAddPaymentModal(false);
    setUpdatePaymentRecord(null);
  };

  const handleSuccessUpdate = () => {
    setShowAddPaymentModal(false); // Close the payment modal
    handelDataTableLoad({}, searchQuery); // Reload the table data
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

  const handleOptionSelect = (option) => {
    setLmsFilter(option); // Set the filter to "yes" or "no"
    handelDataTableLoad(); // Reload the table data with the new filter
  };

  const handleHistory = async (record) => {
    try {
      const historyData = await request.history({ entity: 'lead', id: record._id });
      // Sort the history data in descending order based on the time it was changed
      if (historyData && historyData.history) {
        historyData.history.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      }
      setHistoryData(historyData);
      setShowHistoryModal(true);
    } catch (error) {
      console.error("Error fetching history data:", error);
    }
  };


  const handleEdit = (record) => {
    dispatch(crud.currentItem({ data: record }));
    dispatch(crud.currentAction({ actionType: 'update', data: record }));
    editBox.open();
    panel.open();
    collapsedBox.open();
  };

  const handleAddpayment = async (record) => {
    setUpdatePaymentRecord(record); // Ensure record details are correctly set
    setShowAddPaymentModal(true);
  };

  // Function to handle document upload drawer open
  const handleUploadDocument = (record) => {
    setRecordForUploadDocument(record); // Store the record to be used in the form
    setShowUploadDocumentDrawer(true); // Open the drawer
  };

  // Close the drawer
  const closeUploadDocumentDrawer = () => {
    setShowUploadDocumentDrawer(false);
    setRecordForUploadDocument(null);
  };


  const handleDelete = (record) => {
    dispatch(crud.currentAction({ actionType: 'delete', data: record }));
    modal.open();
  };

  const handleUpdatePassword = (record) => {
    dispatch(crud.currentItem({ data: record }));
    dispatch(crud.currentAction({ actionType: 'update', data: record }));
    advancedBox.open();
    panel.open();
    collapsedBox.open();
  };

  // buttons call function 


  useEffect(() => {
    const fetchData = async () => {
      const { success, result } = await request.list({ entity: 'lead' });
      if (success) {
        const uniqueStatuses = [...new Set(result.map(item => item.customfields.status))];
        const uniqueInstitutes = [...new Set(result.map(item => item.customfields.institute_name))];
        const uniqueInstallment = [...new Set(result.map(item => item.customfields.installment_type))];
        const uniqueSession = [...new Set(result.map(item => item.customfields.session))];
        const uniqueUniversities = [...new Set(result.map(item => item.customfields.university_name))];
        const uniquePaymentMode = [...new Set(result.map(item => item.customfields.payment_mode))];
        const uniqueUserNames = [...new Set(result.map(item => item.userId?.fullname))];

        setStatuses(uniqueStatuses);
        setInstitutes(uniqueInstitutes);
        setInstallment(uniqueInstallment);
        setSession(uniqueSession);
        setUniversities(uniqueUniversities);
        setUserNames(uniqueUserNames);
        setPaymentMode(uniquePaymentMode);
      }
    };

    fetchData();
  }, [isSuccess]);

  const handlePrevDateRangeChange = (dates) => {
    if (dates && dates.length === 2) {
      setPrevStartDate(dates[0]);
      setPrevEndDate(dates[1].endOf('day')); // Set the end date to the end of the day
    } else {
      setPrevStartDate(null);
      setPrevEndDate(null); // Clear dates if not a valid range
    }
  };

  const resetValues = () => {
    setSelectedInstitute(null);
    setSelectedInstallment(null);
    setSelectedUniversity(null);
    setSelectedSession(null);
    setSelectedStatus(null);
    setSelectedUserId(null);
    setSearchQuery('');
    setStartDate(null);
    setSelectedPaymentMode(null)
    setEndDate(null);
    setSelectedPaymentstatus(null)
    setLmsFilter(null)
    setPrevStartDate(null);
    setPrevEndDate(null);
  };


  const items = isAdmin
    ? [
      {
        label: translate('Show'),
        key: 'showDetails',
        icon: <EyeOutlined />,
      },
      {
        label: translate('Edit'),
        key: 'edit',
        icon: <EditOutlined />,
      },
      {
        label: translate('History'),
        key: 'history',
        icon: <GrHistory />,
      },
      {
        label: translate('Add_payment'),
        key: 'add',
        icon: <LiaRupeeSignSolid className='text-base' />,
      },
      ...extra,
      {
        type: 'divider',
      },
      {
        label: translate('Upload_document'),
        key: 'upload',
        icon: <IoDocumentAttachOutline />,
      },
      {
        label: 'LMS',
        key: 'lms',
        icon: <BsSend />,
      },
      {
        label: translate('Comments'),
        key: 'comments',
        icon: <AiOutlineComment className='text-base' />,
      },
      {
        label: translate('Delete'),
        key: 'delete',
        icon: <DeleteOutlined />,
      },
    ] : [
      {
        label: translate('Show'),
        key: 'showDetails',
        icon: <EyeOutlined />,
      },
      {
        label: translate('Edit'),
        key: 'edit',
        icon: <EditOutlined />,
      },
      ...extra,
      {
        type: 'divider',
      },
      {
        label: translate('Upload_document'),
        key: 'upload',
        icon: <IoDocumentAttachOutline />,
      },
    ]


  dataTableColumns = [
    ...dataTableColumns,
    {
      title: 'Action',
      key: 'action',
      fixed: 'right',
      render: (_, record) => (
        <Dropdown
          menu={{
            items: entity === 'lead' ? items : items.filter(item => item.key !== 'showDetails' && item.key !== 'add' && item.key !== 'history'), // Conditionally render items based on the entity
            onClick: ({ key }) => {
              switch (key) {
                case 'showDetails':
                  handleShowStudentDetails(record); // Handle the "Show" action
                  break;
                case 'edit':
                  handleEdit(record);
                  break;
                case 'delete':
                  handleDelete(record);
                  break;
                case 'updatePassword':
                  handleUpdatePassword(record);
                  break;
                case 'add':
                  handleAddpayment(record);
                  break;
                case 'comments':
                  handleComment(record);
                  break;
                case 'lms':
                  handleLMS(record);
                  break;
                case 'upload':
                  handleUploadDocument(record); // Open the drawer for document upload
                  break;
                case 'history':
                  handleHistory(record);
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


  const { result: listResult, isLoading: listIsLoading } = useSelector(selectListItems);
  const { items: dataSource } = listResult;

  const handelDataTableLoad = useCallback(
    async (newSearchQuery = '') => {
      const options = {
        filter: {
          q: newSearchQuery,
          institute: selectedInstitute,
          paymentMode: selectedPaymentMode,
          university: selectedUniversity,
          session: selectedSession,
          status: selectedStatus,
          userId: selectedUserId,
          startDate,
          endDate,
        },
      };

      const { success, result } = await dispatch(crud.list({ entity, options }));
      if (success) {
        const filteredData = filterDataSource(result);
      }
    },
    [entity, selectedInstitute, selectedUniversity, selectedStatus, selectedUserId, selectedSession, startDate, endDate, selectedPaymentMode]
  );


  const handleSearch = debounce((value) => {
    setSearchQuery(value);
    handelDataTableLoad({}, value);
  }, 500);

  const dispatcher = () => {
    dispatch(crud.list({ entity }));
  };

  useEffect(() => {
    const controller = new AbortController();
    dispatcher();
    return () => {
      controller.abort();
    };
  }, [entity]);

  const { tableColumns } = useResponsiveTable(dataTableColumns, items);

  const filterDataSource = (data) => {
    return data.filter(item => {
      const customfields = item.customfields || {};
      const instituteMatch = !selectedInstitute || customfields.institute_name === selectedInstitute;
      const installmentMatch = !selectedInstallment || customfields.installment_type === selectedInstallment;
      const universityMatch = !selectedUniversity || customfields.university_name === selectedUniversity;
      const paymentmodeMatch = !selectedPaymentMode || customfields.payment_mode === selectedPaymentMode;
      const sessionMatch = !selectedSession || customfields.session === selectedSession;
      const statusMatch = !selectedStatus || customfields.status === selectedStatus;
      const userMatch = !selectedUserId || item.userId?.fullname === selectedUserId;

      const createdDate = new Date(item.created);
      const startDateMatch = !startDate || createdDate >= startDate;
      const endDateMatch = !endDate || createdDate <= endDate;

      const phoneAsString = item.contact?.phone?.toString();
      const emailLowerCase = item.contact?.email?.toLowerCase();

      const searchMatch = !searchQuery || (
        item.lead_id.includes(searchQuery) ||
        (emailLowerCase && emailLowerCase.includes(searchQuery.toLowerCase())) ||
        (typeof phoneAsString === 'string' && phoneAsString.includes(searchQuery)) ||
        item.full_name.includes(searchQuery)
      );

      // Check if paymentStatus matches
      let paymentStatusMatch = true;
      if (Paymentstatus === 'payment received') {
        paymentStatusMatch = customfields.paymentStatus === 'payment received';
      } else if (Paymentstatus === 'payment rejected') {
        paymentStatusMatch = customfields.paymentStatus === 'payment rejected';
      } else if (Paymentstatus === 'payment approved') {
        paymentStatusMatch = customfields.paymentStatus === 'payment approved';
      }

      // If there is a specific condition for lmsFilter
      let lmsMatch = true; // Default is true (no filtering by "Yes" or "No")
      if (lmsFilter) {
        if (lmsFilter === 'yes') {
          lmsMatch = customfields.lmsStatus === 'yes'; // Change `someProperty` to the relevant property
        } else if (lmsFilter === 'no') {
          lmsMatch = customfields.lmsStatus === 'no'; // Change `someProperty` to the relevant property
        }
      }

      return instituteMatch && universityMatch && sessionMatch && searchMatch && statusMatch && userMatch && startDateMatch && endDateMatch && paymentStatusMatch && lmsMatch && paymentmodeMatch && installmentMatch;
    });
  };


  const menu = (
    <Menu onClick={({ key }) => handleOptionSelect(key)}>
      <Menu.Item
        key="yes"
        className={`${lmsFilter === 'yes' ? 'bg-blue-100 text-blue-600' : ''}`}
      >
        Yes
      </Menu.Item>
      <Menu.Item
        key="no"
        className={`${lmsFilter === 'no' ? 'bg-red-100 text-red-600' : ''}`}
      >
        No
      </Menu.Item>
    </Menu>
  );

  const renderTable = () => {
    const filteredData = filterDataSource(dataSource);
    return (
      <>
        <div className='mt-12'>
          <div className='flex justify-between items-center mb-3'>
            {entity === 'lead' && (
              <div className='flex items-center gap-2'>
                <div className="flex justify-center items-center text-red-500">
                  <span className='font-thin text-sm'>Total:</span> <span className='font-thin text-sm'> {filteredData.length}</span>
                </div>
                <Search
                  placeholder="Search by email"
                  onSearch={handleSearch}
                  onChange={(e) => handleSearch(e.target.value)}
                  className='w-full'
                />
              </div>
            )}
            {entity === 'admin' && (
              <div className='flex items-center gap-2'>
                <div className="flex justify-center items-center text-red-500">
                  <span className='font-thin text-sm'>Total:</span> <span className='font-thin text-sm'> {filteredData.length}</span>
                </div>
              </div>
            )}
            <div className='space-x-2 flex items-center'>
              <AddNewItem key="addNewItem" config={config} />
              <div className='font-thin'>
                <LiaFileDownloadSolid title='Export excel' onClick={handleExportToExcel} className='text-3xl text-blue-500 hover:text-blue-700 cursor-pointer' />
              </div>
              <Dropdown overlay={menu} trigger={['click']}>
                <div className='flex items-center gap-1.5 text-sm uppercase rounded-full border border-gray-400 bg-gray-50 px-1 cursor-pointer'>
                  <span><IoFilterOutline /></span>
                  <span>lms</span>
                </div>
              </Dropdown>
            </div>
          </div>
          <Table
            columns={tableColumns}
            rowKey={(item) => item._id}
            dataSource={filteredData}
            loading={listIsLoading}
            pagination={true}
            onChange={handelDataTableLoad}
          />
        </div>
      </>
    );
  };

  const handlePaymentStatus = (status) => {
    setSelectedPaymentstatus(status);
  };

  const renderFilters = () => {
    const filtered = filterDataSource(dataSource);
    const paymentReceivedCount = filtered.filter(item => item.customfields?.paymentStatus === 'payment received').length;
    const paymentApprovedCount = filtered.filter(item => item.customfields?.paymentStatus === 'payment approved').length;
    const paymentRejectedCount = filtered.filter(item => item.customfields?.paymentStatus === 'payment rejected').length;

    if (entity === 'lead') {
      return (
        <div>
          <div className='flex items-center gap-3 flex-wrap'>
            <div>
              <Select showSearch optionFilterProp="children" filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
                placeholder="Select institute"
                className='w-48 h-7 capitalize'
                value={selectedInstitute}
                onChange={(value) => setSelectedInstitute(value)}
              >
                {institutes.map(institute => (
                  <Select.Option key={institute}>{institute}</Select.Option>
                ))}
              </Select>
            </div>
            <div>
              <Select showSearch optionFilterProp="children" filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
                placeholder="Select university"
                className='w-48 h-7 capitalize'
                value={selectedUniversity}
                onChange={(value) => setSelectedUniversity(value)}
              >
                {universities.map(university => (
                  <Select.Option key={university}>{university}</Select.Option>
                ))}
              </Select>
            </div>
            <div>
              <Select showSearch optionFilterProp="children" filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
                placeholder="Select status"
                className='w-48 h-7 capitalize'
                value={selectedStatus}
                onChange={(value) => setSelectedStatus(value)}
              >
                {statuses.map(status => (
                  <Select.Option key={status}>{status}</Select.Option>
                ))}
              </Select>
            </div>
            <div>
              <Select showSearch optionFilterProp="children" filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
                placeholder="Select user full name"
                className='w-48 h-7 capitalize'
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
              <Select showSearch optionFilterProp="children" filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
                placeholder="Select session"
                className='w-48 h-7 capitalize'
                value={selectedSession}
                onChange={(value) => setSelectedSession(value)}
              >
                {session.map((session) => (
                  <Select.Option className="capitalize font-thin font-mono" key={session}>
                    {session}
                  </Select.Option>
                ))}
              </Select>
            </div>
            <div>
              <Select showSearch optionFilterProp="children" filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
                placeholder="Select payment mode"
                className='w-48 h-7 capitalize'
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
                placeholder="Select installment type"
                className='w-48 h-7 capitalize'
                value={selectedInstallment}
                onChange={(value) => setSelectedInstallment(value)}
              >
                {installment.map(install => (
                  <Select.Option key={install}>{install}</Select.Option>
                ))}
              </Select>
            </div>
            <div>
              <RangePicker
                className='w-48 h-7 capitalize rounded-none'
                onChange={handleDateRangeChange}
                style={{ width: '100%' }}
                placeholder={['Start Date', 'End Date']}
              />
            </div>
            <div>
              {/* Button to filter Payment Received */}
              <Button className='w-48 h-7 capitalize text-center text-sm font-thin hover:bg-cyan-100 bg-cyan-100 hover:text-cyan-700 text-cyan-700 border-cyan-500 hover:border-cyan-500 rounded-none' onClick={() => handlePaymentStatus('payment received')}>
                <span className="font-thin text-sm -ml-2">Received</span>
                <span className="font-thin text-sm ml-1">({paymentReceivedCount})</span>
              </Button>
            </div>
            <div>
              {/* Button to filter Payment Approved */}
              <Button className='w-48 h-7 capitalize text-center text-sm font-thin hover:bg-green-100 bg-green-100 hover:text-green-700 text-green-700 hover:border-green-500 border-green-600 rounded-none' onClick={() => handlePaymentStatus('payment approved')}>
                <span className="font-thin text-sm -ml-2">Approved</span>
                <span className="font-thin text-sm ml-1">({paymentApprovedCount})</span>
              </Button>
            </div>
            <div>
              {/* Button to filter Payment Rejected */}
              <Button className='w-48 h-7 capitalize text-center text-sm font-thin hover:bg-red-100 bg-red-100 hover:text-red-700 text-red-700 hover:border-red-500 border-red-600 rounded-none' onClick={() => handlePaymentStatus('payment rejected')}>
                <span className="font-thin text-sm -ml-2">Rejected</span>
                <span className="font-thin text-sm ml-1">({paymentRejectedCount})</span>
              </Button>
            </div>

          </div>
          <div className='relative float-right -mt-8 mr-2'>
            <Button title='Reset All Filters' onClick={resetValues} className='text-red-500 hover:text-red-600 bg-white rounded-none h-7'>
              <BiReset />
            </Button>
          </div>
        </div>
      );
    }

    return null;
  };

  // Add useEffect to handle automatic table reload
  useEffect(() => {
    if (isSuccess) {
      handelDataTableLoad({}, searchQuery); // Call handelDataTableLoad function with the current searchQuery
    }
  }, [isSuccess, searchQuery]);


  return (
    <>
      <Card className='w-full rounded-none'>
        {renderFilters()}
        {renderTable()}
      </Card>
      <Drawer
        title="Add Payment"
        open={showAddPaymentModal}
        onClose={handleCancelAddPaymentModal}
        footer={null}
        width={500}
      >
        {/* Pass the onCloseModal callback to the UpdatePaymentForm component */}
        {updatePaymentRecord && <UpdatePaymentForm entity="lead" id={updatePaymentRecord?._id} recordDetails={updatePaymentRecord} onCloseModal={handleSuccessUpdate} />}
      </Drawer>
      <Drawer
        title="Upload Document"
        open={showUploadDocumentDrawer} // Controlled by state
        onClose={closeUploadDocumentDrawer} // Close action
        footer={null}
        width={500}
      >
        {/* Render the form only if a record is set */}
        {recordForUploadDocument && (
          <UploadDocumentForm
            entity="lead"
            id={recordForUploadDocument?._id}
            recordDetails={recordForUploadDocument}
            onCloseModal={closeUploadDocumentDrawer} // Pass the close function to the form
          />
        )}
      </Drawer>
      <Drawer
        title={
          <div>
            <div className='relative float-right font-thin text-lg'>Comments</div>
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
            id={commentRecord._id}
            recordDetails={commentRecord}
          />
        )}
      </Drawer>

      <Drawer
        title={
          <div>
            <div className='relative font-thin text-base float-right'>
              Student Details
            </div>
          </div>
        }
        placement="right" // Drawer opens from the right
        open={showStudentDetailsDrawer} // Controlled by state
        onClose={() => setShowStudentDetailsDrawer(false)} // Close action
        width={1000} // Adjust as needed
      >
        {/* Display the component only if selectedStudent is set */}
        {selectedStudent && (
          <StudentDetailsModal
            visible={showStudentDetailsDrawer}
            onClose={() => setShowStudentDetailsDrawer(false)} // Function to close drawer
            student={selectedStudent} // Pass the student data
          />
        )}
      </Drawer>
      <HistoryModal
        showHistoryModal={showHistoryModal}
        historyData={historyData}
        onClose={() => setShowHistoryModal(false)}
      />
      <Drawer
        title={
          <div>
            <div className='relative float-right font-thin text-lg'>LMS Status</div>
          </div>
        }
        open={showLMSDrawer} // Controlled by state
        onClose={closeLMSDrawer} // Close action
        width={1000}
      >
        {/* Render the CommentForm only if a record is set */}
        {LMSRecord && (
          <LMSModal
            entity="lead"
            id={LMSRecord._id}
            recordDetails={LMSRecord}
          />
        )}
      </Drawer>
    </>
  );
}