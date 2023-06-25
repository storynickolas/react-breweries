import './App.css';
import React, { useEffect, useState } from 'react';
import { Input, Text, Select, Button, Grid, Heading, Box, List, ListItem, GridItem, Center } from '@chakra-ui/react'
import { ChakraProvider } from '@chakra-ui/react'
import MapBox from './Components/Map';

function App() {
  const [city, setCity] = useState('')
  const [state, setState] = useState('Alabama')
  const [page, setPage] = useState(1)
  const [breweries, setBreweries] = useState([])
  const [location, setLocation] = useState([{latitude: 39.8283, 
    longitude: -98.5795}])
  // const [geo, setGeo] = useState([])

  let geo = []

  
  const [start, setStart] = useState(true)
  const [more, setMore] = useState(false)

  const [rat, setRat] = useState(0)
    
useEffect(() => {
  if(page === 1) {
    setStart(true)
  }
  else {
    setStart(false)
  }
}, [page])


  const states = ['Alabama','Alaska','Arizona','Arkansas','California','Colorado',
    'Connecticut','Delaware','District of Columbia','Florida','Georgia','Hawaii','Idaho',
    'Illinois','Indiana','Iowa','Kansas','Kentucky','Louisiana','Maine','Maryland','Massachusetts'
    ,'Michigan','Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada','New Hampshire'
    ,'New Jersey','New Mexico','New York','North Carolina','North Dakota','Ohio','Oklahoma','Oregon',
    'Pennsylvania','Rhode Island','South Carolina','South Dakota','Tennessee','Texas','Utah','Vermont',
    'Virginia','Washington','West Virginia','Wisconsin','Wyoming']

  const cities = ['', 'san_diego', 'portland', 'asheville', 'grand_rapids', 'boulder', 'jacksonville', 'houston']

  function getBreweries(e) {
    e.preventDefault()
      fetch(`https://api.openbrewerydb.org/breweries?by_city=${city}&by_state=${state}&per_page=9&page=${page}`)
      .then((response) => response.json())
      .then((data) => {
        if(data.ok){
          setBreweries(data)
          addGeo(data)
          setMore(false)
        }
        else {

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
          longitude: element.longitude
        })
      }
    })
    setLocation([...geo])
  }

  useEffect(() => {
    if(rat === 0) {
      let cow = Math.floor(Math.random()*7 + 1)
      fetch(`https://api.openbrewerydb.org/v1/breweries?by_city=${cities[cow]}&per_page=3`)
      .then((response) => response.json())
      .then((data) => {
        console.log(data)
        addGeo(data)
        setBreweries(data)
        setMore(true)
        setStart(true)
      });

    }
    else {
    fetch(`https://api.openbrewerydb.org/v1/breweries?by_city=${cities[rat]}&per_page=3`)
      .then((response) => response.json())
      .then((data) => {
        console.log(data)
        addGeo(data)
        setBreweries(data)
        setMore(true)
        setStart(true)
      });}
  }, [rat])

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
            <Button variant='solid' size="lg" bg='tomato' onClick={(e) => getBreweries(e)}>Search</Button>
          </Box>
          
        </form>

      </header>
      <Grid  templateColumns='repeat(5, 1fr)' templateRows='repeat(2, 1fr)' maxH='80vh'>
        <GridItem colSpan={4} padding={'20px'}  bg='#282c34' >

      <MapBox location={location} ></MapBox>

      </GridItem>
      <GridItem colSpan={1} bg='#282c34'>
        <Box h='20px'></Box>
      <Box position='relative' >
      <Button variant='solid' size="lg" bg='tomato' onClick={() => setRat(Math.floor(Math.random()*7 + 1))}>Random City</Button>
        {breweries[0] ?
  
            <Box bg='tomato' color='white' axis='both' w='100%'>
              <Text fontSize='2xl' href={breweries[0].website_url}>{breweries[0].name}</Text>
              <Text>{breweries[0].street}</Text>
              <Text>{breweries[0].city}, {breweries[0].state} {breweries[0].postal_code.substr(0, 5)}</Text>
          </Box>: '' }
          <Box display='relative' alignItems='center' gap="4" bg='grey'>
          <Button isDisabled={start} variant='solid' colorScheme='whiteAlpha' onClick={previous} className="button-1">Previous</Button>
          <Button isDisabled={more} variant='solid' colorScheme='whiteAlpha' onClick={next} className="button-1">Next</Button>
         
          </Box>
  <List maxH={'60vh'} overflowY={'scroll'}>
        {breweries.map((item) => 
          <ListItem key={item.id}  bg='white' border='1px' color='black' borderColor='grey'>
            <h2>{item.name}</h2>
            {/* <div>
              <a href={item.website_url}>{item.name}</a>
              <p>{item.street}</p>
              <p>{item.city}, {item.state} {item.postal_code.substr(0, 5)}</p>
            </div> */}
          </ListItem>)}
          </List>
          </Box>
         
</GridItem>
         
</Grid>
    </div>
    </ChakraProvider>
  );
}

export default App;
