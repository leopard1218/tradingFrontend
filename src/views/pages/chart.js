import React from 'react'
import ReactApexChart from 'react-apexcharts'
import axios from 'axios'
class ApexChart extends React.Component {
  constructor(props) {
    super(props)

    this.state = {

      series: [
        {
          data: []
        }
      ],
      options: {
        colors: ["#FFFFFF"],
        chart: {
          id: 'area-datetime',
          type: 'area',
          height: 350,
          zoom: {
            autoScaleYaxis: true
          }
        },
        grid: {
          xaxis: {
            lines: {
              show: true
            }
          },
          yaxis: {
            lines: {
              show: true
            }
          }
        },
        stroke: {
          width: 1
        },
        annotations: {
          yaxis: [
            {
              y: 30,
              borderColor: '#999',
              label: {
                show: true,
                text: 'Support',
                style: {
                  color: "#fff",
                  background: '#00E396'
                }
              },
              fillColor: "#00E396"
            }

          ],
          xaxis: [
            {
              x: new Date(Date.now()).getTime(),
              yAxisIndex: 0,
              label: {
                show: true,
                text: 'Rally',
                style: {
                  color: "#fff",
                  background: '#00E396'
                }
              }
            }
          ]
        },
        dataLabels: {
          enabled: false
        },
        markers: {
          size: 0,
          style: 'hollow'
        },
        xaxis: {
          axisBorder: {
            show: true,
            color: '#78909C',
            height: 1,
            width: '100%',
            offsetX: 0,
            offsetY: 0
          },
          type: 'datetime',
          min: new Date(Date.now() - (365 * 86400 * 1000)).getTime(),
          tickAmount: 1

        },
        tooltip: {
          x: {
            format: 'dd MMM yyyy'
          },
          y: {
            formatter: (val) => {
              return val
            },
            title: {
              formatter: (seriesName) => {
                return 'BTC PRICE'
              }
            }
          }
        },
        dropShadow: {
          enabled: true,
          top: 0,
          left: 0,
          blur: 3,
          opacity: 0.5
        },
        fill: {
          colors: ['#121212'],
          type: 'gradient',
          gradient: {
            shadeIntensity: 1,
            opacityFrom: 0,
            opacityTo: 0.5,
            stops: [0, 100]
          }
        }
      },
      selection: 'year'
    }
    const priceArray = []
    let onePrice = []
    axios.get('https://api.coinbase.com/v2/prices/BTC-USD/historic?period=year')
      .then(prices => {
        const basicPrice = prices.data.data.prices
        // console.log(basicPrice)

        if (basicPrice.length > 0) {
          for (let i = 0; i < basicPrice.length; i++) {
            onePrice.push(basicPrice[i].time)
            onePrice.push(basicPrice[i].price)
            priceArray.push(onePrice)
            onePrice = []
          }
        }
        const updateSeries = []
        updateSeries.push({ data: priceArray })

        // console.log(priceArray)
        this.setState({ series: updateSeries })
      })

  }


  async updateData(timeline) {
    this.setState({
      selection: timeline
    })
    const priceArray = []
    let onePrice = []
    const prices = await axios.get(`https://api.coinbase.com/v2/prices/BTC-USD/historic?period=${timeline === 'ytd' || timeline === 'all' || timeline === "six_months" ? 'year' : timeline}`)
    const basicPrice = prices.data.data.prices
    console.log(basicPrice)

    if (basicPrice.length > 0) {
      for (let i = 0; i < basicPrice.length; i++) {
        onePrice.push(basicPrice[i].time)
        onePrice.push(basicPrice[i].price)
        priceArray.push(onePrice)
        onePrice = []
      }
    }
    const updateSeries = []
    updateSeries.push({ data: priceArray })

    console.log(priceArray)
    this.setState({ series: updateSeries })
    switch (timeline) {
      case 'day':
        ApexCharts.exec(
          'area-datetime',
          'zoomX',
          new Date(Date.now() - (86400 * 1000)).getTime(),
          new Date(Date.now()).getTime()
        )
        break
      case 'week':
        ApexCharts.exec(
          'area-datetime',
          'zoomX',
          new Date(Date.now() - (7 * 86400 * 1000)).getTime(),
          new Date(Date.now()).getTime()
        )
        break
      case 'month':
        ApexCharts.exec(
          'area-datetime',
          'zoomX',
          new Date(Date.now() - (30 * 86400 * 1000)).getTime(),
          new Date(Date.now()).getTime()
        )
        break
      case 'six_months':
        ApexCharts.exec(
          'area-datetime',
          'zoomX',
          new Date(Date.now() - (183 * 86400 * 1000)).getTime(),
          new Date(Date.now()).getTime()
        )
        break
      case 'year':
        ApexCharts.exec(
          'area-datetime',
          'zoomX',
          new Date(Date.now() - (365 * 86400 * 1000)).getTime(),
          new Date(Date.now()).getTime()
        )
        break
      case 'ytd':
        ApexCharts.exec(
          'area-datetime',
          'zoomX',
          new Date('2021-1-1').getTime(),
          new Date(Date.now()).getTime()
        )
        break
      // case 'all':
      //   ApexCharts.exec(
      //     'area-datetime',
      //     'zoomX',
      //     new Date('23 Jan 2012').getTime(),
      //     new Date('27 Feb 2013').getTime()
      //   )
      //   break
      default:
    }
  }


  render() {
    return (
      <div id="chart" >
        <div className="toolbar">
          <button id="day" onClick={() => this.updateData('day')} className={(this.state.selection === 'day' ? 'active' : '')}> 1D </button>
          &nbsp;
          <button id="week" onClick={() => this.updateData('week')} className={(this.state.selection === 'week' ? 'active' : '')}> 1W </button>
          &nbsp;
          <button id="month" onClick={() => this.updateData('month')} className={(this.state.selection === 'month' ? 'active' : '')}> 1M </button>
          &nbsp;
          <button id="six_months" onClick={() => this.updateData('six_months')} className={(this.state.selection === 'six_months' ? 'active' : '')}>
            6M</button> &nbsp;
          <button id="year" onClick={() => this.updateData('year')} className={(this.state.selection === 'year' ? 'active' : '')}>
            1Y </button>&nbsp;
          <button id="ytd" onClick={() => this.updateData('ytd')} className={(this.state.selection === 'ytd' ? 'active' : '')}>
            YTD</button>&nbsp;
          <button id="all" onClick={() => this.updateData('all')} className={(this.state.selection === 'all' ? 'active' : '')}>
            ALL</button>
        </div>
        <div id="chart-timeline" style={{ backgroundImage: 'url("./assets/img/1.png")',
          backgroundSize: '90%',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center' }}>
          <ReactApexChart style={{ color: "black" }} options={this.state.options} series={this.state.series} type="area" height={550} />
        </div>
      </div>
    )
  }
}

export default ApexChart