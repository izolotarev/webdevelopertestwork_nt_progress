import Table from 'react-bootstrap/Table';
import { Instrument, OrderSide, OrderStatus } from '../../Enums';
import { Order } from '../../Models/Base';
import CloseButton from 'react-bootstrap/CloseButton';
import { SyntheticEvent } from 'react';
import { wsClient } from '../../wsClientSingleton';



type OrderTableProps = {
  orders: Order[]
}

function OrderTable({ orders }: OrderTableProps) {

  const handleCancelClick = (evt: SyntheticEvent) => {
    if (!(evt.target instanceof HTMLButtonElement)) {
      return;
    }
    const orderId = Number(evt.target.dataset["id"]);
    if (!orderId) { return; }

    wsClient.cancelOrder(orderId);
  }

  return (
    <Table striped bordered hover responsive>
      <thead>
        <tr>
          <th>Id</th>
          <th>Creation time</th>
          <th>Change time</th>
          <th>Status</th>
          <th>Side</th>
          <th>Price</th>
          <th>Amount</th>
          <th>Instrument</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {
          orders.map((order) => {
            return (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{order.creationTime.toString()}</td>
                <td>{order.changeTime.toString()}</td>
                <td>{OrderStatus[order.status]}</td>
                <td className={`${order.side === OrderSide.sell ? 'font-red' : 'font-green'}`} >{OrderSide[order.side]}</td>
                <td className={`${order.side === OrderSide.sell ? 'font-red' : 'font-green'}`}>{order.price.toString()}</td>
                <td className={`${order.side === OrderSide.sell ? 'font-red' : 'font-green'}`}>{order.amount.toString()}</td>
                <td>{Instrument[order.instrument]}</td>
                <td><CloseButton data-id={order.id} onClick={handleCancelClick}></CloseButton></td>
              </tr>
            )
          })
        }
      </tbody>
    </Table>
  )
}

export default OrderTable;