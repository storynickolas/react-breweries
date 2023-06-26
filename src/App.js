import './App.css';
import React, { useEffect, useState } from 'react';
import { Input, Text, Select, Button, Grid, Heading, Box, List, ListItem, GridItem } from '@chakra-ui/react'
import { ChakraProvider } from '@chakra-ui/react'
import MapBox from './Components/Map';

function App() {
  const [city, setCity] = useState('')
  const [state, setState] = useState('Alabama')
  const [page, setPage] = useState(1)
  const [breweries, setBreweries] = useState([])
  const [missing, setMissing] = useState(true)
  const [location, setLocation] = useState([{latitude: 39.8283, longitude: -98.5795}])
  const [selected, setSelected] = useState({})
  const [start, setStart] = useState(true)
  const [more, setMore] = useState(false)

  let geo = []
    
  useEffect(() => {
    if(page === 1) {
      setStart(true)
    }
    else {
      setStart(false)
    }
  }, [page])

  useEffect(() => {
    let initCity = Math.floor(Math.random()*7)
    randomCity(initCity)
  }, [])


  const states = ['Alabama','Alaska','Arizona','Arkansas','California','Colorado',
    'Connecticut','Delaware','District of Columbia','Florida','Georgia','Hawaii','Idaho',
    'Illinois','Indiana','Iowa','Kansas','Kentucky','Louisiana','Maine','Maryland','Massachusetts'
    ,'Michigan','Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada','New Hampshire'
    ,'New Jersey','New Mexico','New York','North Carolina','North Dakota','Ohio','Oklahoma','Oregon',
    'Pennsylvania','Rhode Island','South Carolina','South Dakota','Tennessee','Texas','Utah','Vermont',
    'Virginia','Washington','West Virginia','Wisconsin','Wyoming']

  const cities = ['san_diego', 'portland', 'asheville', 'grand_rapids', 'boulder', 'jacksonville', 'houston']

  function getBreweries(e) {
    e.preventDefault()
    let chosenCity = city
    chosenCity = chosenCity.split(' ').join('_')
      fetch(`https://api.openbrewerydb.org/breweries?by_city=${chosenCity}&by_state=${state}&per_page=9&page=${page}`)
      .then((response) => response.json())
      .then((data) => {
        if(data.length !== 0){
          hanldeData(data)
        }
        else {
          setMissing(true)
          setMore(true)
        }
      });
  }
  
  function addGeo(data) {
    data.forEach((element) => {
      if (element.longitude) {
        geo.push({
          name: element.name, 
          latitude: element.latitude, 
          longitude: element.longitude,
          phone: element.phone,
          website: element.website_url,
          street: element.address_1,
          state: element.state,
          city: element.city
        })
      }
    })
    setLocation([...geo])
  }

  function hanldeData(data) {
    addGeo(data)
    setBreweries(data)
    setMore(true)
    setStart(true)
    setMissing(false)
    setSelected(data[0])
  }

  function randomCity(newCity) {
    fetch(`https://api.openbrewerydb.org/v1/breweries?by_city=${cities[newCity]}&per_page=7`)
      .then((response) => response.json())
      .then((data) => {
        hanldeData(data)
      });
  }


  function next() {
    let newpage = page + 1
    setPage(newpage)
  }

  function previous() {
    let newpage = page - 1
    setPage(newpage)
  }


  return (
    <ChakraProvider>
    <div className="App">
      <header className="App-header">
        <Heading size="4xl" >Brewery Locator</Heading>
        <form onSubmit={(e) => getBreweries(e)}>
          <Box display='flex' alignItems='center' gap="4" padding='4'>
            <Input type="text" bg='tomato' onChange={(e) => setCity(e.target.value)} size='lg' placeholder="City..." variant='outline'/>
            <Select size="lg" id="states" variant="outline" bg='tomato' onChange={(e) => setState(e.target.value)}>
              {
                states.map(abrev => {
                  return (
                    <option key={abrev} value={abrev}> {abrev} </option>
                )
              })
            }
            </Select>
            <Button width='100%' variant='solid' size="lg" bg='tomato' onClick={(e) => getBreweries(e)}>Search</Button>
            <Text>Or</Text>
            <Button width='100%' variant='solid' size="lg" bg='tomato' onClick={() => randomCity(Math.floor(Math.random()*7))}>Random City</Button>
          </Box>
        </form>
      </header>
      <Text color='white' fontSize={'3xl'}>{selected.city}, {selected.state}</Text>
      <Grid  templateColumns='repeat(5, 1fr)' templateRows='repeat(2, 1fr)' maxH='55vh'>
        <GridItem colSpan={4} padding={'20px'}  bg='#282c34' >
          <MapBox location={location} setSelected={setSelected} ></MapBox>
        </GridItem>
        <GridItem colSpan={1} bg='#282c34'>
          <Box h='20px'></Box>
          <Box position='relative' >
            {missing ? 
              <Box bg='tomato' color='white' axis='both' w='100%'>
              <Text fontSize='2xl' >Cannot Locate City Try Again</Text>
              </Box>
            :
              <Box bg='tomato' color='white' axis='both' w='100%'>
                <Text fontSize='2xl'>{selected.name}</Text>
                <Text>{selected.website}</Text>
                {selected.phone ? 
                <Text>{'(' + selected.phone.slice(0,3) + ') ' + selected.phone.slice(3,7) + '-' + selected.phone.slice(7)}</Text> : ''}
                <Text>{selected.street}</Text>
                <Text>{selected.city}, {selected.state} </Text>
              </Box>} 
            {missing ? '' :
              <Box display='relative' alignItems='center' gap="4" bg='grey'>
                <Button isDisabled={start} variant='solid' colorScheme='whiteAlpha' onClick={previous} className="button-1">Previous</Button>
                <Button isDisabled={more} variant='solid' colorScheme='whiteAlpha' onClick={next} className="button-1">Next</Button>
              </Box>}
            {missing ? '' :
              <List maxH={'50vh'} overflowY={'scroll'}>
                {breweries.map((item) => 
                  item.street === selected.street ?
                    <ListItem key={item.id + item.postal_code}  bg='grey' border='1px' color='white' borderColor='grey' >
                      <h2>{item.name}</h2>
                    </ListItem>
                  :
                    <ListItem key={item.id + item.postal_code}  bg='white' border='1px' color='black' borderColor='grey' onClick={() => setSelected(item)}>
                      <h2>{item.name}</h2>
                    </ListItem>
                )}
              </List>}
            </Box>   
          </GridItem>   
        </Grid>
      </div>
    </ChakraProvider>
  );
}

export default App;
