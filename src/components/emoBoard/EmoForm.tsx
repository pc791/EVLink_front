import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Typography, Space, message } from 'antd';
import { Legend, Pie, PieChart, ResponsiveContainer, Sector, SectorProps } from 'recharts';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import style from './emo.module.css'
import { EmotionProb, EmoVO, QnaVO } from './emoData';

const { Title } = Typography;

const EmoForm: React.FC = () => {
  const [enable, setEnable] = useState(true);
  const [data, setData] = useState<EmoVO>()
  const [emotion, setEmotion] = useState('');
  const [predProb, setPredProb] = useState('');
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const [formData, setFormData] = useState<QnaVO>({
    title: '',
    user_id: '',
    content: '',
    emotion: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    const data = new FormData();
    data.append('title', formData.title);
    data.append('user_id', formData.user_id);
    data.append('content', formData.content);
    data.append('emotion', emotion);

    try {
      await axios.post('http://192.168.0.133:80/evlink/emotion/insert', data);
      message.success('글이 등록되었습니다.');
      navigate('/board');
    } catch (error) {
      console.error('등록 실패:', error);
      message.error('등록 중 오류가 발생했습니다.');
    }
  };

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

  const hangle2emotion = ( emotion : string) => {
    if(emotion === "Angry"){
      return "짜증남"
    }else if(emotion === "Fear"){
      return "무서움"
    }else if(emotion === "Happy"){
      return "행복함"
    }else if(emotion === "Tender"){
      return "다정함"
    }else if(emotion === "Sad"){
      return "슬픔"
    }
  }
  const fetchAI = async () => {
    try {
      const response = await axios.post("http://3.34.69.170:9000/mykobert/mytransformers", {
        text: formData.content,
      },{withCredentials:false});
      console.log(response);
      setData(response.data);
      setEnable(false);
      const probsObj = response.data.probs as { [key: number]: EmotionProb };

      const probsArray = Object.values(probsObj); // 이제 타입이 EmotionProb[]
      const highest = probsArray.reduce<EmotionProb>((prev, curr) => curr.prob > prev.prob ? curr : prev, { label: '', prob: 0 });

      const predLabel = highest.label;
      setPredProb((highest.prob * 100).toFixed(1)+"%");
      setEmotion(hangle2emotion(predLabel) ?? '');
    } catch (error) {
      console.error(error);
      message.error("데이터를 불러오지 못했습니다.");
    }
  }
  const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7f50", "#a4de6c"];
  const chartData = Object.entries(data?.probs ?? {}).map(([key, emo], idx) => ({
    name: emo.label,      // "Angry"
    value: (emo.prob * 100),   // 0.26
    fill: COLORS[idx % COLORS.length], // 색상 순환
  }));

  useEffect(() => {
    console.log('emotion state updated:', emotion);
  }, [emotion]);
  useEffect(() => {
    setEnable(true);
  }, [formData.content]);

  // const positive = data?.results.reduce((sum, result) => sum + result.probabilities[1], 0) ?? 0;
  // const negative = data?.results.reduce((sum, result) => sum + result.probabilities[0], 0) ?? 0;

  // const pieData = [
  //   { name: '긍정적', value: positive },
  //   { name: '부정적', value: negative },
  // ];

  return (
    <div className={style.page}>
      <div style={{height: '30px'}}></div>
      <div className={style.mainContainer}>
        <div className={style.container}>
          <h1 className={style.emotitle}>글 등록</h1>

          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            initialValues={formData}
            className={style.formContainer}
          >
            <Form.Item label="제목" name="title" rules={[{ required: true, message: '제목을 입력하세요' }]}>
              <Input name="title" onChange={handleChange} />
            </Form.Item>

            <Form.Item label="작성자" name="user_id" rules={[{ required: true, message: '작성자를 입력하세요' }]}>
              <Input name="user_id" onChange={handleChange} />
            </Form.Item>

            <Form.Item label="내용" name="content" rules={[{ required: true, message: '내용을 입력하세요' }]}>
              <Input.TextArea
                name="content"
                rows={6}
                onChange={handleChange}
                style={{ resize: 'none' }}
              />
            </Form.Item>
            
            <div className={style.emotionSection}>
              <Form.Item label="감정 분석 결과" rules={[{ required: true }]}>
                <Input name="emotion" onChange={handleChange} value={emotion} readOnly />
              </Form.Item>
              <Form.Item label="확률" rules={[{ required: true }]}>
                <Input name="rate" onChange={handleChange} value={predProb} readOnly />
              </Form.Item>
            </div>
            
            <Form.Item>
              <Space>
                <Button type="primary" htmlType="submit" disabled={enable}>
                  등록하기
                </Button>
                <Button onClick={fetchAI}>AI 감정분석</Button>
                <Link to="/emoboard">
                  <Button>취소</Button>
                </Link>
              </Space>
            </Form.Item>
          </Form>
        </div>
        
        <div className={style.chartContainer}>
          <h2 className={style.chartTitle}>감정 분석</h2>
          <ResponsiveContainer width="100%" height="100%" minWidth={400} minHeight={400}>
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
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};


export default EmoForm;
