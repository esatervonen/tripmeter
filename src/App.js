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


  const [firstSpeedValue, setFirstSpeed] = useState(80)
  const [secondSpeedValue, setSecondSpeed] = useState(100)
  const [distanceValue, setDistance] = useState(0)
  const [carType, setCarType] = useState(null)
  const carTypes = [
    "AUTO A: N. 6L / 100KM",
    "AUTO B: N. 7.1L / 100KM",
    "AUTO C: N. 8.1L / 100KM"
  ]

  // 
  const handleSelect = (eventKey, e) => {
    setCarType(eventKey)
    e.preventDefault()
  }

  const getText = (e) => {
    setDistance(parseInt(e.target.value))
  }

  const [consumption, setConsumption] = useState(3)
  useEffect(() => {
    if ( carType != null ) {
      if (carType.includes('AUTO A')) {
        setConsumption(3)
      } else if (carType.includes('AUTO B')) {
        setConsumption(3.5)
      } else if (carType.includes('AUTO C')) {
        setConsumption(4)
      }  
    }
  },[carType])

  const [chartData, setData] = useState([])
  useEffect(() => {
    setData([
      {
        'name': firstSpeedValue + ' km/h',
        'Aika': (distanceValue / firstSpeedValue).toFixed(2),
        'Kulutus': (consumption * Math.pow(1.009,firstSpeedValue - 1) / 100 * distanceValue).toFixed(2)
      },
      {
        'name': secondSpeedValue + ' km/h',
        'Aika': (distanceValue / secondSpeedValue).toFixed(2),
        'Kulutus': (consumption * Math.pow(1.009,secondSpeedValue - 1) / 100 * distanceValue).toFixed(2)
      }
    ])
  },[firstSpeedValue, distanceValue, secondSpeedValue, consumption])

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
  },[chartData, firstSpeedValue, secondSpeedValue])

  return (
    <Card id='container'>
      <Card.Body>
        <Card.Header id='header' style={{position: 'relative', backgroundColor: '#9be5dc', fontWeight:'bold', color:'white'}}>
          AUTOILUMITTARI
          <OverlayTrigger 
          placement='left'
          overlay={
            <Tooltip>
              Vertaile matka-aikaa ja polttoaineen kulutusta kahden eri valitun nopeuden mukaan. 
              Valitse ensin autotyyppi, sitten ajettavan matkan pituus. Aseta kaksi erilaista keskinopeutta ajomatkalle ja vertaa tuloksia pylväsdiagrammista.
            </Tooltip>
          }>
          <InfoCircle color='white' style={{position:'absolute', top: 13, right: 10}}/>
          </OverlayTrigger>
        </Card.Header>
        <Dropdown style={{width: '100%', justifyContent:'center'}}>
          <OverlayTrigger
          placement='left'
          overlay={
            <Tooltip>
              Kulutus 80km/h nopeudessa
            </Tooltip>
          }>
          <InfoCircle color='white' style={{position:'absolute', top: 12, right: 10}}/>
          </OverlayTrigger>
             <Dropdown.Toggle style={{width: '100%'}}>{carType == null? 'Valitse autotyyppi' : carType}</Dropdown.Toggle>
            <Dropdown.Menu style={{width: '100%'}}>
              { carTypes.map(option => (
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
          <Card style={{backgroundColor:'#fafcff', height: 400}} className='my-1 p-1'  >
              <Barchart data={chartData} />
          </Card>
          <Card className='my-1 p-1' style={{backgroundColor:'#fafcff'}} >
            <Card.Title >Asetettu ajomatka</Card.Title>
            <InputGroup className="mb-3">
              <FormControl
                placeholder={distanceValue === 0 || isNaN(distanceValue) ? "Syötä kilometrit" : distanceValue}
                onChange={getText}
                value={distanceValue}
                type='number'
              />
              <InputGroup.Append>
                <InputGroup.Text>km</InputGroup.Text>
              </InputGroup.Append>
            </InputGroup> 
              <Card.Body>
              <RangeSlider
                value={distanceValue}
                onChange={e => setDistance(e.target.value)}
                step={1}
                max={1000}
                min={0}
                size='lg'
                />
              </Card.Body>
              </Card>
                {distanceValue > 0 ? <Card className='p-1' style={{backgroundColor:'#fafcff'}}>
                  <Card.Text>Säästät aikaa {Math.floor(differences[1])} h {((differences[1] - Math.floor(differences[1])) * 60).toFixed()} min ajamalla {differences[0]} km/h nopeammin.</Card.Text>
                  <Card.Text>Polttoainetta kuluu {differences[2].toFixed(2)} litraa enemmän suuremmalla nopeudella.</Card.Text>
                </Card> :
                <Card className='p-1' style={{backgroundColor:'#fafcff'}}>
                  <Card.Text>Aseta matkan pituus ja kokeile eri nopeuksia nähdäksesi matka-ajan ja kuluneen polttoaineen määrän viereisessä kuvaajassa. </Card.Text>
                </Card>
                }
              <Card style={{backgroundColor:'#fafcff'}} className='my-1 p-1'>
              <Card.Title >Asetetut ajonopeudet</Card.Title>
            <InputGroup className="mb-3">
              <FormControl
                placeholder={firstSpeedValue === 0 || isNaN(firstSpeedValue) ? "Syötä kilometrit" : firstSpeedValue}
                onChange={e => !isNaN(firstSpeedValue) ? setFirstSpeed(e.target.value) : setFirstSpeed(0)}
                value={firstSpeedValue}
                type='number'
              />
              <InputGroup.Append>
                <InputGroup.Text>km/h</InputGroup.Text>
              </InputGroup.Append>
            </InputGroup> 
            <Card.Body>
              <RangeSlider
                value={firstSpeedValue}
                onChange={e => setFirstSpeed(e.target.value)}
                step={1}
                max={200}
                min={0}
                size='lg'
                 />
              </Card.Body>
              <InputGroup className="mb-3">
              <FormControl
                placeholder={secondSpeedValue === 0 || isNaN(secondSpeedValue) ? "Syötä kilometrit" : secondSpeedValue}
                onChange={e => setSecondSpeed(e.target.value)}
                value={secondSpeedValue}
                type='number'
              />
              <InputGroup.Append>
                <InputGroup.Text>km/h</InputGroup.Text>
              </InputGroup.Append>
            </InputGroup>
              <Card.Body>
              <RangeSlider
                value={secondSpeedValue}
                onChange={e => setSecondSpeed(e.target.value)}
                step={1}
                max={200}
                min={0}
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
