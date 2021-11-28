import { useState, Fragment, useEffect } from 'react'
import Avatar from '@components/avatar'
import { useForm } from 'react-hook-form'
import { isObjEmpty } from '@utils'
import {
  Row,
  Col,
  ButtonGroup,
  Button,
  Nav,
  NavItem, Form,
  NavLink,
  Table,
  Modal, ModalHeader, ModalBody, ModalFooter,
  UncontrolledButtonDropdown, DropdownMenu, DropdownItem, DropdownToggle,
  FormGroup, Label, Input
} from 'reactstrap'
import ApexChart from './chart'
import jwt_decode from 'jwt-decode'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faShoppingBag, faHistory } from '@fortawesome/free-solid-svg-icons'
import { faRocketchat } from '@fortawesome/free-brands-svg-icons'
import { Check } from 'react-feather'
import '@styles/react/libs/charts/apex-charts.scss'
import '@styles/react/libs/flatpickr/flatpickr.scss'
import '@styles/base/pages/page-auth.scss'
import '@fortawesome/fontawesome-svg-core/styles.css'
import classnames from 'classnames'
import './statistics.css'
import axios from 'axios'
import API_URL from '../../constants/apiUrl'
import { toast, Slide } from 'react-toastify'
import { useHistory } from 'react-router-dom'
const ToastContent = () => (
  <Fragment>
    <div className='toastify-header'>
      <div className='title-wrapper'>
        <Avatar size='sm' color='success' />
        <h6 className='toast-title font-weight-bold'>Deposit Instructions Emailed.</h6>
      </div>
    </div>
    <div className='toastify-body'>
      <span>Check your E-mail address within the next 5 minutes for instructions on completing deposit.</span>
      <p>Email is sent only from admin@fynance.capital. Check your spam folder</p>
    </div>
  </Fragment>
)

