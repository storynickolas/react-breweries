import './App.css';
import React, { useEffect, useState } from 'react';
import { Input, Text, Select, Button, Grid, Heading, Box, List, ListItem, GridItem, Center } from '@chakra-ui/react'
import { ChakraProvider } from '@chakra-ui/react'
import MapBox from './Components/Map';

function App() {
  const [city, setCity] = useState('')
  const [search, setSearch] = useState('')
  const [state, setState] = useState('')
  const [page, setPage] = useState(1)
  const [breweries, setBreweries] = useState([])
  const [location, setLocation] = useState([{latitude: 39.8283, 
    longitude: -98.5795}])
  // const [geo, setGeo] = useState([])

  let geo = []
    


  const position = [39.8283, -98.5795]
  // let defaultMap = [39.8283, -98.5795, 4]
  // resetMap(defaultMap[0], defaultMap[1], defaultMap[2])

  const states = ['Alabama','Alaska','Arizona','Arkansas','California','Colorado',
    'Connecticut','Delaware','District of Columbia','Florida','Georgia','Hawaii','Idaho',
    'Illinois','Indiana','Iowa','Kansas','Kentucky','Louisiana','Maine','Maryland','Massachusetts'
    ,'Michigan','Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada','New Hampshire'
    ,'New Jersey','New Mexico','New York','North Carolina','North Dakota','Ohio','Oklahoma','Oregon',
    'Pennsylvania','Rhode Island','South Carolina','South Dakota','Tennessee','Texas','Utah','Vermont',
    'Virginia','Washington','West Virginia','Wisconsin','Wyoming']

  function getBreweries() {
    if(breweries.length === 0) {
      fetch(`https://api.openbrewerydb.org/breweries`)
      .then((response) => response.json())
      .then((data) => {
        setBreweries(data)
      });
    }
    else
    {
      fetch(`https://api.openbrewerydb.org/breweries?by_city=${city}&by_state=${state}&per_page=7&page=${page}`)
      .then((response) => response.json())
      .then((data) => {
        setBreweries(data)
        addGeo(data)
      });
    }
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
    getBreweries()
  }, [city, page]);

  function handleSubmit(e) {
    e.preventDefault();
    let newCity = search
    setCity(newCity)
  }

  function handleChange(e) {
    e.preventDefault();
    let newCity = e.target.value
    setSearch(newCity)
  }

  function handleSelect(e) {
    e.preventDefault();
    let newState = e.target.value
    setState(newState)
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
        <form onSubmit={handleSubmit}>
          <Box display='flex' alignItems='center' gap="4" padding='4'>
            <Input type="text" bg='tomato' onChange={handleChange} size='lg' placeholder="City..." variant='outline'/>
            <Select size="lg" id="states" variant="outline" bg='tomato' onChange={handleSelect}>
              {
                states.map(abrev => {
                  return (
                    <option key={abrev} value={abrev}> {abrev} </option>
                )
              })
            }
            </Select>
            <Button variant='solid' size="lg" bg='tomato' onClick={handleSubmit}>Search</Button>
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
        {breweries[0] ?
  
            <Box bg='tomato' color='white' axis='both' w='100%'>
              <Text fontSize='2xl' href={breweries[0].website_url}>{breweries[0].name}</Text>
              <Text>{breweries[0].street}</Text>
              <Text>{breweries[0].city}, {breweries[0].state} {breweries[0].postal_code.substr(0, 5)}</Text>
          </Box>: '' }
          <Box display='relative' alignItems='center' gap="4" bg='grey'>
          <Button variant='solid' colorScheme='whiteAlpha' onClick={previous} className="button-1">Previous</Button>
          <Button variant='solid' colorScheme='whiteAlpha' onClick={next} className="button-1">Next</Button>
         
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
