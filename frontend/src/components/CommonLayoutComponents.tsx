import styled from 'styled-components';
import { Container, Row, Col } from 'react-bootstrap';

export const FullHeightContainer = styled(Container)`
  min-height: 100%;
  height: 100%;
`;

export const FullHeightRow = styled(Row)`
  min-height: 100%;
  height: 100%;
`;

export const MarginlessColumn = styled(Col)`
  margin: 0px;
  padding: 0px;
`;
