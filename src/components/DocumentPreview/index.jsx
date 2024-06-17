import React from 'react';
import { Image, Button, Popconfirm, message } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import axios from 'axios';
import { MdOutlineFileDownload } from "react-icons/md";

const DocumentPreview = ({ leadId, documentUrls, onDownload, fetchDocuments, documentType }) => {

    const deleteImage = async (imageUrl) => {
        try {
            const response = await axios.delete('lead/image', {
                data: {
                    imageUrl: imageUrl,
                    lead_id: leadId,
                    documentType: documentType
                }
            });

            if (response.data) {
                message.success(response.data.message);
                fetchDocuments();
            } else {
                message.error(response.data.message);
            }
        } catch (error) {
            message.error(error.response.data.message);
        }
    };

    return (
        <div className="overflow-auto max-h-screen p-4">
            <Image.PreviewGroup>
                <div className="grid grid-cols-4 gap-4">
                    {documentUrls.map((doc, index) => (
                        <div key={index} className="w-52 flex flex-col items-center">
                            <Image
                                width={200}
                                height={150}
                                src={doc?.downloadURL}
                            />
                            <div className="flex items-center w-48 justify-center">
                                <span className="overflow-hidden overflow-ellipsis w-20 whitespace-nowrap">{doc.originalFileName}</span>
                                <Popconfirm
                                    title="Are you sure you want to delete this image?"
                                    onConfirm={() => deleteImage(doc.downloadURL)}
                                    okText="Yes"
                                    cancelText="No"
                                >
                                    <Button className="ml-4 bg-transparent hover:text-blue-800 text-blue-600 border-none" icon={<DeleteOutlined />} />
                                </Popconfirm>
                                <Popconfirm
                                    title="Are you sure you want to download this image?"
                                    onConfirm={() => onDownload(doc.downloadURL)}
                                    okText="Yes"
                                    cancelText="No"
                                >
                                    <Button className="bg-transparent text-blue-600 border-none text-xl hover:text-blue-700" icon={<MdOutlineFileDownload />} />
                                </Popconfirm>
                            </div>
                        </div>
                    ))}
                </div>
            </Image.PreviewGroup>
        </div>
    );
};

export default DocumentPreview;
