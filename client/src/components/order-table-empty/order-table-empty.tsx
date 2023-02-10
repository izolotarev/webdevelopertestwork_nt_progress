import Table from 'react-bootstrap/Table';


function OrderTableEmpty() {
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
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>No orders</td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
      </tbody>
    </Table>
  )
}

export default OrderTableEmpty;