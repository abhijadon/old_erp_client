import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Spin, Input, Button, message, Avatar, Form, DatePicker, Divider, Checkbox } from 'antd';
import moment from 'moment';

export default function Comment({ id }) {
    const [commentData, setCommentData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [loading, setLoading] = useState(false);
    const [commentText, setCommentText] = useState('');
    const [followUpDate, setFollowUpDate] = useState(null);
    const [removeFollowUp, setRemoveFollowUp] = useState(false); // State for removeFollowUp flag

    const fetchComments = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(`lead/getComment/${id}`);
            if (response.data.comments) {
                setCommentData(response.data.comments);
            } else {
                message.error(response.data.message);
            }
        } catch (error) {
            console.error('Error fetching comments:', error);
            message.error('Error fetching comments');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchComments();
    }, [id]);

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const response = await axios.post(`lead/comment/${id}`, { commentText, followUpDate, removeFollowUp }); // Send removeFollowUp flag
            if (response.data.message) {
                message.success(response.data.message);
                fetchComments();
                setCommentText('');
                setFollowUpDate(null);
                setRemoveFollowUp(false); // Reset removeFollowUp flag after submission
            } else {
                message.error(response.data.message || 'Failed to post comment');
            }
        } catch (error) {
            console.error('Error posting comment:', error);
            message.error('Error posting comment');
        } finally {
            setLoading(false);
        }
    };

    if (isLoading) {
        return <Spin tip="Loading comments..." />;
    }

    return (
        <div>
            <div className="w-full bg-white">
                <div className="flex flex-col">
                    {commentData.length > 0 ? (
                        commentData.map((comment, index) => (
                            <div key={index} className="border-blue-200 border rounded-md p-3 my-2">
                                <div className="flex gap-3 items-center justify-between">
                                    <div>
                                        <Avatar
                                            className="last bg-blue-50"
                                            style={{
                                                color: '#f56a00',
                                            }}
                                            size="large"
                                        >
                                            {comment.userId?.fullname?.charAt(0).toUpperCase()}
                                        </Avatar>
                                        <span className="font-thin text-base uppercase ml-1">
                                            {comment.userId?.fullname || 'User Name'}
                                        </span>
                                    </div>

                                    <div className="text-gray-700 text-sm">
                                        {moment(comment.timestamp).format('DD/MM/YYYY')}
                                        <br />
                                        <span className='ml-10 text-blue-400 text-xs'>
                                            {moment(comment.timestamp).format('HH:mm')}
                                        </span>
                                    </div>
                                </div>
                                <h2 className="text-black mt-5 text-start ml-5 capitalize">
                                    {comment.commentText}
                                </h2>
                            </div>
                        ))
                    ) : (
                        <p>No comments found.</p> // Fallback if there's no data
                    )}
                </div>

                <Divider />

                <Form layout="vertical" onFinish={handleSubmit} className='mt-4'>
                    <Form.Item name="followUpDate">
                        <DatePicker
                            style={{ width: '100%' }}
                            placeholder="Select follow-up date"
                            value={followUpDate}
                            onChange={(date) => setFollowUpDate(date)}
                        />
                    </Form.Item>

                    <Form.Item name="commentText" rules={[{ required: true, message: 'Please input your comment!' }]}>
                        <Input.TextArea
                            rows={4}
                            value={commentText}
                            placeholder="Type your comment"
                            onChange={(e) => setCommentText(e.target.value)}
                        />
                    </Form.Item>

                    {/* Checkbox or toggle to indicate removing follow-up */}
                    <Form.Item name="removeFollowUp" valuePropName="checked">
                        <Checkbox onChange={(e) => setRemoveFollowUp(e.target.checked)}>Remove Follow-Up</Checkbox>
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={loading}>
                            FollowUP & Comment
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
}