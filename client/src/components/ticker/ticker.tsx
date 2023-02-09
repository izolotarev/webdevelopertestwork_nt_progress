import { ChangeEvent, SyntheticEvent, useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { Instrument, OrderSide } from '../../Enums';
import { wsClient } from '../../index';
import { useSelector } from 'react-redux';
import { getQuote, getSubscriptionId } from '../../store/reducers/market/market-selectors';
import { useAppDispatch } from '../../hooks/hooks';
import { unsubscribeMarketDataAction } from '../../store/actions/actions';
import Decimal from "decimal.js";

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

  const [amount, setAmount] = useState('') 

  const handleAmountChange = (evt: ChangeEvent<HTMLInputElement>) => {
    if (parseInt(evt.target.value) < 0) {
      setAmount('0');
      return;
    }
    setAmount(evt.target.value) 
  }

  const handleSellClick = (evt: SyntheticEvent) => {
    handlePlaceOrder(evt, OrderSide.sell);
  }

  const handleBuyClick = (evt: SyntheticEvent) => {
    handlePlaceOrder(evt, OrderSide.buy);
  }

  const handlePlaceOrder = (evt: SyntheticEvent, side: OrderSide) => {
    evt.preventDefault();
    const amountVal = parseFloat(amount);

    if (!instrument || !amountVal || !quote) {
      alert("Wrong instrument or amount!")
      return;
    }

    const price = side === OrderSide.sell ? quote?.bid : quote?.offer

    wsClient.placeOrder(
      instrument, 
      side, 
      new Decimal(amountVal), 
      price
    );
  }



  return (
    <Form className="ticker ticker__wrapper">
      <Form.Group className="mb-3" controlId="formInstrument">
        <Form.Label>Instrument</Form.Label>
        <Form.Select aria-label="Default select" onChange={handleSelectChange}>
          <option value={0}>Please select instrument</option>
          {
            Object.keys(Instrument)
              .filter((key) => Number(key))
              .map((key) => {
                const value = Number(key)
                return <option value={value} key={key}>{Instrument[value]}</option>
              })
          }
        </Form.Select>
      </Form.Group>

      <Form.Group className="mb-3" controlId="formAmount">
        <Form.Label>Amount</Form.Label>
        <Form.Control type="number" placeholder="Enter amount" onChange={handleAmountChange} value={amount} min="0"/>
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
          <Button className="btn-large" variant="danger" type="submit" onClick={handleSellClick}>
            Sell
          </Button>
        </Col>
        <Col>
          <Button className="btn-large" variant="success" type="submit" onClick={handleBuyClick}>
            Buy
          </Button>
        </Col>
      </Row>
    </Form>
  );
}

export default Ticker;