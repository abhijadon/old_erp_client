import React, { useEffect, useState } from 'react';
import { Drawer, Modal, Table } from 'antd';

const HistoryModal = ({ showHistoryModal, historyData, onClose }) => {
    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedDateTime, setSelectedDateTime] = useState(null);
    const [isTableVisible, setIsTableVisible] = useState(false);

    // Automatically set the first user and date-time combination on modal open
    useEffect(() => {
        if (showHistoryModal && historyData?.history?.length > 0) {
            const firstHistoryItem = historyData.history[0];
            const date = new Date(firstHistoryItem.updatedAt).toLocaleDateString('en-GB');
            const time = new Date(firstHistoryItem.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            setSelectedUser(firstHistoryItem.updatedBy);
            setSelectedDateTime(`${date} - ${time}`);
            setIsTableVisible(true); // Automatically show the table
        }
    }, [showHistoryModal, historyData]);


    const handleUserClick = (user, dateTime) => {
        // If the same user and datetime are clicked, don't toggle visibility
        if (selectedUser?._id === user._id && selectedDateTime === dateTime) return;
        setSelectedUser(user);
        setSelectedDateTime(dateTime);
        setIsTableVisible(true); // Ensure table visibility on first click
    };


    const getUniqueDates = () => {
        const dates = historyData?.history.map(historyItem => {
            const date = new Date(historyItem.updatedAt).toLocaleDateString('en-GB');
            const time = new Date(historyItem.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            return `${date} - ${time}`;
        });
        return Array.from(new Set(dates));
    };

    const flattenUpdatedFields = (updatedFields) => {
        const flattenedData = [];
        for (const category in updatedFields) {
            for (const field in updatedFields[category]) {
                flattenedData.push({
                    category: category,
                    field: field,
                    oldValue: updatedFields[category][field].oldValue,
                    newValue: updatedFields[category][field].newValue
                });
            }
        }
        return flattenedData;
    };

    const data = historyData?.history
        .filter(historyItem => {
            const date = new Date(historyItem.updatedAt).toLocaleDateString('en-GB');
            const time = new Date(historyItem.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            return `${date} - ${time}` === selectedDateTime && historyItem.updatedBy._id === selectedUser._id;
        })
        .flatMap((historyItem, index) => {
            return flattenUpdatedFields(historyItem.updatedFields).map((item, subIndex) => ({
                key: `${index}_${subIndex}`,
                category: item.category,
                field: item.field,
                oldValue: item.oldValue,
                newValue: item.newValue
            }));
        });

    const columns = [
        {
            title: 'Field',
            dataIndex: 'field',
            key: 'field',
            render: text => <span className="text-gray-500 font-thin capitalize">{text}</span>
        },
        {
            title: 'Old Value',
            dataIndex: 'oldValue',
            key: 'oldValue',
            render: text => <span className="text-gray-500 font-thin">{text}</span>
        },
        {
            title: 'New Value',
            dataIndex: 'newValue',
            key: 'newValue',
            render: text => <span className="text-blue-400 font-thin">{text}</span>
        },
    ];

    return (
        <Drawer
            open={showHistoryModal} // Changed 'open' to 'visible'
            onClose={onClose}
            footer={null}
            width={1000}
        >
            <div className="grid grid-rows-3 grid-flow-col gap-4 place-content-start p-2">
                {selectedUser && selectedDateTime && isTableVisible && (
                    <div className='mr-5'>
                        <div>
                            <h4 className='font-thin text-base capitalize'>
                                <span className="green-bullet">&#8226;</span>
                                {`${selectedUser.fullname}`}
                            </h4>
                            <h6 className='font-normal text-xs mt-1'>({selectedDateTime})</h6>
                        </div>
                        <div className='mt-8'>
                            <Table columns={columns} dataSource={data} pagination={false} style={{ width: '600px' }} />
                        </div>
                    </div>
                )}
                <div className="row-span-3 bg-gray-100 -ml-6 -mt-6 w-96 border-b border-r-2 min-h-[750px]">
                    <h3 className='font-thin text-lg mt-5 ml-6'>
                        ERP History
                    </h3>
                    <div>
                        {getUniqueDates().map((dateTime, dateIndex) => (
                            <div key={dateIndex} className='border-b-2 border-gray-400 p-2'>
                                <div>
                                    <span className="timestamp font-thin text-[18px]">{dateTime}</span>
                                </div>
                                {historyData?.history.filter(historyItem => {
                                    const date = new Date(historyItem.updatedAt).toLocaleDateString('en-GB');
                                    const time = new Date(historyItem.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                                    return `${date} - ${time}` === dateTime;
                                }).slice(0, 2).map((historyItem, historyIndex) => {
                                    const user = historyItem.updatedBy;
                                    const time = new Date(historyItem.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                                    return (
                                        <div key={`${dateIndex}_${historyIndex}`}
                                            className={`flex items-center justify-start cursor-pointer ${selectedUser?._id === historyItem.updatedBy._id && selectedDateTime === dateTime ? 'bg-blue-200 w-auto p-0.5 rounded-md' : ''}`}
                                            onClick={() => handleUserClick(historyItem.updatedBy, dateTime)}>
                                            <span className="green-bullet mr-2 ml-2">&#8226;</span>
                                            <span className="fullname capitalize font-thin text-[12px]">{historyItem.updatedBy?.fullname}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </Drawer>
    );
};

export default HistoryModal;
