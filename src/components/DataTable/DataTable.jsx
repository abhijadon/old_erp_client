import React, { useCallback, useEffect, useState } from 'react';
import { EyeOutlined, EditOutlined, DeleteOutlined, EllipsisOutlined } from '@ant-design/icons';
import { Dropdown, Table, Button, Card, Select, Input, DatePicker, Menu, Drawer, Checkbox, Radio } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { crud } from '@/redux/crud/actions';
import { LiaRupeeSignSolid } from "react-icons/lia";
import { selectCreatedItem, selectListItems } from '@/redux/crud/selectors';
import useLanguage from '@/locale/useLanguage';
import { GrHistory } from "react-icons/gr";
import { useCrudContext } from '@/context/crud';
import * as XLSX from 'xlsx';
import { generate as uniqueId } from 'shortid';
import { request } from '@/request';
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
import { MdOutlineLockReset } from "react-icons/md";
import { BsSend } from "react-icons/bs";
import { PiMicrosoftExcelLogo } from "react-icons/pi";
const { RangePicker } = DatePicker;
import { FiRefreshCw } from "react-icons/fi";

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
  let { entity, dataTableColumns, DATATABLE_TITLE, fields, searchConfig } = config;
  const { isSuccess } = useSelector(selectCreatedItem);
  const dispatch = useDispatch();
  const { crudContextAction } = useCrudContext();
  const { panel, collapsedBox, modal, editBox, advancedBox } = crudContextAction;
  const translate = useLanguage();
  const [statuses, setStatuses] = useState([]);
  const [institutes, setInstitutes] = useState([]);
  const [installment, setInstallment] = useState([]);
  const [universities, setUniversities] = useState([]);
  const [session, setSession] = useState([]);
  const [userNames, setUserNames] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [historyData, setHistoryData] = useState(null);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showAddPaymentModal, setShowAddPaymentModal] = useState(false);
  const [updatePaymentRecord, setUpdatePaymentRecord] = useState(null);
  const [showUploadDocumentDrawer, setShowUploadDocumentDrawer] = useState(false);
  const [recordForUploadDocument, setRecordForUploadDocument] = useState(null);
  const [paymentMode, setPaymentMode] = useState([]);
  const [showCommentDrawer, setShowCommentDrawer] = useState(false);
  const [commentRecord, setCommentRecord] = useState(null);
  const currentAdmin = useSelector(selectCurrentAdmin);
  const [isChecked, setIsChecked] = useState(false);
  const [showStudentDetailsDrawer, setShowStudentDetailsDrawer] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null); // To track selected team leader
  const [showLMSDrawer, setShowLMSDrawer] = useState(false);
  const [LMSRecord, setLMSRecord] = useState(null);
  const [filterValues, setFilterValues] = useState({
    institute_name: null,
    installment_type: null,
    university_name: null,
    session: null,
    paymentStatus: null,
    status: null,
    payment_mode: null,
    userId: null,
    welcomeMail: null,
    lmsStatus: null,
    whatsappMessageStatus: null,
    welcomeEnrolled: null,
    whatsappEnrolled: null
  });
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
      setEndDate(dates[1].endOf('day'));
    } else {
      setStartDate(null);
      setEndDate(null);
    }
  };

  useEffect(() => {
    filterData();
  }, [startDate, endDate]);

  const handleExportToExcel = () => {
    if (listResult.total === 0) {
      return;
    }

    const fileName = 'data.xlsx';
    const exportData = [
      dataTableColumns.map(column => column.title),
      ...listResult.items.map(item => dataTableColumns.map(column => {
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
      const { success, result } = await request.filter({ entity: 'lead' });
      if (success) {
        const uniqueStatuses = [...new Set(result.map(item => item.customfields.status))];
        const uniqueInstitutes = [...new Set(result.map(item => item.customfields.institute_name))];
        const uniqueInstallment = [...new Set(result.map(item => item.customfields.installment_type))];
        const uniqueSession = [...new Set(result.map(item => item.customfields.session))];
        const uniqueUniversities = [...new Set(result.map(item => item.customfields.university_name))];
        const uniquePaymentMode = [...new Set(result.map(item => item.customfields.payment_mode))];

        const uniqueUserNames = result.reduce((acc, item) => {
          const existingItem = acc.find(u => u._id === item.userId?._id);
          if (!existingItem) {
            acc.push({ fullname: item.userId?.fullname, _id: item.userId?._id });
          }
          return acc;
        }, []);

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
  }, []);

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
        label: 'Notifications',
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
  const { pagination, items: dataSource } = listResult;

  const handelDataTableLoad = useCallback((pagination) => {
    const options = { page: pagination.current || 1, items: pagination.pageSize || 10 };
    dispatch(crud.list({
      entity, options
    }));
  }, []);


  const filterTable = (e) => {
    const value = e.target.value;
    const options = { q: value, fields: searchConfig?.searchFields || '' };
    dispatch(crud.list({ entity, options }));
  };


  const filterData = (key, selectedValue) => {
    // Update the state with the selected filter
    const updatedFilterValues = {
      ...filterValues,
      [key]: selectedValue,
    };

    // Set the filter values immediately to reflect the UI change
    setFilterValues(updatedFilterValues);

    // Prepare options with only non-null and non-undefined filter values
    const options = {};
    Object.keys(updatedFilterValues).forEach(filterKey => {
      if (updatedFilterValues[filterKey] !== null && updatedFilterValues[filterKey] !== undefined) {
        options[filterKey] = updatedFilterValues[filterKey];
      }
    });

    // Include startDate and endDate in options if they are set
    if (startDate && endDate) {
      options.startDate = startDate.format('YYYY-MM-DD');
      options.endDate = endDate.format('YYYY-MM-DD');
    }

    // Handle special case for paymentStatus filter
    if (key === 'paymentStatus') {
      options.paymentStatus = selectedValue; // Update paymentStatus filter
    }
    // Dispatch Redux action to fetch data with updated filters
    dispatch(crud.list({ entity, options }));
  };


  // Handle clearing filters
  const clearFilters = () => {
    setFilterValues({
      institute_name: null,
      installment_type: null,
      university_name: null,
      session: null,
      status: null,
      paymentStatus: null,
      payment_mode: null,
      userId: null,
      welcomeMail: null,
      lmsStatus: null,
      welcomeEnrolled: null,
      whatsappMessageStatus: null,
      whatsappEnrolled: null
    });
    setStartDate(null);
    setEndDate(null);
    dispatch(crud.list({ entity }));
  };

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


  const handleCheckboxChange = (value) => {
    filterData('welcomeMail', value);
  };

  const handleCheckboxLMS = (value) => {
    filterData('lmsStatus', value);
  };

  const handlewhatsappMessageStatus = (value) => {
    filterData('whatsappMessageStatus', value);
  };

  const handleMailEnrolled = (value) => {
    filterData('welcomeEnrolled', value);
  };

  const handleWhatsappEnrolled = (value) => {
    filterData('whatsappEnrolled', value);
  };


  const menu = (
    <Menu className="radio-menu">
      <Menu.Item key="welcomeMail">
        <span className="radio-label">Welcome Mail</span>
        <Radio.Group
          onChange={(e) => handleCheckboxChange(e.target.value)}
          value={filterValues.welcomeMail}
          className="radio-group"
        >
          <Radio.Button value={null}>All</Radio.Button>
          <Radio.Button value={'Yes'}>Yes</Radio.Button>
          <Radio.Button value={'No'}>No</Radio.Button>
        </Radio.Group>
      </Menu.Item>
      <Menu.Item key="whatsappMessageStatus">
        <span className="radio-label">Welcome Whatsapp</span>
        <Radio.Group
          onChange={(e) => handlewhatsappMessageStatus(e.target.value)}
          value={filterValues.whatsappMessageStatus}
          className="radio-group"
        >
          <Radio.Button value={null}>All</Radio.Button>
          <Radio.Button value={'success'}>Yes</Radio.Button>
          <Radio.Button value={'failed'}>No</Radio.Button>
        </Radio.Group>
      </Menu.Item>
      <Menu.Item key="welcomeEnrolled">
        <span className="radio-label">Enrolled Mailed</span>
        <Radio.Group
          onChange={(e) => handleMailEnrolled(e.target.value)}
          value={filterValues.welcomeEnrolled}
          className="radio-group"
        >
          <Radio.Button value={null}>All</Radio.Button>
          <Radio.Button value={'success'}>Yes</Radio.Button>
          <Radio.Button value={'failed'}>No</Radio.Button>
        </Radio.Group>
      </Menu.Item>
      <Menu.Item key="whatsappEnrolled">
        <span className="radio-label">Enrolled Whatsapp</span>
        <Radio.Group
          onChange={(e) => handleWhatsappEnrolled(e.target.value)}
          value={filterValues.whatsappEnrolled}
          className="radio-group"
        >
          <Radio.Button value={null}>All</Radio.Button>
          <Radio.Button value={'success'}>Yes</Radio.Button>
          <Radio.Button value={'failed'}>No</Radio.Button>
        </Radio.Group>
      </Menu.Item>
      <Menu.Item key="lmsStatus">
        <span className="radio-label">LMS Status</span>
        <Radio.Group
          onChange={(e) => handleCheckboxLMS(e.target.value)}
          value={filterValues.lmsStatus}
          className="radio-group"
        >
          <Radio.Button value={null}>All</Radio.Button>
          <Radio.Button value={'yes'}>Yes</Radio.Button>
          <Radio.Button value={'no'}>No</Radio.Button>
        </Radio.Group>
      </Menu.Item>
    </Menu>
  );




  const renderTable = () => {
    return (
      <>
        <div className='mt-12'>
          <div className='flex justify-between items-center mb-3'>
            <div className='flex items-center gap-2'>
              <div className="flex justify-center items-center text-red-500">
                <span className='font-thin text-sm'>Total:</span> <span className='font-thin text-sm'> {pagination.total}</span>
              </div>
              <Input
                key={`searchFilterDataTable}`}
                onChange={filterTable}
                placeholder={translate('search')}
                allowClear
              />
            </div>
            <div className='space-x-2 flex items-center'>
              <Dropdown overlay={menu} trigger={['click']}>
                <div className='flex items-center gap-1.5 text-sm uppercase rounded-full border border-gray-400 bg-gray-50 px-1 h-6 cursor-pointer'>
                  <span><IoFilterOutline /></span>
                  <span>Filters</span>
                </div>
              </Dropdown>
              <Button title='Export excel' onClick={handleExportToExcel} className='text-green-800 bg-green-300 hover:text-green-700 hover:bg-green-100 border-none hover:border-none' icon={<PiMicrosoftExcelLogo />}> Excel</Button>
              <Button title='Reset All Filters' onClick={clearFilters} className='text-red-900 border-none hover:text-red-800 bg-red-400 hover:bg-red-200' icon={<MdOutlineLockReset />}>
                {translate('Reset')}
              </Button>
              <Button className='text-blue-700 bg-blue-300 hover:text-blue-800 hover:bg-blue-100' onClick={handelDataTableLoad} key={`${uniqueId()}`} icon={<FiRefreshCw />}>
                {translate('Refresh')}
              </Button>
              <AddNewItem key="addNewItem" config={config} />
            </div>
          </div>
          <Table
            columns={dataTableColumns}
            rowKey={(item) => item._id}
            dataSource={dataSource}
            pagination={pagination}
            loading={listIsLoading}
            onChange={handelDataTableLoad}
          />
        </div>
      </>
    );
  };

  const filterKeys = {
    instituteName: "Select Institute",
    universityName: "Select University",
    installMent: "Select Installment",
    session: "Select Session",
    status: "Select Status",
    paymentMode: "Select Payment Mode",
    counsellor: "Select User",
  };

  const renderFilters = () => {
    return (
      <div>
        <div className='grid grid-cols-6 gap-2'>
          {Object.keys(filterKeys).map((key) => (
            <div key={key}>
              <Select
              allowClear
              aria-label
                className='w-48 h-8'
                onChange={(value) => filterData(key, value)}
                placeholder={filterKeys[key]}
              >
                {getFilterOptions(key).map((option) => (
                  <Select.Option key={option.value} value={option.value}>
                    {option.label}
                  </Select.Option>
                ))}
              </Select>
            </div>
          ))}
          <div>
            <RangePicker className='w-48'
              onChange={handleDateRangeChange}
              format="YYYY-MM-DD"
              placeholder={['Start Date', 'End Date']}
            />
          </div>
          <Button
            className={`w-48 h-7 capitalize text-center text-sm font-thin ${filterValues.paymentStatus === 'payment approved' ? 'bg-green-800 text-white hover:text-white hover:bg-green-900' : 'bg-green-100 text-green-700'
              } hover:bg-green-100 hover:text-green-700 border-green-600 rounded-none`}
            onClick={() => filterData('paymentStatus', 'payment approved')}
          >
            <span className="font-thin text-sm -ml-2">Approved</span>
            <span className="font-thin text-sm ml-1">({pagination.countApproved})</span>
          </Button>

          <Button
            className={`w-48 h-7 capitalize text-center text-sm font-thin ${filterValues.paymentStatus === 'payment received' ? 'bg-cyan-800 text-white hover:text-white hover:bg-cyan-900' : 'bg-cyan-100 text-cyan-700'
              } hover:bg-cyan-100 hover:text-cyan-700 border-cyan-500 rounded-none`}
            onClick={() => filterData('paymentStatus', 'payment received')}
          >
            <span className="font-thin text-sm -ml-2">Received</span>
            <span className="font-thin text-sm ml-1">({pagination.countReceived})</span>
          </Button>

          <Button
            className={`w-48 h-7 capitalize text-center text-sm font-thin ${filterValues.paymentStatus === 'payment rejected' ? 'bg-red-800 text-white hover:text-white hover:bg-red-900' : 'bg-red-100 text-red-700'
              } hover:bg-red-100 hover:text-red-700 border-red-600 rounded-none`}
            onClick={() => filterData('paymentStatus', 'payment rejected')}
          >
            <span className="font-thin text-sm -ml-2">Rejected</span>
            <span className="font-thin text-sm ml-1">({pagination.countRejected})</span>
          </Button>


        </div>
      </div>
    );
  };

  const getFilterOptions = (key) => {
    switch (key) {
      case 'instituteName':
        return institutes.map(name => ({ label: name, value: name }));
      case 'universityName':
        return universities.map(name => ({ label: name, value: name }));
      case 'installMent':
        return installment.map(type => ({ label: type, value: type }));
      case 'session':
        return session.map(session => ({ label: session, value: session }));
      case 'status':
        return statuses.map(status => ({ label: status, value: status }));
      case 'paymentMode':
        return paymentMode.map(mode => ({ label: mode, value: mode }));
      case 'counsellor':
        return userNames.map(user => ({ label: user.fullname, value: user._id }));
      default:
        return [];
    }
  };

  // Add useEffect to handle automatic table reload
  useEffect(() => {
    if (isSuccess) {
      handelDataTableLoad({});
    }
  }, [isSuccess]);

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
            <div className='relative float-right font-thin text-lg'>Notifications</div>
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