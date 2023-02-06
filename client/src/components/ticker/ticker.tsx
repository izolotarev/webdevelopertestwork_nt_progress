import { ChangeEvent, useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { Instrument } from '../../Enums';
import { wsClient } from '../../index';
import { useSelector } from 'react-redux';
import { getQuote, getSubscriptionId } from '../../store/reducers/market/market-selectors';
import { useAppDispatch } from '../../hooks/hooks';
import { unsubscribeMarketDataAction } from '../../store/actions/actions';

function Ticker() {

  const [instrument, setInstrument] = useState(0);

  const quote = useSelector(getQuote);

  const handleSelectChange = (evt: ChangeEvent<HTMLSelectElement> ) => {
    const instrValue = parseInt(evt.target.value)
    setInstrument(instrValue);
  }

  const subscriptionId = useSelector(getSubscriptionId);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (subscriptionId) {
      wsClient.unsubscribeMarketData(subscriptionId);
      dispatch(unsubscribeMarketDataAction());
    }

    if (instrument) {
      wsClient.subscribeMarketData(instrument);
    }
  }, [instrument])

  return (
    <Form className="ticker ticker__wrapper">
      <Form.Group className="mb-3" controlId="formInstrument">
        <Form.Label>Instrument</Form.Label>
        <Form.Select aria-label="Default select" onChange={handleSelectChange}>
          <option value={0}>Please select instrument</option>
          {
            Object.keys(Instrument)
              .filter((k) => parseInt(k))
              .map((k) => {
                const n = parseInt(k)
                return <option value={n} key={k}>{Instrument[n]}</option>
              })
          }
        </Form.Select>
      </Form.Group>

      <Form.Group className="mb-3" controlId="formAmount">
        <Form.Label>Amount</Form.Label>
        <Form.Control placeholder="Enter amount" />
      </Form.Group>
      <Row>
        <Col className="border-right">
          <Form.Label>{quote?.bid.toString()}</Form.Label>
        </Col>
        <Col>
          <Form.Label>{quote?.offer.toString()}</Form.Label>
        </Col>
      </Row>
      <Row>
        <Col className="border-right">
          <Button className="btn-large" variant="danger" type="submit">
            Sell
          </Button>
        </Col>
        <Col>
          <Button className="btn-large" variant="success" type="submit">
            Buy
          </Button>
        </Col>
      </Row>
    </Form>
  );
}

export default Ticker;