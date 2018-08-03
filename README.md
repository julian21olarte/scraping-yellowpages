# script scraping for yellowpages

## Installation ##

### Usage ###

* install dependencies

```
npm install
```

* run the script
  
```
npm start
```

### Variables ###

You can set SEARCH_TERM variable for change the specific term to search in yellowpages.com.

```js
const SEARCH_TERM = 'javascript';
```


You can set PLACES variable array for change the cities when the specific term will be search.
```js
let PLACES = ['Boston', 'Cambridge', 'Quincy', 'Newton', 'Somerville', 'Waltham', 'Malden', 'Brookline', 'Medford', 'Wellesley', 'Melrose', 'Lexington', 'Newburyport', 'Hingham', 'Dedham', 'Norwood', 'Arlington', 'Weston', 'Stoneham', 'Saugus', 'Salem', 'Marblehead', 'Amesbury', 'Andover', 'Belmont', 'Beverly', 'Burlington', 'Concord', 'Danvers', 'Cape Cod', 'Manchester', 'Nantucket', 'Natick', 'Winchester'];
```


You can set area variable for change the area when the specific term will be search.
for example, in this case, the term will be sear in "BOSTON AREA Boston", "BOSTON AREA Cambridge", "BOSTON AREA Quincy", etc...
```js
const area = 'BOSTON AREA ';
```