import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { QnaVO, VO } from './emoData';
import { Cell, Legend, Pie, PieChart, ResponsiveContainer } from 'recharts';

import style from './emo.module.css'
import { Card, Descriptions, Typography, Button, Space, message, Divider } from 'antd';



const { Title, Paragraph } = Typography;

const EmoDetail: React.FC = () => {
    const [upboard, setUpboard] = useState<QnaVO | null>(null);
    const [data, setData] = useState<VO>()
    const { board_id } = useParams<{ board_id: string }>();
    const navigate = useNavigate();
    const cleanBoardId = board_id ? board_id.replace(/[^0-9]/g, "") : "0";
    const id = parseInt(cleanBoardId, 10);

    useEffect(() => {
        const fetchAll = async () => {
            try {
                // 1) 상세 데이터 불러오기
                const resp = await axios.get<QnaVO>(
                    `http://192.168.0.133:81/EvLink/board/detail?board_id=${id}`
                );
                setUpboard(resp.data);

                // 2) 감정 분석 요청 (resp.data.content 사용)
                const response = await axios.post("http://3.34.69.170:9000/mykobert/mytransformers", {
                    text: resp.data.content,
                });
                console.log(response.data);
                setData(response.data);
            } catch (error) {
                console.error(error);
                message.error("데이터를 불러오지 못했습니다.");
            }
        };

        fetchAll();
    }, [id]); // id 바뀔 때마다 실행


    const handleDeleteClick = async () => {
        if (!upboard) return;
        try {
            await axios.get(`http://192.168.0.133:81/board/detail?board_id=${id}`);
            message.success('삭제되었습니다.');
            navigate('/faq/qna');
        } catch (error) {
            console.error('삭제 오류:', error);
            message.error('삭제에 실패했습니다.');
        }
    };
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
    const positive = data?.results.reduce((sum, result) => sum + result.probabilities[1], 0) ?? 0;
    const negative = data?.results.reduce((sum, result) => sum + result.probabilities[0], 0) ?? 0;

    const pieData = [
        { name: '긍정적', value: positive },
        { name: '부정적', value: negative },
    ];
    return (
        <div style={{ marginTop: '60px' }}>
            <h2>QnA 상세 보기</h2>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <div className={style.container}>
                    <Card>
                        {upboard ? (
                            <>
                                <Descriptions
                                    bordered
                                    column={1}
                                    size="middle"
                                    labelStyle={{ width: '120px', fontSize: '13px', fontWeight: 500 }}
                                    contentStyle={{ fontSize: '16px', fontWeight: 600 }}
                                >
                                    <Descriptions.Item label="번호">{upboard.board_id}</Descriptions.Item>
                                    <Descriptions.Item label="제목">{upboard.title}</Descriptions.Item>
                                    <Descriptions.Item label="작성자">{upboard.user_id}</Descriptions.Item>
                                    <Descriptions.Item label="내용">
                                        <Paragraph style={{ whiteSpace: 'pre-wrap', marginBottom: 0 }}>
                                            {upboard.content}
                                        </Paragraph>
                                    </Descriptions.Item>
                                </Descriptions>

                                <Divider />

                                <Space style={{ marginTop: 16 }}>
                                    <Button danger onClick={handleDeleteClick}>
                                        삭제
                                    </Button>
                                    <Link to="/board">
                                        <Button type="default" style={{ backgroundColor: '#1390ff', color: 'white' }}>목록으로</Button>
                                    </Link>
                                </Space>
                            </>
                        ) : (
                            <Paragraph>불러오는 중입니다...</Paragraph>
                        )}
                    </Card>

                    <Divider />
                </div>
                <div className={style.container}>
                    <ResponsiveContainer width="100%" height="100%" minWidth={500} minHeight={300} >
                        <PieChart width={400} height={400}>
                            <Pie
                                data={pieData}
                                cx="50%"
                                cy="50%"
                                labelLine={true}
                                label={({ name, percent = 0 }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {data?.results.map((result) => (
                                    <Cell key={`cell-${result.pred_label}`} fill={COLORS[result.pred_index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default EmoDetail;


