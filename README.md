# Brewery Locator

![Sample Page](https://github.com/storynickolas/react-breweries/blob/main/src/Launch%20Page.png)

This app uses the [Open Brewery DB](https://www.openbrewerydb.org/) api to provide the user a list of available breweries based on either a random (default) or named American city. A map of the current city was created using [LeafletJs](https://leafletjs.com/examples/geojson/).  This map shows pins of the returned breweries for the searched city.  The currently selected brewery will appear at the top of the list with the orange background.  Selecting a brewery from the list will give you additional information including: address, phone number and a link to the breweries website.  Next/previous buttons are used to navigate the list when a city has more than 9 breweries.

This project was updated using React but was originally created in JavaScript.  Original project can be found here: https://github.com/storynickolas/Brewery-Search 

## How To Search

1.  Fill in the first form box with the name of the city you are searching for:
  * Include:
    - Spaces
    - Capitalization optional

  * Leave Out:
    - Special characters including hyphenation
    - numbers

2. Select state or District of Columbia from drop down
3. Hit the search button or press enter on your keyboard

## Additional Resources

This project uses the Leaflet Javascript library to add mapping features.  For more information on Leaflet see their quick start guide here:

https://leafletjs.com/examples/quick-start/

Leaflet uses OpenStreetMap map images files as the default for their maps.  For more information on the OpenStreetMap see their about page:

https://www.openstreetmap.org/about

Brewery data is provided using the Open Brewery DB api.  For more information on Open Brewery DB api see their quick start guide here:

https://www.openbrewerydb.org/documentation
