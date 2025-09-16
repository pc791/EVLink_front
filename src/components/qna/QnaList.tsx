import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { QnaVO } from './qnaData';
import style from './qna.module.css'
import { Input, Button, Select, Pagination, Space } from 'antd';
import { Cell, Legend, Pie, PieChart, ResponsiveContainer } from 'recharts';

// const { Title } = Typography;
const { Option } = Select;

const QnaList: React.FC = () => {
  const [upBoardList, setUpBoardList] = useState<QnaVO[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  // const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  // const [startPage, setStartPage] = useState(1);
  // const [endPage, setEndPage] = useState(1);
  const [searchType, setSearchType] = useState('선택해주세요');
  const [searchValue, setSearchValue] = useState('');

  const fetchUpboardList = async (page: number) => {
    try {
      const response = await axios.get('http://192.168.0.133:81/EvLink/board/list', {
        params: {
          cPage: page,
          searchType,
          searchValue,
        },
      });

      if (response) {
        console.log(response.data)
        setUpBoardList(response.data.data);
        setTotalItems(response.data.totalItems);
        // setTotalPages(response.data.totalPages);
        setCurrentPage(response.data.currentPage);
        // setStartPage(response.data.startPage);
        // setEndPage(response.data.endPage);
      }
    } catch (error) {
      console.error('데이터 가져오기 실패', error);
    }
  };

  useEffect(() => {
    fetchUpboardList(currentPage);
  }, [currentPage]);

  const handleSearch = () => {
    fetchUpboardList(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const counts = upBoardList.reduce<Record<string, number>>((acc, item) => {
    if (item.emotion) {
      acc[item.emotion] = (acc[item.emotion] || 0) + 1;
    }
    return acc;
  }, {});

  const data = Object.entries(counts).map(([name, value]) => ({
    name,
    value,
  }));

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
  console.log(data.length)
  return (
    <div className={style.page}>
      <div style={{height: '30px'}}></div>
      <div className={style.mainContainer}>
        <div className={style.container}>
          <h1 className={style.qnatitle}>사용자 후기</h1>

          <div className={style.searchSection}>
            <Space>
              <Select value={searchType} onChange={setSearchType} style={{ width: 120 }}>
                <Option value="user_id">작성자</Option>
                <Option value="title">제목</Option>
                <Option value="content">내용</Option>
              </Select>
              <Input
                placeholder="검색어 입력"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                style={{ width: 200 }}
              />
              <Button type="primary" onClick={handleSearch}>
                검색
              </Button>
              <Link to="/review/form">
                <Button>글쓰기</Button>
              </Link>
            </Space>
          </div>

          <div className={style.tableContainer}>
            <table className={style.qnatable}>
              <thead>
                <tr>
                  <th>번호</th>
                  <th>제목</th>
                  <th>조회수</th>
                  <th>작성일</th>
                </tr>
              </thead>
              <tbody>
                {upBoardList.map((item) => (
                  <tr key={item.board_id} className={style.savelink}>
                    <td>{item.board_id}</td>
                    <td>
                      <Link to={`/review/detail/:${item.board_id}`}>{item.title}</Link>
                    </td>
                    <td>{item.hit}</td>
                    <td>{item.reg_dt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className={style.pagination}>
            <Pagination
              current={currentPage}
              total={totalItems}
              pageSize={10}
              showSizeChanger={false}
              onChange={handlePageChange}
            />
          </div>
        </div>
        
        <div className={style.chartContainer}>
          <h2 className={style.chartTitle}>감정 분석</h2>
          <ResponsiveContainer width="100%" height="100%" minWidth={400} minHeight={400} >
            <PieChart width={400} height={400}>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                label={({ name, percent = 0 }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                outerRadius={80}
                innerRadius={50}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${entry.name}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <text
                x="50%"
                y="47%"
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize={15}
              >게시판 감정도</text>
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>



  );

};
export default QnaList;
