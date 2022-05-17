import React from 'react';
import { Todo } from 'interface/Todo';
import { faBell, faClock } from '@fortawesome/free-regular-svg-icons';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import moment from 'moment';
import styled from 'styled-components';

interface Props {
  item: Todo;
  api: () => void;
}

const Card = ({ item, api }: Props) => {
  const { id, name, startTime, endTime, requestedTime } = item;

  const inProgress: boolean = startTime && !endTime ? true : false;
  const isCompleted: boolean = startTime && endTime ? true : false;
  const status = inProgress ? '작업중' : isCompleted ? '작업완료' : '작업예정';

  const formatTime = (time: string) => {
    return moment(time).format('YYYY년 M월 D일 H시 m분');
  };

  const isRequestedTimeUp = moment().isAfter(requestedTime);
  const remainingTime = moment().diff(requestedTime);
  const remainingMinutes = -moment.duration(remainingTime).asMinutes();
  const elapsedTime = endTime
    ? moment(endTime).diff(startTime)
    : moment().diff(startTime);
  const formattedElapsedTime = moment.utc(elapsedTime).format('HH:mm');

  const buttonHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (inProgress) {
      fetch(`http://localhost:3004/works/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          endTime: moment().format('YYYY-MM-DD HH:mm:ss'),
        }),
      }).then(() => api());
    } else if (!isCompleted) {
      fetch(`http://localhost:3004/works/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          startTime: moment().format('YYYY-MM-DD HH:mm:ss'),
        }),
      }).then(() => api());
    }
  };

  return (
    <Container>
      <LeftContainer>
        <Status inProgress={inProgress} isCompleted={isCompleted}>
          {status}
        </Status>
        <Name>{name}</Name>
        <div>
          <FontAwesomeIcon icon={faBell} size={'lg'} />
          <RequestedTime isRequestedTimeUp={isRequestedTimeUp}>
            {formatTime(requestedTime)}
          </RequestedTime>
        </div>
      </LeftContainer>
      <RightContainer>
        {isCompleted && (
          <div>
            <FontAwesomeIcon icon={faCheck} color={'#4EBE27'} />
            <StartTimeToEndTime>{`${formatTime(startTime)} ~ ${formatTime(
              endTime,
            )}`}</StartTimeToEndTime>
          </div>
        )}
        {(inProgress || isCompleted) && (
          <span style={{ float: 'right' }}>
            <FontAwesomeIcon icon={faClock} />
            <ElapsedTime>{formattedElapsedTime}</ElapsedTime>
          </span>
        )}
        {remainingMinutes <= 15 && remainingMinutes > 0 && (
          <RemainingTime>
            업무시작까지 {Math.ceil(Number(remainingMinutes))}분 남았습니다.
          </RemainingTime>
        )}
        {!isCompleted && (
          <Button
            onClick={buttonHandler}
            disabled={
              !inProgress && !(remainingMinutes <= 15 && remainingMinutes > 0)
            }
          >
            {inProgress ? '업무 종료' : '업무 시작'}
          </Button>
        )}
      </RightContainer>
    </Container>
  );
};

export default Card;

const Container = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 80%;
  margin: 10px 20px;
  padding: 20px;
  border: 1px solid #eeeeee;
  border-radius: 12px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);

  @media screen and (max-width: 780px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const Status = styled.div<{ inProgress: boolean; isCompleted: boolean }>`
  display: inline-block;
  width: 70px;
  height: 28px;
  padding: 5px;
  margin-bottom: 10px;
  background-color: ${({ inProgress, isCompleted }) =>
    inProgress ? '#2260FF' : isCompleted ? '#797e9c' : '#0A2540'};
  color: #fff;
  border-radius: 16px;
  text-align: center;
  font-size: 14px;
`;

const Name = styled.span`
  height: 28px;
  margin: 5px 5px 10px 5px;
  padding: 5px 7px;
  color: #000000;
  font-weight: 500;
  font-size: 14px;
  line-height: 28px;
`;

const RequestedTime = styled.span<{ isRequestedTimeUp: boolean }>`
  margin-left: 12px;
  color: ${(props) => (props.isRequestedTimeUp ? 'red' : 'black')};
  font-weight: 400;
  font-size: 14px;
  line-height: 21px;
`;

const StartTimeToEndTime = styled.span`
  margin-left: 5px;
  font-weight: 400;
  font-size: 14px;
  line-height: 21px;
`;

const RemainingTime = styled.div`
  color: #2260ff;
  font-weight: 600;
  font-size: 14px;
  line-height: 21px;
`;

const ElapsedTime = styled.span`
  margin-left: 3px;
  font-weight: 500;
  font-size: 14px;
  line-height: 21px;
`;

const Button = styled.button`
  width: 80px;
  height: 29px;
  margin-left: 10px;
  color: #fff;
  border: none;
  background: #2260ff;
  border-radius: 4px;

  &:disabled {
    background: #e6e9f8;
    color: #cbcfe8;
  }
`;

const LeftContainer = styled.div`
  display: 'flex';
  flex-direction: 'column';

  @media screen and (max-width: 780px) {
    margin-bottom: 20px;
  }
`;

const RightContainer = styled.div`
  display: 'flex';
  flex-direction: 'column';
  align-items: flex-end;
  margin-left: auto;
`;
