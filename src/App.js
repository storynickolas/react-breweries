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
  const [missing, setMissing] = useState(true)
  const [location, setLocation] = useState([{latitude: 39.8283, 
    longitude: -98.5795}])
  // const [geo, setGeo] = useState([])

  const [selected, setSelected] = useState({})

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
    console.log(state)
    console.log(city)
    let fish = city
    fish = fish.split(' ').join('_')
    console.log(fish)
      fetch(`https://api.openbrewerydb.org/breweries?by_city=${fish}&by_state=${state}&per_page=9&page=${page}`)
      .then((response) => response.json())
      .then((data) => {
        if(data.length !== 0){
          console.log(data)
          setMissing(false)
          setBreweries(data)
          addGeo(data)
          setMore(false)
          setSelected(data[0])
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
        setMissing(false)
        setSelected(data[0])
      });

    }
    else {
    fetch(`https://api.openbrewerydb.org/v1/breweries?by_city=${cities[rat]}&per_page=3`)
      .then((response) => response.json())
      .then((data) => {
        console.log(data)
        addGeo(data)
        setBreweries(data)
        setMissing(false)
        setMore(true)
        setStart(true)
        setSelected(data[0])
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
        <button onClick={() => console.log(selected)}>Click Me</button>
        <form onSubmit={(e) => getBreweries(e)}>
          <Box display='flex' alignItems='center' gap="4" padding='4'>
            {/* <Button onClick={() => console.log(missing)}>Testing</Button> */}
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
            <Button width='100%' variant='solid' size="lg" bg='tomato' onClick={() => setRat(Math.floor(Math.random()*7 + 1))}>Random City</Button>
          
          </Box>
          
        </form>

      </header>
      <Text fontSize={'3xl'}>{selected.city}, {selected.state}</Text>
      <Grid  templateColumns='repeat(5, 1fr)' templateRows='repeat(2, 1fr)' maxH='60vh'>

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
          <ListItem key={item.id}  bg='white' border='1px' color='black' borderColor='grey'>
            <h2>{item.name}</h2>
          </ListItem>)}
          </List>}
          </Box>
         
</GridItem>
         
</Grid>
    </div>
    </ChakraProvider>
  );
}

export default App;
