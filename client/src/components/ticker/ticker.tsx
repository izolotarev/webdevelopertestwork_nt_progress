import { ChangeEvent, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { Instrument } from '../../Enums';


function Ticker() {

  const instruments = Object.keys(Instrument);

  const [instrument, setInstrument] = useState(0);

  const handleSelectChange = (evt: ChangeEvent<HTMLSelectElement> ) => {
    setInstrument(parseInt(evt.target.value));
  }

  return (
    <Form className="ticker ticker__wrapper">
      <Form.Group className="mb-3" controlId="formInstrument">
        <Form.Label>Instrument</Form.Label>
        <Form.Select aria-label="Default select" onChange={handleSelectChange}>
          <option value={0}>Please select instrument</option>
          {
            instruments
              .filter((k) => parseInt(k))
              .map((k) => {
                const n = parseInt(k)
                return <option value={n}>{Instrument[n]}</option>
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
          <Form.Label>8.54</Form.Label>
        </Col>
        <Col>
          <Form.Label>8.55</Form.Label>
        </Col>
      </Row>
      <Row>
        <Col className="border-right">
          <Button variant="danger" type="submit">
            Sell
          </Button>
        </Col>
        <Col>
          <Button variant="success" type="submit">
            Buy
          </Button>
        </Col>
      </Row>
    </Form>
  );
}

export default Ticker;