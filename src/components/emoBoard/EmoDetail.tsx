import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { EmotionVO, EmoVO, QnaVO, VO } from './emoData';
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Sector, SectorProps } from 'recharts';

import style from './emo.module.css'
import { Card, Descriptions, Typography, Button, Space, message, Divider } from 'antd';



const { Title, Paragraph } = Typography;

const EmoDetail: React.FC = () => {
    const [upboard, setUpboard] = useState<EmotionVO | null>(null);
    const [data, setData] = useState<EmoVO>()
    const { emo_id } = useParams<{ emo_id: string }>();
    const navigate = useNavigate();
    const cleanBoardId = emo_id ? emo_id.replace(/[^0-9]/g, "") : "0";
    const id = parseInt(cleanBoardId, 10);

    type Coordinate = {
        x: number;
        y: number;
    };
    type PieSectorData = {
        percent?: number;
        name?: string | number;
        midAngle?: number;
        middleRadius?: number;
        tooltipPosition?: Coordinate;
        value?: number;
        paddingAngle?: number;
        dataKey?: string;
        payload?: any;
    };

    type PieSectorDataItem = React.SVGProps<SVGPathElement> & Partial<SectorProps> & PieSectorData;

    const renderActiveShape = ({
        cx,
        cy,
        midAngle,
        innerRadius,
        outerRadius,
        startAngle,
        endAngle,
        fill,
        payload,
        percent,
        value,
    }: PieSectorDataItem) => {
        const RADIAN = Math.PI / 180;
        const sin = Math.sin(-RADIAN * (midAngle ?? 1));
        const cos = Math.cos(-RADIAN * (midAngle ?? 1));
        const sx = (cx ?? 0) + ((outerRadius ?? 0) + 10) * cos;
        const sy = (cy ?? 0) + ((outerRadius ?? 0) + 10) * sin;
        const mx = (cx ?? 0) + ((outerRadius ?? 0) + 30) * cos;
        const my = (cy ?? 0) + ((outerRadius ?? 0) + 30) * sin;
        const ex = mx + (cos >= 0 ? 1 : -1) * 22;
        const ey = my;
        const textAnchor = cos >= 0 ? 'start' : 'end';

        return (
            <g>
                <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
                    {payload.name}
                </text>
                <Sector
                    cx={cx}
                    cy={cy}
                    innerRadius={innerRadius}
                    outerRadius={outerRadius}
                    startAngle={startAngle}
                    endAngle={endAngle}
                    fill={fill}
                />
                <Sector
                    cx={cx}
                    cy={cy}
                    startAngle={startAngle}
                    endAngle={endAngle}
                    innerRadius={(outerRadius ?? 0) + 6}
                    outerRadius={(outerRadius ?? 0) + 10}
                    fill={fill}
                />
                <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
                <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
                <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#333">{`PV, ${value?.toFixed(3)}`}</text>
                <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999">
                    {`(${((percent ?? 1) * 100).toFixed(2)}%)`}
                </text>
            </g>
        );
    };

    const hangle2emotion = (emotion: string) => {
        if (emotion === "Angry") {
            return "짜증남"
        } else if (emotion === "Fear") {
            return "무서움"
        } else if (emotion === "Happy") {
            return "행복함"
        } else if (emotion === "Tender") {
            return "다정함"
        } else if (emotion === "Sad") {
            return "슬픔"
        } else return "";
    }

    useEffect(() => {
        const fetchAll = async () => {
            try {
                // 1) 상세 데이터 불러오기
                const resp = await axios.get<EmotionVO>(
                    `http://192.168.0.133:81/EvLink/emotion/detail?emo_id=${id}`
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
        const result = window.confirm("정말 삭제하시겠습니까?");
        if (result) {
            console.log("사용자가 확인 눌렀음");
        } else {
            console.log("사용자가 취소 눌렀음");
        }
        try {
            await axios.get(`http://192.168.0.133:81/emotion/delete?emo_id=${id}`);
            message.success('삭제되었습니다.');
            navigate('/emoboard');
        } catch (error) {
            console.error('삭제 오류:', error);
            message.error('삭제에 실패했습니다.');
        }
    };
    const chartData = Object.entries(data?.probs ?? {}).map(([key, emo], idx) => ({
        name: emo.label,      // "Angry"
        value: (emo.prob * 100),   // 0.26
        fill: COLORS[idx % COLORS.length], // 색상 순환
    }));
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
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
                                    <Descriptions.Item label="번호">{upboard.emo_id}</Descriptions.Item>
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
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart width={400} height={400}>
                            <Pie
                                activeShape={renderActiveShape}
                                data={chartData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default EmoDetail;


