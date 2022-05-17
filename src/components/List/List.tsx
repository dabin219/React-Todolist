import { useEffect, useState } from 'react';
import Card from './Card';
import { Todo } from 'interface/Todo';
import styled from 'styled-components';

const List = () => {
  const [list, setList] = useState<Todo[]>([]);
  useEffect(() => {
    const api = async () => {
      const data = await fetch('http://localhost:3004/works', {
        method: 'GET',
      });
      const jsonData = await data.json();
      setList(jsonData);
    };

    api();
  }, []);

  return (
    <Container>
      {list.map((item) => {
        const { id } = item;
        return <Card key={id} item={item} />;
      })}
    </Container>
  );
};

export default List;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;
