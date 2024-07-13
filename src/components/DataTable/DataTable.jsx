import React, { useEffect, useState } from 'react';
import { EyeOutlined, EditOutlined, DeleteOutlined, EllipsisOutlined } from '@ant-design/icons';
import { Dropdown, Table, Button, Card, Select, Input, DatePicker, Menu, Drawer, Radio } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { crud } from '@/redux/crud/actions';
import { LiaRupeeSignSolid } from "react-icons/lia";
import { selectCreatedItem, selectListItems } from '@/redux/crud/selectors';
import useLanguage from '@/locale/useLanguage';
import { GrHistory } from "react-icons/gr";
import { useCrudContext } from '@/context/crud';
import * as XLSX from 'xlsx';
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
import CommentForm from '@/forms/comment';
import { BsSend } from "react-icons/bs";
import { PiMicrosoftExcelLogo, PiMicrosoftTeamsLogo } from "react-icons/pi";
const { RangePicker } = DatePicker;
import moment from 'moment';
import useFetch from '@/hooks/useFetch';

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
  let { entity, dataTableColumns, searchConfig } = config;
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
  const [paymentType, setPaymentType] = useState([]);
  const [userNames, setUserNames] = useState([]);
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
  const [showStudentDetailsDrawer, setShowStudentDetailsDrawer] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showLMSDrawer, setShowLMSDrawer] = useState(false);
  const [LMSRecord, setLMSRecord] = useState(null);
  const isAdmin = ['admin', 'subadmin', 'manager', 'supportiveassociate'].includes(currentAdmin?.role);
  const [selectedInstitute, setSelectedInstitute] = useState(null);
  const [selectedUniversity, setSelectedUniversity] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [selectedPaymentMode, setSelectedPaymentMode] = useState(null);
  const [selectedPaymentType, setSelectedPaymentType] = useState(null);
  const [selectedInstallment, setSelectedInstallment] = useState(null);
  const [selectedUserName, setSelectedUserName] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [isTeam, setIsTeam] = useState('false');
  const [selectedPaymentstatus, setSelectedPaymentstatus] = useState(null);
  const [activeButton, setActiveButton] = useState(null);
  const [selectedWelcomemail, setSelectedWelcomemail] = useState(null);
  const [selectedWelcomewhatsapp, setSelectedWelcomewhatsapp] = useState(null);
  const [selectedErolledmail, setSelectedEnrolledmail] = useState(null);
  const [selectedEnrolledwhatsapp, setSelectedEnrolledwhatsapp] = useState(null);
  const [selectedLMS, setSelectedLMS] = useState(null);
  const isFilter = ['admin', 'subadmin', 'manager', 'supportiveassociate', 'teamleader'].includes(selectCurrentAdmin?.role);
  const { data: uniqueOptions, isLoading: optionLoading } = useFetch(() =>
    request.filter({ entity: 'lead' })
  );

  useEffect(() => {
    if (uniqueOptions) {
      setStatuses(uniqueOptions.uniqueValues.statuses || []);
      setInstitutes(uniqueOptions.uniqueValues.institute_names || []);
      setInstallment(uniqueOptions.uniqueValues.installment_types || []);
      setUniversities(uniqueOptions.uniqueValues.university_names || []);
      setSession(uniqueOptions.uniqueValues.sessions || []);
      setPaymentType(uniqueOptions.uniqueValues.payment_types || []);
      setPaymentMode(uniqueOptions.uniqueValues.payment_modes || []);
      setUserNames(uniqueOptions.uniqueValues.userIds || []);
    }
  }, [uniqueOptions]);

  const handleShowStudentDetails = (record) => {
    setSelectedStudent(record);
    setShowStudentDetailsDrawer(true);
  };

  const handleComment = (record) => {
    setCommentRecord(record);
    setShowCommentDrawer(true);
  };

  const handleLMS = (record) => {
    setLMSRecord(record);
    setShowLMSDrawer(true);
  };

  const closeCommentDrawer = () => {
    setShowCommentDrawer(false);
    setCommentRecord(null);
  };

  const closeLMSDrawer = () => {
    setShowLMSDrawer(false);
    setLMSRecord(null);
  };

  const handleCancelAddPaymentModal = () => {
    setShowAddPaymentModal(false);
    setUpdatePaymentRecord(null);
  };

  const handleSuccessUpdate = () => {
    setShowAddPaymentModal(false);
    handelDataTableLoad({});
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

  const handleHistory = async (record) => {
    try {
      const historyData = await request.history({ entity: 'lead', id: record._id });
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
    setUpdatePaymentRecord(record);
    setShowAddPaymentModal(true);
  };

  const handleUploadDocument = (record) => {
    setRecordForUploadDocument(record);
    setShowUploadDocumentDrawer(true);
  };

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
    ]
    : [
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
    ];

  dataTableColumns = [
    ...dataTableColumns,
    {
      title: 'Action',
      key: 'action',
      fixed: 'right',
      render: (_, record) => (
        <Dropdown
          menu={{
            items: entity === 'lead' ? items : items.filter(item => item.key !== 'showDetails' && item.key !== 'add' && item.key !== 'history'),
            onClick: ({ key }) => {
              switch (key) {
                case 'showDetails':
                  handleShowStudentDetails(record);
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
                  handleUploadDocument(record);
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

  console.log(pagination)

  const handelDataTableLoad = (pagination) => {
    const options = {
      page: pagination.current || 1,
      items: pagination.pageSize || 10,
    };

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
    if (selectedInstallment !== null) {
      options.installment_type = selectedInstallment;
    }
    if (selectedPaymentstatus !== null) {
      options.paymentStatus = selectedPaymentstatus;
    }
    if (selectedErolledmail !== null) {
      options.welcomeEnrolled = selectedErolledmail;
    }
    if (selectedWelcomemail !== null) {
      options.welcomeMail = selectedWelcomemail;
    }
    if (selectedWelcomewhatsapp !== null) {
      options.whatsappMessageStatus = selectedWelcomewhatsapp;
    }
    if (selectedEnrolledwhatsapp !== null) {
      options.whatsappEnrolled = selectedEnrolledwhatsapp;
    }
    if (selectedLMS !== null) {
      options.lmsStatus = selectedLMS;
    }
    if (isTeam === 'true' && selectedUserName !== null) {
      options.team = isTeam;
      options.teamLeader = selectedUserName;
    } else if (selectedUserName !== null) {
      options.userId = selectedUserName;
    }
    if (startDate !== null && endDate !== null) {
      options.start_date = startDate.format('DD/MM/YYYY');
      options.end_date = endDate.format('DD/MM/YYYY');
    }

    dispatch(crud.list({ entity, options }));
  };


  const filterTable = (e) => {
    const value = e.target.value;
    const options = { q: value, fields: searchConfig?.searchFields || '' };
    dispatch(crud.list({ entity, options }));
  };

  const handlePaymentStatus = (status) => {
    setSelectedPaymentstatus(status);
    setActiveButton(status);
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
      case 'installmentType':
        setSelectedInstallment(value);
        break;
      case 'userName':
        setSelectedUserName(value);
        break;
      case 'welcomeMail':
        setSelectedWelcomemail(value);
        break;
      case 'enrolledEmail':
        setSelectedEnrolledmail(value);
        break;
      case 'welcomeWhatsApp':
        setSelectedWelcomewhatsapp(value);
        break;
      case 'enrolledWhatsApp':
        setSelectedEnrolledwhatsapp(value);
        break;
      case 'lmsStatus':
        setSelectedLMS(value);
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
    if (selectedInstallment !== null) {
      options.installment_type = selectedInstallment;
    }
    if (selectedPaymentstatus !== null) {
      options.paymentStatus = selectedPaymentstatus;
    }
    if (selectedWelcomemail !== null) {
      options.welcomeMail = selectedWelcomemail;
    }
    if (selectedWelcomewhatsapp !== null) {
      options.whatsappMessageStatus = selectedWelcomewhatsapp;
    }
    if (selectedErolledmail !== null) {
      options.welcomeEnrolled = selectedErolledmail;
    }
    if (selectedEnrolledwhatsapp !== null) {
      options.whatsappEnrolled = selectedEnrolledwhatsapp;
    }
    if (selectedLMS !== null) {
      options.lmsStatus = selectedLMS;
    }
    if (isTeam === 'true' && selectedUserName !== null) {
      options.team = isTeam;
      options.teamLeader = selectedUserName;
    } else if (selectedUserName !== null) {
      options.userId = selectedUserName;
    }
    if (startDate !== null && endDate !== null) {
      options.start_date = startDate.format('DD/MM/YYYY');
      options.end_date = endDate.format('DD/MM/YYYY');
    }
    dispatch(crud.list({ entity, options }));
  };

  useEffect(() => {
    applyFilters();
  }, [selectedInstitute, selectedUniversity, selectedStatus, selectedPaymentMode, selectedPaymentType, selectedUserName, selectedWelcomemail, selectedInstallment, isTeam, startDate, endDate, selectedPaymentstatus, selectedWelcomewhatsapp, selectedErolledmail, selectedEnrolledwhatsapp, selectedLMS]);

  const resetFilters = () => {
    setSelectedInstitute(null);
    setSelectedUniversity(null);
    setSelectedStatus(null);
    setSelectedPaymentMode(null);
    setSelectedPaymentType(null);
    setSelectedWelcomewhatsapp(null);
    setSelectedUserName(null);
    setSelectedEnrolledmail(null);
    setStartDate(null);
    setSelectedEnrolledwhatsapp(null);
    setSelectedInstallment(null)
    setSelectedLMS(null);
    setSelectedPaymentstatus(null);
    setSelectedWelcomemail(null);
    setActiveButton(null);
    setEndDate(null);
    setIsTeam('false');
    applyFilters();
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
                <Select.Option key={institute}>{institute}</Select.Option>
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
                <Select.Option key={university}>{university}</Select.Option>
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
                <Select.Option key={status}>{status}</Select.Option>
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
                <Select.Option key={type}>{type}</Select.Option>
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
                <Select.Option key={mode}>{mode}</Select.Option>
              ))}
            </Select>

            <Select
              showSearch
              allowClear
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              placeholder="Select installment type"
              className='w-44 h-8'
              onChange={(value) => handleFilterChange('installmentType', value)}
              value={selectedInstallment}
            >
              {installment.map(type => (
                <Select.Option key={type}>{type}</Select.Option>
              ))}
            </Select>
            {isFilter ? (
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
            ) : null}


            <RangePicker
              onChange={handleDateRangeChange}
              value={startDate && endDate ? [startDate, endDate] : null}
              className='w-44 h-8'
              format='DD/MM/YYYY'
              placeholder={['Start Date', 'End Date']}
            />
            <Button className={activeButton === 'payment approved' ? 'w-44 h-8 rounded-none border-none capitalize text-center text-sm font-thin bg-green-800 text-white hover:text-white hover:bg-green-900' : 'bg-green-100 text-green-700 hover:bg-green-100 hover:text-green-700 border-green-600 rounded-none w-44 h-8'}
              onClick={() => handlePaymentStatus('payment approved')}
            >
              <span>Approved</span><span className='text-red-500'>({pagination.countApproved})</span>
            </Button>

            <Button className={activeButton === 'payment received' ? 'w-44 h-8 border-none rounded-none capitalize text-center text-sm font-thin bg-cyan-800 text-white hover:text-white hover:bg-cyan-900' : 'bg-cyan-100 text-cyan-700 hover:bg-cyan-100 hover:text-cyan-700 border-cyan-500 rounded-none w-44 h-8'}
              onClick={() => handlePaymentStatus('payment received')}
            >
              <span className="font-thin text-sm -ml-2">Received</span>
              <span className="font-thin text-sm ml-1">({pagination.countReceived})</span>
            </Button>

            <Button className={activeButton === 'payment rejected' ? 'w-44 h-8 border-none rounded-none capitalize text-center text-sm font-thin bg-red-800 text-white hover:text-white hover:bg-red-900' : 'bg-red-100 text-red-700 hover:bg-red-100 hover:text-red-700 border-red-600 rounded-none w-44 h-8'}
              onClick={() => handlePaymentStatus('payment rejected')}
            >
              <span className="font-thin text-sm -ml-2">Rejected</span>
              <span className="font-thin text-sm ml-1">({pagination.countRejected})</span>
            </Button>
            <Button
              className="bg-red-200 text-red-800 hover:text-red-700 hover:bg-red-100 hover:border-none border-none w-28"
              onClick={resetFilters}
            >
              Reset Filters
            </Button>
          </div>
        </div>
      </Card>
    );
  };

  useEffect(() => {
    if (isSuccess) {
      handelDataTableLoad({});
    }
  }, [isSuccess]);

  const exportToExcel = async () => {
    const options = {
      export: 'true',
      sortBy: 'updated',
      sortValue: -1,
    };

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
    if (selectedInstallment !== null) {
      options.installment_type = selectedInstallment;
    }
    if (selectedWelcomemail !== null) {
      options.welcomeMail = selectedWelcomemail;
    }
    if (selectedWelcomewhatsapp !== null) {
      options.whatsappMessageStatus = selectedWelcomewhatsapp;
    }
    if (selectedPaymentstatus !== null) {
      options.paymentStatus = selectedPaymentstatus;
    }
    if (selectedErolledmail !== null) {
      options.welcomeEnrolled = selectedErolledmail;
    }
    if (selectedEnrolledwhatsapp !== null) {
      options.whatsappEnrolled = selectedEnrolledwhatsapp;
    }
    if (selectedLMS !== null) {
      options.lmsStatus = selectedLMS;
    }
    if (isTeam === 'true' && selectedUserName !== null) {
      options.team = isTeam;
      options.teamLeader = selectedUserName;
    } else if (selectedUserName !== null) {
      options.userId = selectedUserName;
    }

    if (startDate !== null && endDate !== null) {
      options.start_date = startDate.format('DD/MM/YYYY');
      options.end_date = endDate.format('DD/MM/YYYY');
    }

    const { result } = await request.list({ entity, options });

    const data = result.map(item => ({
      'lead_id': item.lead_id,
      'Student Name': item.full_name,
      'Email': item.contact.email,
      'Phone': item.contact.phone,
      'DOB': moment(item.customfields.dob).format('DD/MM/YYYY'),
      'Course': item.education.course,
      'Specialization': item.customfields.enter_specialization,
      'Session': item.customfields.session,
      'Admission Type': item.customfields.admission_type,
      'Institute': item.customfields.institute_name,
      'University': item.customfields.university_name,
      'User': item.userId.fullname,
      'Enrollment': item.customfields.enrollment,
      'Installments': item.customfields.installment_type,
      'Father Name': item.customfields.father_name,
      'Mother Name': item.customfields.mother_name,
      'Gender': item.customfields.gender,
      'Payment Type': item.customfields.payment_type,
      'Total Course Fee': item.customfields.total_course_fee,
      'Total Paid Amount': item.customfields.total_paid_amount,
      'Paid Amount': item.customfields.paid_amount,
      'Due Amount': item.customfields.due_amount,
      'Payment Mode': item.customfields.payment_mode,
      'Status': item.customfields.status,
      'Created': moment(item.created).format('DD/MM/YYYY'),
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');
    XLSX.writeFile(workbook, 'data.xlsx');
  };

  const menu = (
    <Menu className="radio-menu">
      <Menu.Item key="welcomeMail">
        <span className="radio-label">Welcome Mail</span>
        <Radio.Group
          onChange={(e) => handleFilterChange('welcomeMail', e.target.value)} // Fix the onChange handler
          value={selectedWelcomemail}
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
          onChange={(e) => handleFilterChange('welcomeWhatsApp', e.target.value)} // Fix the onChange handler
          value={selectedWelcomewhatsapp}
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
          onChange={(e) => handleFilterChange('enrolledEmail', e.target.value)} // Fix the onChange handler
          value={selectedErolledmail}
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
          onChange={(e) => handleFilterChange('enrolledWhatsApp', e.target.value)} // Fix the onChange handler
          value={selectedEnrolledwhatsapp}
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
          onChange={(e) => handleFilterChange('lmsStatus', e.target.value)} // Fix the onChange handler
          value={selectedLMS}
          className="radio-group"
        >
          <Radio.Button value={null}>All</Radio.Button>
          <Radio.Button value={'yes'}>Yes</Radio.Button>
          <Radio.Button value={'no'}>No</Radio.Button>
          <Radio.Button value={'N/A'}>N/A</Radio.Button>
        </Radio.Group>
      </Menu.Item>
    </Menu>
  );


  const menu1 = (
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


  return (
    <>
      <div>
        {filterRender()}
      </div>
      <div className='space30'></div>
      <Card className='w-full rounded-none'>
        <div>
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
              {isAdmin ? (
                <>
                  <Dropdown overlay={menu1} trigger={['click']}>
                    <div className="flex items-center gap-1 text-sm uppercase rounded-full border border-gray-400 bg-gray-50 px-1 h-6 cursor-pointer">
                      <span>
                        <PiMicrosoftTeamsLogo className="text-blue-600" />
                      </span>
                      <span>Team</span>
                    </div>
                  </Dropdown>
                  <Dropdown trigger={['click']} overlay={menu}>
                    <div className="flex items-center gap-1.5 text-sm uppercase rounded-full border border-gray-400 bg-gray-50 px-1 h-6 cursor-pointer">
                      <span>
                        <IoFilterOutline />
                      </span>
                      <span>Filters</span>
                    </div>
                  </Dropdown>
                  <Button title='Export excel' onClick={exportToExcel} className='text-green-800 bg-green-300 hover:text-green-700 hover:bg-green-100 border-none hover:border-none' icon={<PiMicrosoftExcelLogo />}> Excel</Button>
                </>
              ) : null}

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
      </Card>
      <Drawer
        title="Add Payment"
        open={showAddPaymentModal}
        onClose={handleCancelAddPaymentModal}
        footer={null}
        width={500}
      >
        {updatePaymentRecord && <UpdatePaymentForm entity="lead" id={updatePaymentRecord?._id} recordDetails={updatePaymentRecord} onCloseModal={handleSuccessUpdate} />}
      </Drawer>
      <Drawer
        title="Upload Document"
        open={showUploadDocumentDrawer}
        onClose={closeUploadDocumentDrawer}
        footer={null}
        width={500}
      >
        {recordForUploadDocument && (
          <UploadDocumentForm
            entity="lead"
            id={recordForUploadDocument?._id}
            recordDetails={recordForUploadDocument}
            onCloseModal={closeUploadDocumentDrawer}
          />
        )}
      </Drawer>
      <Drawer
        title={<div className='relative float-right font-thin text-lg'>Comments</div>}
        placement="right"
        open={showCommentDrawer}
        onClose={closeCommentDrawer}
        width={500}
      >
        {commentRecord && (
          <CommentForm
            entity="lead"
            id={commentRecord._id}
            recordDetails={commentRecord}
          />
        )}
      </Drawer>

      <Drawer
        title={<div className='relative font-thin text-base float-right'>Student Details</div>}
        placement="right"
        open={showStudentDetailsDrawer}
        onClose={() => setShowStudentDetailsDrawer(false)}
        width={1000}
      >
        {selectedStudent && (
          <StudentDetailsModal
            visible={showStudentDetailsDrawer}
            onClose={() => setShowStudentDetailsDrawer(false)}
            student={selectedStudent}
          />
        )}
      </Drawer>
      <HistoryModal
        showHistoryModal={showHistoryModal}
        historyData={historyData}
        onClose={() => setShowHistoryModal(false)}
      />
      <Drawer
        title={<div className='relative float-right font-thin text-lg'>Notifications</div>}
        open={showLMSDrawer}
        onClose={closeLMSDrawer}
        width={1000}
      >
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
