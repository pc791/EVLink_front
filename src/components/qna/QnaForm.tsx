import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Space, message } from 'antd';
import { Cell, Legend, Pie, PieChart, ResponsiveContainer } from 'recharts';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import style from './qna.module.css'
import { QnaVO, VO } from './qnaData';



const QnaForm: React.FC = () => {
  const [enable, setEnable] = useState(true);
  const [data, setData] = useState<VO>()
  const [emotion, setEmotion] = useState('');
  const [score, setScore] = useState('');
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
    data.append('score', score?.toString());

    try {
      await axios.post('http://192.168.0.133:81/EvLink/board/insert', data);
      message.success('글이 등록되었습니다.');
      navigate('/review');
    } catch (error) {
      console.error('등록 실패:', error);
      message.error('등록 중 오류가 발생했습니다.');
    }
  };

  const fetchAI = async () => {
    try {
      const response = await axios.post("http://3.34.69.170:9000/lstm/predict", {
        text: formData.content,
      },{withCredentials:false});
      console.log(response);
      setData(response.data);
      setEnable(false);
      const predLabel = response.data.results[0].pred_label || '';
      setEmotion(predLabel);
      const proba_score = parseFloat(response.data.results[0].probabilities[1].toFixed(3));
      setScore(proba_score.toString());
      console.log(proba_score);
      console.log(score);
    } catch (error) {
      console.error(error);
      message.error("데이터를 불러오지 못했습니다.");
    }
  }
  useEffect(() => {
    console.log('emotion state updated:', emotion);
  }, [emotion]);
  useEffect(() => {
    console.log('proba_score state updated:', score);
  }, [score]);
  useEffect(() => {
    setEnable(true);
  }, [formData.content]);
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  const positive = data?.results.reduce((sum, result) => sum + result.probabilities[1], 0) ?? 0;
  const negative = data?.results.reduce((sum, result) => sum + result.probabilities[0], 0) ?? 0;

  const pieData = [
    { name: '긍정적', value: positive },
    { name: '부정적', value: negative },
  ];

  return (
    <div className={style.page}>
      <div style={{height: '30px'}}></div>
      <div className={style.mainContainer}>
        <div className={style.container}>
          <h1 className={style.qnatitle}>글 등록</h1>

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
                <Input name="score" onChange={handleChange} value={score} readOnly />
              </Form.Item>
            </div>
            
            <Form.Item>
              <Space>
                <Button type="primary" htmlType="submit" disabled={enable}>
                  등록하기
                </Button>
                <Button onClick={fetchAI}>AI 감정분석</Button>
                <Link to="/review">
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
                data={pieData}
                cx="50%"
                cy="50%"
                label={({ name, percent = 0 }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                outerRadius={80}
                innerRadius={50}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
              >
                {data?.results.map((result) => (
                  <Cell key={`cell-${result.pred_label}`} fill={COLORS[result.pred_index % COLORS.length]} />
                ))}
              </Pie>
              <text
                x="50%"
                y="47%"
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize={15}
              >AI 감정분석</text>
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};


export default QnaForm;