const Statistics = props => {
  const [options, setOptions] = useState(1)
  const [gearing, setGearing] = useState(3)
  const [margin, setMargin] = useState(5)
  const [lifeSpan, setLifeSpan] = useState(45)
  const [currentPrice, setCurrentPrice] = useState(0)
  const [active, setActive] = useState('1')
  const [tradeType, setTradeType] = useState(1)
  const [data, setData] = useState([])
  const [basicModal, setBasicModal] = useState(false)
  const [basicModal1, setBasicModal1] = useState(false)
  const [update, setUpdate] = useState(0)
  const [balance, setBalance] = useState(0)
  const [user, setUser] = useState(0)
  const [uint, setUint] = useState('USD')
  const [isCheck, setCheck] = useState(false)
  const { register, errors, handleSubmit } = useForm()
  const [selCurrency, setSelCurrency] = useState(0)
  const history = useHistory()
  const delayTime = 5000
  let timer
  const stateFlag = (entry, trade) => {
    if ((entry > currentPrice && trade === false) || (entry < currentPrice && trade === true)) {
      return true
    } else return false
  }

  const isExpiredFunc = async (data) => {
    if (data.isExpired === false && Date.now() > (data.endTime + delayTime)) {
      try {
        const dat = await axios.get(`${API_URL}/trade`)
        if (dat.data.length > 0) {
          const balanceData = await axios.get(`${API_URL}/users/${user._id}`)
          setData(dat.data)
          setBalance(balanceData.data.balance)
          setUser(balanceData.data)
        }
      } catch (err) {
        console.log(err)
      }
    }
  }

  const timeFunc = async () => {
    if (location.pathname !== "/statistics") {
      clearInterval(timer)
    }
    const price = await axios.get('https://api.coinbase.com/v2/prices/spot?currency=USD')
    setCurrentPrice(price.data.data.amount)
    setUpdate(Date.now())
  }
  useEffect(async () => {
    const token = localStorage.getItem('jwtToken')
    if (!token) history.push('/login')
    else {
      try {
        // setBalance(JSON.parse(localStorage.getItem('user')).balance)
        const dat = await axios.get(`${API_URL}/trade`)
        if (dat.data.length > 0) {
          setData(dat.data)
        }
        const userDecoded = jwt_decode(token)
        console.log(userDecoded)
        const initUser = await axios.get(`${API_URL}/users/${userDecoded.id}`)
        setUser(initUser.data)
        setBalance(initUser.data.balance)
        timer = setInterval(() => {
          timeFunc()
        }, 1000)
      } catch (err) {
        console.log('err')
      }
    }

  }, [])

  const toggle = tab => {
    if (active !== tab) {
      setActive(tab)
    }
  }

  async function tradeCom() {
    if (currentPrice > 0) {
      // const user = JSON.parse(localStorage.getItem('user'))
      console.log(user._id)
      if (balance > currentPrice * margin * options / 100) {
        setBalance(balance - (currentPrice * margin * options / 100))
        const userId = user._id
        axios.post(`${API_URL}/trade/create`, {
          tradeType, options, gearing, lifeSpan, entryPrice: currentPrice, userId, margin
        }).then((dat) => {
          setData(dat.data)
        }).catch(err => {
          console.log(err)
        })
      } else {
        alert("You have insuficient funds. Please top-up.")
      }

    }
  }
  const activeCountFunc = () => {
    let num = 0
    for (let i = 0; i < data.length; i++) {
      if (data[i].isExpired === false) {
        num++
      }
    }
    return num
  }

  const restTime = (data) => {
    const secondTime = Math.trunc((data.endTime - Date.now()) / 1000)
    if (secondTime >= 0) {
      const second = secondTime % 60
      const minute = Math.trunc(secondTime / 60)
      const rest = `${minute}:${second}`
      return rest
    } else {
      isExpiredFunc(data)
      return "0:0"
    }
  }

  // const displayAlert = () => {

  // }
  const onSubmit = (e) => {
    if (isObjEmpty(errors)) {
      if (isCheck === true) {
        toast.success(
          <ToastContent />,
          { transition: Slide, hideProgressBar: true, autoClose: 2000 }
        )

      } else {
        alert('please check "I hereby accept Terms and Conditions"')
      }
    }
  }
  return (
    <div className='auth-wrapper auth-v2 background' style={{ flexDirection: 'column', paddingBottom: '20px' }}>
      <Row className='auth-inner m-0' style={{ overflow: 'none', height: 'auto' }}>
        <Col lg='1' sm='12' md='12' xl='1' style={{ marginTop: '40px' }}>
          <Row style={{ cursor: 'pointer', margin: '10px' }}>
            <Col>
              <Row style={{ justifyContent: 'center', marginBottom: '10px' }}>
                <FontAwesomeIcon icon={faShoppingBag} size='2x' style={{ width: '20px', height: '20px' }} />
              </Row>
              <Row style={{ justifyContent: 'center', fontSize: '12px' }}>
                {/* <Row style={{ fontSize: '15px', justifyContent: 'center' }}> */}
                TOTAL
              </Row>
              <Row style={{ justifyContent: 'center', fontSize: '12px' }}>
                {/* <Row style={{ fontSize: '15px', justifyContent: 'center' }}> */}
                PORTFOLIO
              </Row>
            </Col>
          </Row>
          <Row style={{ cursor: 'pointer', margin: '10px' }} onClick={() => setBasicModal(!basicModal)}>
            <Col>
              <Row style={{ justifyContent: 'center', marginBottom: '10px' }}>
                <FontAwesomeIcon icon={faHistory} size='2x' style={{ width: '20px', height: '20px' }} />
              </Row>
              <Row style={{ justifyContent: 'center', fontSize: '12px' }}>
                {/* <Row style={{ fontSize: '15px', justifyContent: 'center' }}> */}
                TRADING
              </Row>
              <Row style={{ justifyContent: 'center', fontSize: '12px' }}>
                {/* <Row style={{ fontSize: '15px', justifyContent: 'center' }}> */}
                HISTORY
              </Row>
            </Col>
          </Row>
          <Row style={{ cursor: 'pointer', margin: '10px' }}>
            <Col>
              <Row style={{ justifyContent: 'center', marginBottom: '10px' }}>
                <FontAwesomeIcon icon={faRocketchat} size='2x' style={{ width: '20px', height: '20px' }} />
              </Row>
              <Row style={{ justifyContent: 'center', fontSize: '12px' }}>
                {/* <Row style={{ fontSize: '15px', justifyContent: 'center' }}> */}
                CHARTS&
              </Row>
              <Row style={{ justifyContent: 'center', fontSize: '12px' }}>
                {/* <Row style={{ fontSize: '15px', justifyContent: 'center' }}> */}
                SUPPORT
              </Row>
            </Col>
          </Row>
        </Col>
        <Col style={{ justifyContent: 'center' }} sm='12' md='12' lg='9' xl='9'>
          <div className="balance">
            <Row>
              <Col sm="6" md='6' lg='6' xl='6'>
                <div style={{ textAlign: 'center' }}>
                  <p style={{ color: "orange", fontWeight: "400", fontSize: "18px" }}>FYCAP$&nbsp;
                    <span style={{ fontSize: '20px' }}>{Math.trunc(balance)}</span>
                    .{(Math.trunc((balance - Math.trunc(balance)) * 100))}
                  </p>
                  <div style={{ width: '100%', height: '3px', backgroundColor: "green" }} ></div>
                  <p style={{ color: "rgb(94, 86, 82)", textAlign: "right", fontSize: '14px' }} >1 FYCAP = 1 USDT</p>
                </div>
              </Col>
              <Col sm="6" md='6' lg='6' xl='6'>
                <div className='deposit' onClick={() => setBasicModal1(!basicModal1)}>
                  <img width='34px' height='34px' style={{ color: "green" }} src='./assets/img/dollar.png' />
                  &nbsp;&nbsp;&nbsp;<span style={{ fontSize: '16px' }}>Deposit</span>
                </div>
              </Col>
            </Row>
          </div>
          <ApexChart />
          <div className='active-div' >
            <Nav tabs style={{ marginBottom: "0px" }}>
              <NavItem>
                <NavLink
                  active={active === '1'}
                  onClick={() => {
                    toggle('1')
                  }}
                >
                  ACTIVE {activeCountFunc()}
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  active={active === '2'}
                  onClick={() => {
                    toggle('2')
                  }}
                >
                  PENDING 0
                </NavLink>
              </NavItem>
            </Nav>
            <Table responsive style={{ color: '#ffffff' }}>
              <thead>
                <tr>
                  <th style={{ backgroundColor: 'rgb(36, 45, 67)' }} scope='col' className='text-nowrap'>
                    Name
                  </th>
                  <th style={{ backgroundColor: 'rgb(36, 45, 67)' }} scope='col' className='text-nowrap'>
                    Type
                  </th>
                  <th style={{ backgroundColor: 'rgb(36, 45, 67)' }} scope='col' className='text-nowrap'>
                    Date
                  </th>
                  <th style={{ backgroundColor: 'rgb(36, 45, 67)' }} scope='col' className='text-nowrap'>
                    Quantity
                  </th>
                  <th style={{ backgroundColor: 'rgb(36, 45, 67)' }} scope='col' className='text-nowrap'>
                    Open
                  </th>
                  <th style={{ backgroundColor: 'rgb(36, 45, 67)' }} scope='col' className='text-nowrap'>
                    Current Price
                  </th>
                  <th style={{ backgroundColor: 'rgb(36, 45, 67)' }} scope='col' className='text-nowrap'>
                    P/L
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.map((dat, i) => {
                  if (dat.isExpired === false) {
                    return (
                      <tr key={i}>
                        <td className='text-nowrap'>BTCUSDT</td>
                        <td className='text-nowrap'>{dat.tradeType === true ? "CALL" : "PUT"}</td>
                        <td className='text-nowrap' style={{ color: "rgb(193, 94, 11)" }}><i className="fa fa-clock-o"></i>&nbsp;{restTime(dat)}</td>
                        <td className='text-nowrap'>{dat.options}</td>
                        <td className='text-nowrap'>{dat.entryPrice}</td>
                        <td className='text-nowrap'>{currentPrice}</td>
                        <td className='text-nowrap'>{stateFlag(dat.entryPrice, dat.tradeType) ? <i className='fas fa-play rotate0' size='2x'></i> : <i className='fas fa-play rotate1' size='2x'></i>}</td>
                      </tr>
                    )
                  }
                })}

              </tbody>
            </Table>

          </div>
        </Col>
        <Col lg='2' sm='12' md='12' xl='2' >
          <Row style={{ marginTop: '15px', marginLeft: '15px', marginRight: '15px' }}>
            <Col sm='12' md='12' lg='12' xl='12' style={{ border: '1px solid #444444', borderRadius: '5px', justifyContent: 'center' }}>
              <Row><div style={{ width: '100%', textAlign: 'center', marginTop: '5px', marginBottom: '5px' }}>Number Options</div></Row>
              <Row><div style={{ width: '100%', textAlign: 'center', marginTop: '5px', marginBottom: '5px', fontSize: '14px', fontWeight: 700 }}>{options}</div></Row>
              <Row>
                <ButtonGroup style={{ width: '100%' }}>
                  <Button className='dark border-left-none border-bottom-none' outline style={{ fontSize: '14px', paddingTop: '2px', paddingBottom: '2px', borderRadius: '0px 0px 0px 5px' }} onClick={() => setOptions(options + 1)}>
                    +
                  </Button>
                  <Button className='dark border-left-none border-bottom-none' outline style={{ fontSize: '14px', paddingTop: '2px', paddingBottom: '2px', borderRadius: '0px 0px 5px 0px' }} onClick={() => setOptions(options > 1 ? options - 1 : options)}>
                    -
                  </Button>
                </ButtonGroup>
              </Row>
            </Col>
          </Row>
          <Row style={{ marginTop: '15px', marginLeft: '15px', marginRight: '15px' }}>
            <Col sm='12' md='12' lg='12' xl='12' style={{ border: '1px solid #444444', borderRadius: '5px' }}>
              <Row><div style={{ width: '100%', textAlign: 'center', marginTop: '5px', marginBottom: '5px' }}>Gearing</div></Row>
              <Row><div style={{ width: '100%', textAlign: 'center', marginTop: '5px', marginBottom: '5px', fontSize: '14px', fontWeight: 700, className: '#2c1e1f' }}>{gearing}x</div></Row>
              <Row>
                <ButtonGroup style={{ width: '100%' }}>
                  <Button className='dark border-left-none border-bottom-none' onClick={() => {
                    setGearing(3)
                    setMargin(5)
                  }} outline style={{ padding: '1px 1px 1px 1px' }} active={gearing === 3}>
                    3x
                  </Button>
                  <Button className='dark border-left-none border-bottom-none' onClick={() => {
                    setGearing(6)
                    setMargin(10)
                  }} outline style={{ padding: '1px 1px 1px 1px' }} active={gearing === 6}>
                    6x
                  </Button>
                  <Button className='dark border-left-none border-bottom-none' onClick={() => {
                    setGearing(9)
                    setMargin(15)
                  }} outline style={{ padding: '1px 1px 1px 1px' }} active={gearing === 9}>
                    9x
                  </Button>
                </ButtonGroup>
              </Row>
            </Col>
          </Row>
          <Row style={{ marginTop: '15px', marginLeft: '15px', marginRight: '15px', borderBottom: 'none' }}>
            <Col sm='12' md='12' lg='12' xl='12' style={{ border: '1px solid #444444', borderRadius: '5px' }}>
              <Row><div style={{ width: '100%', textAlign: 'center', marginTop: '5px', marginBottom: '5px' }}>Initial Margin</div></Row>
              <Row><div style={{ width: '100%', textAlign: 'center', marginTop: '5px', marginBottom: '5px', fontSize: '14px', fontWeight: 700, className: '#2c1e1f' }}>{margin}%</div></Row>
              <Row>
                <ButtonGroup style={{ width: '100%' }}>
                  <Button className='dark border-left-none border-bottom-none' onClick={() => {
                    setGearing(3)
                    setMargin(5)
                  }} outline style={{ padding: '1px 1px 1px 1px' }} active={margin === 5}>
                    5%
                  </Button>
                  <Button className='dark border-left-none border-bottom-none' onClick={() => {
                    setGearing(6)
                    setMargin(10)
                  }} outline style={{ padding: '1px 1px 1px 1px' }} active={margin === 10}>
                    10%
                  </Button>
                  <Button className='dark border-left-none border-bottom-none' onClick={() => {
                    setGearing(9)
                    setMargin(15)
                  }} outline style={{ padding: '1px 1px 1px 1px' }} active={margin === 15}>
                    15%
                  </Button>
                </ButtonGroup>
              </Row>
            </Col>
          </Row>
          <Row style={{ marginTop: '15px', marginLeft: '15px', marginRight: '15px' }}>
            <Col sm='12' md='12' lg='12' xl='12' style={{ border: '1px solid #444444', borderRadius: '5px' }}>
              <Row><div style={{ width: '100%', textAlign: 'center', marginTop: '5px', marginBottom: '5px' }}>Premium</div></Row>
              <Row><div style={{ width: '100%', textAlign: 'center', marginTop: '5px', marginBottom: '5px', fontSize: '14px', fontWeight: 700 }}>USDT {Math.trunc(margin * options * currentPrice / 100)}</div></Row>
            </Col>
          </Row>
          <Row style={{ marginTop: '15px', marginLeft: '15px', marginRight: '15px' }}>
            <Col sm='12' md='12' lg='12' xl='12' style={{ border: '1px solid #444444', borderRadius: '5px' }}>
              <Row><div style={{ width: '100%', textAlign: 'center', marginTop: '5px', marginBottom: '5px' }}>Time Frame</div></Row>
              <Row><div style={{ width: '100%', textAlign: 'center', marginTop: '5px', marginBottom: '5px', fontSize: '14px', fontWeight: 700 }}>{lifeSpan} min</div></Row>
              <Row>
                <ButtonGroup style={{ width: '100%' }}>
                  <Button className='dark border-left-none border-bottom-none' onClick={() => setLifeSpan(45)} outline style={{ padding: '1px 1px 1px 1px', borderRadius: '0px 0px 0px 5px' }} active={lifeSpan === 45}>
                    45
                  </Button>
                  <Button className='dark border-left-none border-bottom-none' onClick={() => setLifeSpan(75)} outline style={{ padding: '1px 1px 1px 1px' }} active={lifeSpan === 75}>
                    75
                  </Button>
                  <Button className='dark border-left-none border-bottom-none' onClick={() => setLifeSpan(90)} outline style={{ padding: '1px 1px 1px 1px' }} active={lifeSpan === 90}>
                    90
                  </Button>
                  <Button className='dark border-left-none border-bottom-none' onClick={() => setLifeSpan(180)} outline style={{ padding: '1px 1px 1px 1px' }} active={lifeSpan === 180}>
                    180
                  </Button>
                  <Button className='dark border-right-none border-bottom-none' onClick={() => setLifeSpan(480)} outline style={{ padding: '1px 1px 1px 1px', borderRadius: '0px 0px 5px 0px' }} active={lifeSpan === 480}>
                    480
                  </Button>
                </ButtonGroup>
              </Row>
            </Col>
          </Row>
          <Row style={{ marginTop: '15px', marginLeft: '5px', marginRight: '5px' }}>
            <Col sm='6' md='6' lg='6' xl='6' style={{ paddingRight: '3px' }}>
              <Button.Ripple className="call-btn" block color='success' style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setTradeType(1)}>{tradeType === 1 && <Check size='1rem' />} Call</Button.Ripple>
            </Col>
            <Col sm='6' md='6' lg='6' xl='6' style={{ paddingLeft: '3px' }}>
              <Button.Ripple className="call-btn" block color='danger' style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setTradeType(0)}>{tradeType === 0 && <Check size='1rem' />} Put</Button.Ripple>
            </Col>
          </Row>
          <Row style={{ marginTop: '15px', marginLeft: '15px', marginRight: '15px' }}>
            <Col sm='12' md='12' lg='12' xl='12' style={{ border: '1px solid #444444', borderRadius: '5px' }}>
              <Row><div style={{ width: '100%', textAlign: 'center', marginTop: '5px', marginBottom: '5px' }}>Strike Price</div></Row>
              <Row><div style={{ width: '100%', textAlign: 'center', marginTop: '5px', marginBottom: '5px', fontSize: '14px', fontWeight: 700 }}>USDT {currentPrice}</div></Row>
            </Col>
          </Row>
          <Row style={{ marginTop: '15px', marginLeft: '15px', marginRight: '15px' }}>
            <Button.Ripple block color='success' onClick={() => tradeCom()}>
              Trade Now
            </Button.Ripple>
          </Row>
        </Col>
      </Row >

      <Modal isOpen={basicModal} toggle={() => setBasicModal(!basicModal)} className="historymodal">
        <ModalHeader style={{ backgroundColor: "rgb(35, 45, 65)" }} tag="h4">Trading History
          <span className="closeButton" onClick={() => setBasicModal(!basicModal)}>×</span>
        </ModalHeader>
        <ModalBody style={{ backgroundColor: "rgb(35, 45, 65)" }}>

          <div className='demo-inline-spacing'>
            <Table style={{ color: "rgb(220,220,220)" }}>
              <thead >
                <tr style={{ marginTop: '20px' }}>
                  <th style={{ backgroundColor: "rgb(35, 45, 65)" }}>Trade</th>
                  <th style={{ backgroundColor: "rgb(35, 45, 65)" }}>Asset & Type</th>
                  <th style={{ backgroundColor: "rgb(35, 45, 65)" }}>Result (P/L)</th>
                </tr>
              </thead>
              <tbody>
                {data.map((dat, i) => {
                  if (dat.isExpired === true) {
                    return (
                      <tr key={i}>
                        <td className='text-nowrap'>{dat.createdAt}</td>
                        <td className='text-nowrap'>
                          BTCUSDT
                          <br />
                          {dat.options} {dat.tradeType ? "CALL" : "PUT"}
                        </td>
                        <td className='text-nowrap'>
                          {dat.result}USDT
                          <br />
                          {dat.outcome ? <i className='fas fa-play rotate0' size='2x'></i> : <i className='fas fa-play rotate1' size='2x'></i>}
                        </td>
                      </tr>
                    )
                  }
                })}

              </tbody>
            </Table>
          </div>
        </ModalBody>
      </Modal>
      <Modal isOpen={basicModal1} toggle={() => setBasicModal1(!basicModal1)} className="depositModal">
        <ModalHeader style={{ backgroundColor: "rgb(28, 32, 48)" }} tag="h4">Deposit
          <span className="closeButton" onClick={() => setBasicModal1(!basicModal1)}>×</span>
        </ModalHeader>
        <ModalBody style={{ backgroundColor: "rgb(28, 32, 48)" }}>
          <Form className='auth-login-form mt-2' onSubmit={handleSubmit(onSubmit)}>
            <Row>
              <Col xl='4' lg='4' md='4' >
                <Row className={selCurrency === 1 ? 'sidebar active' : 'sidebar'} onClick={() => setSelCurrency(1)}>
                  <Col xl='3' lg='3' md='3' >
                    <img src='./assets/img/mastercard.svg' width='40px' height='40px' />
                    <i className='fa fa-cc-visa sidebar-icon visa-icon' ></i>
                  </Col>
                  <Col xl='9' lg='9' md='9'>
                    <p style={{ color: 'white' }}>Visa / Mastercard</p>
                    <p>instant</p>
                  </Col>
                </Row>

                {/* <hr /> */}
                <Row className={selCurrency === 2 ? 'sidebar active' : 'sidebar'} onClick={() => setSelCurrency(2)}>
                  <Col xl='3' lg='3' md='3' >
                    <img src='./assets/img/Uiconstock-E-Commerce-Bitcoin.svg' />
                  </Col>
                  <Col xl='9' lg='9' md='9'>
                    <p style={{ color: 'white' }}>Cryptocurrencies</p>
                  </Col>
                </Row>

                {/* <hr />
                <Row className='sidebar'>
                  <Col xl='3' lg='3' md='3' >
                    <img src='./assets/img/perfect.svg' width='32px' height='32px' />
                  </Col>
                  <Col xl='9' lg='9' md='9'>
                    <p style={{ color: 'white' }}>Perfect money</p>
                    <p>1-2 minutes</p>
                  </Col>
                </Row>
                <hr />
                <Row className='sidebar'>
                  <Col xl='3' lg='3' md='3' >
                    <img src='./assets/img/kisspng-webmoney.png' width='50px' height='50px' />
                  </Col>
                  <Col xl='9' lg='9' md='9'>
                    <p style={{ color: 'white' }}>WebMoney WMZ</p>
                  </Col>
                </Row> */}
              </Col>
              <Col xl='8' lg='8' md='8'>
                <Row>
                  <Col xl='12' lg='12' md='12'>
                    <div className='creditcard'>
                      <div className='left-creditcard'>
                        <div style={{ width: '80%', paddingTop: '80px' }}>
                          <FormGroup >
                            <Input type='number' id='basicInput' bsSize='lg' placeholder='Card Number'
                              className={classnames({ 'is-invalid': errors['card-number'] })}
                              innerRef={register({ required: true, validate: value => value !== '' })} required />
                          </FormGroup>

                          <div style={{ margin: '20px' }}>
                            <Row>
                              <Col xl='3' lg='3' md='3'></Col>
                              <Col xl='3' lg='3' md='3'><p>VALID THRU</p></Col>
                              <Col xl='3' lg='3' md='3'>
                                <Input type='number' bsSize='lg' id='basicInput' placeholder='MM'
                                  className={classnames({ 'is-invalid': errors['MM'] })}
                                  innerRef={register({ required: true, validate: value => value !== '' })} /> </Col>
                              <Col xl='3' lg='3' md='3'>
                                <Input type='number' bsSize='lg' id='basicInput' placeholder='YY'
                                  className={classnames({ 'is-invalid': errors['YY'] })}
                                  innerRef={register({ required: true, validate: value => value !== '' })} /></Col>
                            </Row>
                          </div>
                          <FormGroup >
                            <Input type='text' bsSize='lg' id='basicInput' placeholder='Card holder'
                              className={classnames({ 'is-invalid': errors['card-holder'] })}
                              innerRef={register({ required: true, validate: value => value !== '' })} required />
                          </FormGroup>
                        </div>
                      </div>
                      <div className='right-creditcard'>
                        <div style={{ width: '100%', height: '70px', backgroundColor: 'rgb(53, 60, 76)', clear: 'left' }}>
                        </div>
                        <div>
                          <Input type='text' id='basicInput' bsSize='lg' placeholder='CVC' style={{ position: 'absolute', top: '150px', left: '500px', width: '100px' }}
                            className={classnames({ 'is-invalid': errors['CVC'] })}
                            innerRef={register({ required: true, validate: value => value !== '' })} required />
                        </div>
                        <div>
                          <p style={{ position: 'absolute', top: '220px', left: '500px', width: '100px' }}>The last three digits on the reverse</p>
                        </div>
                      </div>
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col xl='12' lg='12' md='12'>
                    <div className="form-check form-check-inline" style={{ padding: '20px' }}>
                      <Input className="form-check-input" type="checkbox" id="inlineCheckbox2" value="unchecked" onClick={() => setCheck(!isCheck)} />
                      <label className="form-check-label" htmlFor="inlineCheckbox2">I hereby accept Terms and Conditions</label>
                    </div>
                  </Col>
                  <Col xl='12' lg='12' md='12' style={{ display: 'flex', alignItems: 'center' }}>
                    <div style={{ width: "30%", float: 'left', marginTop: '12px' }}>
                      <FormGroup >
                        <Input type='number' id='basicInput' bsSize='lg' placeholder='Amount'
                          className={classnames({ 'is-invalid': errors['amount'] })}
                          innerRef={register({ required: true, validate: value => value !== '' })} />
                      </FormGroup>
                    </div>
                    <div style={{ width: "20%", float: 'left' }}>
                      {/* <div className='demo-inline-spacing'> */}
                      <UncontrolledButtonDropdown style={{ padding: '5px', width: '100px', height: '55px' }}>
                        <Button outline color='secondary'>
                          {uint}
                        </Button>
                        <DropdownToggle outline className='dropdown-toggle-split' color='secondary' caret></DropdownToggle>
                        <DropdownMenu right>
                          <DropdownItem href='#' tag='a' onClick={() => setUint('USD')}>
                            USD
                          </DropdownItem>
                          <DropdownItem href='#' tag='a' onClick={() => setUint('GBP')}>
                            GBP
                          </DropdownItem>
                          <DropdownItem href='#' tag='a' onClick={() => setUint('EUR')}>
                            EUR
                          </DropdownItem>
                        </DropdownMenu>
                      </UncontrolledButtonDropdown>
                      {/* </div> */}
                    </div>
                    <div style={{ width: "20%", float: 'left' }}>
                      <button type="submit" className="btn btn-success waves-effect waves-float waves-light" style={{ width: '200px', height: '45px' }}>Continue</button>
                    </div>
                  </Col>
                  <img src='./assets/img/back.png' style={{ paddingLeft: '100px' }} />
                </Row>

              </Col>

            </Row>
          </Form>


        </ModalBody>
      </Modal>
    </div >
  )
}

export default Statistics