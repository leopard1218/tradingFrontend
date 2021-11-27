import '@styles/base/pages/page-auth.scss'
import { Table, Row, Col } from 'reactstrap'
//eslint-disable-next-line

const Institutional = () => {
  return (
    <div className='auth-wrapper auth-v2' style={{ flexDirection: 'column' }}>
      <Row style={{ width: '100%', marginLeft: '0', marginRight: '0', display: 'flex', justifyContent: 'center', backgroundColor: 'rgb(36, 43, 63)', paddingTop: '20px', paddingBottom: '20px' }}>
        <div style={{ width: '1000px' }}>
          <img src='/banners/5.jpg' style={{ width: '100%' }} />
        </div>
      </Row>
      <Row className='auth-inner m-0 mb-5' style={{ overflow: 'none', height: 'auto' }}>
        <Col className='d-none d-flex align-items-center p-5' lg='12' md='12' sm='12'>
          <div className='w-100 align-items-center justify-content-center px-5'>
            <h2 className="font-weight-bold pt-2 pb-2">Institutional</h2>
            <p className='mb-1'>Directly negotiate large blocks. Propose a price and size, and print the trade on our exchange.
              All negotiated trades are centrally cleared through the partner OTC clearinghouses.</p>
            <Row className='mt-4 mb-4'>
              <Col className='pl-3 pr-1' sm={4} md={4} lg={4} xl={4}>
                <p className='font-weight-bold'>Negotiate</p>
                <div>Negotiated trades<br />
                  Directly negotiate large blocks. Propose a price and size, and print the trade on our exchange. All negotiated trades are centrally cleared through the partner OTC clearinghouses.</div>
              </Col>
              <Col className='pl-3 pr-1' sm={4} md={4} lg={4} xl={4}>
                <p className='font-weight-bold'>API</p>
                <div>Connect directly to our simple, convenient HTTP+websockets API. Generate tokens for a variety of roles, including trader, account admin and auditor.</div>
              </Col>
              <Col className='pl-3 pr-1' sm={4} md={4} lg={4} xl={4}>
                <p className='font-weight-bold'>Trading Pits</p>
                <div>Meet other institutional traders in our virtual trading pit. Talk market color, network and make the connections you need to get block order flow.</div>
              </Col>
            </Row>
            <div style={{ display: 'flex', flexDirection: 'row' }}><p className='mb-1 text-bold font-weight-bold'>Questions about our institutional services?</p><p>Reach out to our sales team at <a href='mailto:institutional@fynance.capital' style={{ color: '#0563c1' }}>institutional@fynance.capital</a></p></div>
          </div>
        </Col>
      </Row>
      <Row style={{ backgroundColor: '#123262', width: '100%', justifyContent: 'center' }}>
        <div style={{ width: '1000px' }}>
          <img src='/Institution howto.png' style={{ width: '100%' }} />
        </div>
      </Row>
    </div>
  )
}

export default Institutional