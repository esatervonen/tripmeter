import { Card, CardColumns, FormControl, Tooltip, OverlayTrigger, Dropdown, InputGroup } from 'react-bootstrap'
import React, { useEffect, useState } from 'react'
import "bootstrap/dist/css/bootstrap.css"
import "bootstrap-slider/dist/css/bootstrap-slider.css"
import 'react-bootstrap-range-slider/dist/react-bootstrap-range-slider.css';
import Barchart from './Barchart'
import { InfoCircle } from 'react-bootstrap-icons'
import RangeSlider from 'react-bootstrap-range-slider'
import './styles.css'

const App = () => {

  // State variables for parameters set by user : speed values, distance and car type
  const [firstSpeedValue, setFirstSpeed] = useState(80)
  const [secondSpeedValue, setSecondSpeed] = useState(100)
  const [distanceValue, setDistance] = useState("")
  const [carType, setCarType] = useState("AUTO A: N. 6L / 100KM")
  const carTypes = [
    "AUTO A: N. 6L / 100KM",
    "AUTO B: N. 7.1L / 100KM",
    "AUTO C: N. 8.1L / 100KM"
  ]

  // useEffect hook for controlling negative input values
  useEffect(() => {
    if (firstSpeedValue < 0) {
      setFirstSpeed(0)
    } else if (firstSpeedValue > 200) {
      setFirstSpeed(200)
    }
    if (secondSpeedValue < 0) {
      setSecondSpeed(0)
    } else if (secondSpeedValue > 200) {
      setSecondSpeed(200)
    }
    if (distanceValue < 0) {
      setDistance(0)
    } else if (distanceValue > 1000) {
      setDistance(1000)
    }
  }, [firstSpeedValue, secondSpeedValue, distanceValue])

  // State variable and useEffect hook for setting fuel consumption according to selected car type
  const [consumption, setConsumption] = useState(0)
  useEffect(() => {
    if (carType != null) {
      if (carType.includes('AUTO A')) {
        setConsumption(3)
      } else if (carType.includes('AUTO B')) {
        setConsumption(3.5)
      } else if (carType.includes('AUTO C')) {
        setConsumption(4)
      }
    }
  }, [carType])

  // State variable and useEffect hook for setting data for the bar chart. Data also used for calculating differences
  const [chartData, setData] = useState([])
  useEffect(() => {
    if (carType != null) {
      setData([
        {
          'name': firstSpeedValue + ' km/h',
          'Aika': (distanceValue / firstSpeedValue).toFixed(2),
          'Kulutus': (consumption * Math.pow(1.009, firstSpeedValue - 1) / 100 * distanceValue).toFixed(1)
        },
        {
          'name': secondSpeedValue + ' km/h',
          'Aika': (distanceValue / secondSpeedValue).toFixed(2),
          'Kulutus': (consumption * Math.pow(1.009, secondSpeedValue - 1) / 100 * distanceValue).toFixed(1)
        }
      ])
    }
  }, [firstSpeedValue, distanceValue, secondSpeedValue, consumption, carType])

  // State variable and useEffect hook for setting the information on the differences in speed, time and consumption between selected speed values.
  const [differences, setDifferences] = useState([])
  useEffect(() => {
    let tmpArr = []
    if (chartData.length > 0) {
      tmpArr = [
        Math.abs(firstSpeedValue - secondSpeedValue),
        Math.abs(chartData[0].Aika - chartData[1].Aika),
        Math.abs(chartData[0].Kulutus - chartData[1].Kulutus)
      ]
    }
    setDifferences(tmpArr)
  }, [chartData, firstSpeedValue, secondSpeedValue])

  // Render time value into hours and minutes
  const renderTime = (value) => {
    return Math.floor(value) + "h " + ((value - Math.floor(value)) * 60).toFixed() + "min"
  }

  // Change decimal separator from point to comma
  const decimalPoint = (value) => {
    return Math.floor(value) + "," + ((value - Math.floor(value)) * 10).toFixed()
  }

  return (
    <Card style={{ margin: '3%', backgroundColor: '#f7f7f7' }}>
      <Card.Body>
        <Card.Header className='shadow' style={{ position: 'relative', backgroundColor: '#82cddd', fontWeight: 'bold', color: 'white' }}>
          AUTOILUMITTARI
          <OverlayTrigger
            placement='left'
            overlay=
            {
              <Tooltip>
                Vertaile matka-aikaa ja polttoaineen kulutusta kahden eri valitun nopeuden mukaan.
                Valitse ensin autotyyppi kulutuksen mukaan, sitten ajettavan matkan pituus. Aseta kaksi erilaista keskinopeutta ajomatkalle ja vertaa tuloksia pylväsdiagrammista.
              </Tooltip>
            }>
            <InfoCircle color='white' style={{ position: 'absolute', top: 13, right: 10 }} />
          </OverlayTrigger>
        </Card.Header>
        <Dropdown className='shadow' style={{ width: '100%', justifyContent: 'center' }}>
          <OverlayTrigger
            placement='left'
            overlay=
            {
              <Tooltip>Kulutus 80km/h nopeudessa</Tooltip>
            }>
            <InfoCircle color='white' style={{ position: 'absolute', top: 12, right: 10 }} />
          </OverlayTrigger>
          <Dropdown.Toggle style={{ width: '100%' }}>{carType == null ? 'Valitse autotyyppi' : carType}</Dropdown.Toggle>
          <Dropdown.Menu className='shadow' style={{ width: '100%' }}>
            {
              carTypes.map(option => (
                <Dropdown.Item
                  eventKey={option}
                  key={option}
                  onSelect={eventKey => setCarType(eventKey)}>
                  {option}
                </Dropdown.Item>
              ))
            }
          </Dropdown.Menu>
        </Dropdown>
        <CardColumns >
          <Card style={{ backgroundColor: '#fafcff', height: 475 }} className='my-2 p-1'  >
            <Barchart data={chartData} />
          </Card>
          {
            distanceValue > 0 && carType != null && isFinite(differences[1]) ? <Card className='p-3 my-2' style={{ backgroundColor: '#fafcff', height: 280 }}>
              <Card.Text>Nopeudella <b>{firstSpeedValue} km/h</b> aikaa kuluu <b>{renderTime(chartData[0].Aika)}</b> ja polttoainetta kuluu <b>{decimalPoint(chartData[0].Kulutus)} litraa</b>.</Card.Text>
              <Card.Text>Nopeudella <b>{secondSpeedValue} km/h</b> aikaa kuluu <b>{renderTime(chartData[1].Aika)}</b> ja polttoainetta kuluu <b>{decimalPoint(chartData[1].Kulutus)} litraa</b>.</Card.Text>
              <Card.Text>Säästät siis aikaa <b>{Math.floor(differences[1])} h {((differences[1] - Math.floor(differences[1])) * 60).toFixed()} min</b> ajamalla <b>{differences[0]} km/h</b> nopeammin, ja
              polttoainetta kuluu <b>{Math.floor(differences[2])},{((differences[2] - Math.floor(differences[2])) * 10).toFixed()} litraa</b> enemmän.</Card.Text>
            </Card> :
              <Card className='p-3 my-2' style={{ backgroundColor: '#fafcff', height: 180 }}>
                <Card.Text>Valitse autotyyppi kulutuksen mukaan pudotusvalikosta ja aseta matkan pituus. Kokeile eri nopeuksia nähdäksesi matka-ajan ja kuluneen polttoaineen määrän viereisessä kuvaajassa. </Card.Text>
              </Card>
          }
          <Card className='my-2 p-2' style={{ backgroundColor: '#fafcff' }} >
            <Card.Title >Syötä ajomatka</Card.Title>
            <InputGroup>
              <FormControl
                placeholder={distanceValue <= 0 || isNaN(distanceValue) ? "Syötä kilometrit" : distanceValue}
                onChange={e => setDistance(e.target.value)}
                value={distanceValue}
                type='number'
                min={1}
              />
              <InputGroup.Append>
                <InputGroup.Text style={{backgroundColor: '#fafcff'}}>km</InputGroup.Text>
              </InputGroup.Append>
            </InputGroup>
            <Card.Body>
              <RangeSlider
                value={distanceValue}
                onChange={e => setDistance(e.target.value)}
                step={1}
                max={1000}
                min={1}
                size='lg'
              />
            </Card.Body>
          </Card>
          <Card style={{ backgroundColor: '#fafcff' }} className='my-2 p-2'>
            <Card.Title >Syötä kaksi ajonopeutta</Card.Title>
            <InputGroup>
              <FormControl
                placeholder={firstSpeedValue <= 0 || isNaN(firstSpeedValue) ? "Syötä ajonopeus" : firstSpeedValue}
                onChange={e => !isNaN(firstSpeedValue) ? setFirstSpeed(e.target.value) : setFirstSpeed(0)}
                value={firstSpeedValue}
                type='number'
                min={1}
              />
              <InputGroup.Append>
                <InputGroup.Text style={{backgroundColor: '#fafcff'}}>km/h</InputGroup.Text>
              </InputGroup.Append>
            </InputGroup>
            <Card.Body>
              <RangeSlider
                value={firstSpeedValue}
                onChange={e => setFirstSpeed(e.target.value)}
                step={1}
                max={200}
                min={1}
                size='lg'
              />
            </Card.Body>
            <InputGroup>
              <FormControl
                placeholder={secondSpeedValue <= 0 || isNaN(secondSpeedValue) ? "Syötä ajonopeus" : secondSpeedValue}
                onChange={e => setSecondSpeed(e.target.value)}
                value={secondSpeedValue}
                type='number'
                min={1}
              />
              <InputGroup.Append>
                <InputGroup.Text style={{backgroundColor: '#fafcff'}}>km/h</InputGroup.Text>
              </InputGroup.Append>
            </InputGroup>
            <Card.Body>
              <RangeSlider
                value={secondSpeedValue}
                onChange={e => setSecondSpeed(e.target.value)}
                step={1}
                max={200}
                min={1}
                size='lg'
              />
            </Card.Body>
          </Card>
        </CardColumns>
      </Card.Body>
    </Card>
  )
}

export default App
