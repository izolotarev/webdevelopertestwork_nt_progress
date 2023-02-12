import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { ClientOrder } from '../../Models/Base';
import { Instrument, OrderSide } from '../../Enums';
import { wsClient } from '../../wsClientSingleton';

type TickerPopupProps = {
  order?: ClientOrder
  show: boolean
  onHide: () => void
}

function TickerPopup({ order, show, onHide: handleClose }: TickerPopupProps) {

  const handleConfirm = () => {
    if (!order) { return; }
    const {instrument, side, amount, price } = order;
    wsClient.placeOrder(instrument, side, amount, price);
    handleClose();
  }

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Please confirm your action</Modal.Title>
      </Modal.Header>
      <Modal.Body>{order ? `Are you sure you want to ${OrderSide[order.side]} ${Instrument[order.instrument]} for the price: ${order.price} ?`: ''}</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleConfirm}>
          Confirm
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default TickerPopup;