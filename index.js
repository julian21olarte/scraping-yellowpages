// dependencies
const cheerio = require('cheerio');
const request = require('request-promise');
const fs = require('fs');
const Json2csvParser = require('json2csv').Parser;


const area = 'BOSTON AREA '; // specific area to search in yellowpages
const fieldsCSV = ['city', 'name', 'street_address', 'locality', 'address_region', 'postal_code', 'phone', 'website'];
let PLACES = ['Boston', 'Cambridge', 'Quincy', 'Newton', 'Somerville', 'Waltham', 'Malden', 'Brookline', 'Medford', 'Wellesley', 'Melrose', 'Lexington', 'Newburyport', 'Hingham', 'Dedham', 'Norwood', 'Arlington', 'Weston', 'Stoneham', 'Saugus', 'Salem', 'Marblehead', 'Amesbury', 'Andover', 'Belmont', 'Beverly', 'Burlington', 'Concord', 'Danvers', 'Cape Cod', 'Manchester', 'Nantucket', 'Natick', 'Winchester'];

const URL = 'https://www.yellowpages.com/search'; // basic yellowpages url

const SEARCH_TERM = 'javascript'; // term for search in yellowpages, this is the variable that you must change.

// other variables
let result = [];
let $ = {};



// entry point
Promise.all(PLACES.map(async (placeInit) => {
  place = (area + placeInit).split(' ').join('+');  // new york city ===> new+york+city .... for append to url search
  url = `${URL}?search_terms=${SEARCH_TERM}&geo_location_terms=${place}`;
  const data = await getData(url, placeInit);
  result.push(...data);
}))
.then(res => {
  fs.writeFile('scraping_yellowpages.json', JSON.stringify(result), () => {
    console.log('json file was created!');
  });
})
.then(res2 => {
  const json2csvParser = new Json2csvParser({ fieldsCSV });
  const csv = json2csvParser.parse(result);
  fs.writeFile('scraping_yellowpages.csv', csv, 'utf8', () => {
    console.log('csv file was created!');
    process.exit();
  });
}).catch(error => console.log(error));





// get total pages for searches
async function getPages(url) {
  return request(url)
    .then(content => {
      const $ = cheerio.load(content);

      const pagination = Number($('.pagination > p')
        .html()
        .split('<span>We found</span>')[1]
        .split('<span>results</span>')[0]);
        
      const pages = Math.ceil(pagination / 30);
      return pages;
    });
}




// get data from html DOM loaded by http requests
async function getData(url, city) {
  const pages = await getPages(url);
  let page = 1;
  let responseArray = [];
  while(page <= pages) {
    console.log(url + '&page=' + page);
    await request(url + '&page=' + page)
    .then(content => {
      const $ = cheerio.load(content);
        $('.search-results.organic .result').each(function(index, element) {
          const address_region = $(element).find('span[itemprop="addressRegion"]').text() || null;
          if(address_region && address_region === 'MA') {
            responseArray.push({
              city: city,
              name: $(element).find('a.business-name span').text() || null,
              street_address: $(element).find('span.street-address').text() || null,
              locality: $(element).find('span.locality').text().trim().replace(',',"") || null,
              address_region: address_region,
              postal_code: $(element).find('span[itemprop="postalCode"]').text() || null,
              phone: $(element).find('.phones.phone.primary').text() || null,
              website: $(element).find('a.track-visit-website').attr('href') || null,
            });
          }
        });
      }).catch(error => console.log(error));
      page++;
    }
    return responseArray;
};