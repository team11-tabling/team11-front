import { styled } from 'styled-components';

export const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-items: center;
  flex-direction: column;
`;

export const Inputs = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 10px;
  margin-right: 10px;
`;

export const Form = styled.div`
  display: flex;
  height: 100%;
`;

// ReviewForm 전용 스타일
export const ReviewFormStyle = styled.form`
  display: flex; /* Flexbox 레이아웃 사용 */
  flex-direction: row; /* 자식 요소들을 수직 방향으로 정렬 */
  align-items: stretch; /* 가운데 정렬 */
  padding: 20px;
  background-color: white; /* 배경 색 */
  max-width: 570px;
  width: 400%; /* 너비를 100%로 설정하여 부모 요소에 맞춤 */
  margin: 0 auto; /* 상하 마진 없이 좌우 마진으로 중앙 정렬 */
`;


export const Title = styled.div`
  font-size: 30px;
  font-weight: 700;
  margin-bottom: 30px;
  color: #d1b000;
`;

export const Input = styled.input`
  font-size: 20px;
  height: 30px;
  border-radius: 10px;
  border: none;
  padding: 10px;
  &::placeholder {
    color: darkgray;
    font-size: 20px;
    font-weight: 500;
  }
`;