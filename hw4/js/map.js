/**
 * Data structure for the data associated with an individual country.
 * the CountryData class will be used to keep the data for drawing your map.
 * You will use the region to assign a class to color the map!
 */
class CountryData {
    /**
     *
     * @param type refers to the geoJSON type- countries are considered features
     * @param properties contains the value mappings for the data
     * @param geometry contains array of coordinates to draw the country paths
     * @param region the country region
     */
    constructor(type, id, properties, geometry, region) {

        this.type = type;
        this.id = id;
        this.properties = properties;
        this.geometry = geometry;
        this.region = region;
    }
}

/** Class representing the map view. */
class Map {

    /**
     * Creates a Map Object
     *
     * @param data the full dataset
     * @param updateCountry a callback function used to notify other parts of the program when the selected
     * country was updated (clicked)
     */
    constructor(data, updateCountry) {
        // ******* TODO: PART I *******
        this.projection = d3.geoWinkel3().scale(140).translate([365, 225]);
        this.nameArray = data.population.map(d => d.geo.toUpperCase());
        this.populationData = data.population;
        this.updateCountry = updateCountry;
    }

    /**
     * Renders the map
     * @param world the topojson data with the shape of all countries and a string for the activeYear
     */
    drawMap(world) {
        //note that projection is global!
        //world is a topojson file. you will have to convert this to geojson (hint: you should have learned this in class!)
        let geoJson = topojson.feature(world, world.objects.countries);
        
        //console.log(geoJson.features);
        //console.log(this.populationData);
        //console.log(this.nameArray);
        
        let countryData = geoJson.features.map(country => {

            let index = this.nameArray.indexOf(country.id);
            let region = 'countries';

            if (index > -1) {
                //  console.log(this.populationData[index].geo, country.id);
                region = this.populationData[index].region;
                return new CountryData(country.type, country.id, country.properties, country.geometry, region);
            } else {;
                return new CountryData(country.type, country.id, country.properties, country.geometry, region);
            }
        });

        this.countryData = countryData;

        // ******* TODO: PART I *******
        // Draw the background (country outlines; hint: use #map-chart)
        // Make sure to add a graticule (gridlines) and an outline to the map
        let mapChart = d3.select("#map-chart");
        mapChart.append('svg').attr('width',750).attr('height', 450);
        let mapChartsvg = d3.select('svg')
        let width = parseInt(mapChartsvg.attr('width'));
        let height =  parseInt(mapChartsvg.attr('height'));

        let projection = d3.geoWinkel3()
            .translate([width/2, height/2])
            .scale([140]);
        
        let path = d3.geoPath()
            .projection(this.projection);
        
        console.log(countryData)
        mapChartsvg
            .selectAll('path')
            .data(countryData)
            .enter()
            .append("path")
            .attr('d', path)
            //.attr('id', d => d.id)
            .attr('class', d => 'countries boundary '+ d.region+" "+d.id.toLowerCase())
            .on('click', d => this.updateHighlightClick(d.id));
        mapChartsvg
            .selectAll('path')
            .data(countryData)
            .enter()

        let graticule = d3.geoGraticule();
        mapChartsvg
            .append('path')
            .datum(graticule)
            .attr('class', 'graticule ')
            .attr('d',path)
            .attr('fill','none');
        
        mapChartsvg.append("path")
            .datum(graticule.outline)
            .attr('class', 'stroke')
            .attr("d", path);  

        // Hint: assign an id to each country path to make it easier to select afterwards
        // we suggest you use the variable in the data element's id field to set the id

        // Make sure and give your paths the appropriate class (see the .css selectors at
        // the top of the provided html file)

        // You need to match the country with the region. This can be done using .map()
        // We have provided a class structure for the data called CountryData that you should assign the paramters to in your mapping

        //TODO - Your code goes here - 

    }

    /**
     * Highlights the selected conutry and region on mouse click
     * @param activeCountry the country ID of the country to be rendered as selected/highlighted
     */
    updateHighlightClick(activeCountry) {
        this.updateCountry(activeCountry.toLowerCase())
        d3.selectAll('.select-selected')
            .classed('select-selected',false)
        d3.selectAll('.selected-country')
            .classed('selected-country',false)
        var found = this.countryData.find(d => d.id === activeCountry.toUpperCase())
        //console.log("selected country: "+activeCountry)
        //console.log("region: "+found.region)
        
        d3.select('map-chart')
            .classed('select-selected',false)
        //d3.selectAll("."+found.region)
        //  .classed("selected-country", true);
        d3.select('.wrapper-group')
            .selectAll('circle')
            .classed('hidden', true);
        d3.selectAll("."+activeCountry.toLowerCase())
            .classed('hidden',false)
            .classed('selected-country', true)
            .classed('select-selected', true);
        d3.selectAll('.'+found.region)
            .classed('hidden',false);

        //this.clearHighlight()

            // ******* TODO: PART 3*******
        // Assign selected class to the target country and corresponding region
        // Hint: If you followed our suggestion of using classes to style
        // the colors and markers for countries/regions, you can use
        // d3 selection and .classed to set these classes on here.
        //

        //TODO - Your code goes here - 

    }

    /**
     * Clears all highlights
     */
    clearHighlight() {
        d3.selectAll('.select-selected')
            .classed('select-selected',false)
        d3.selectAll('.selected-country')
            .classed('selected-country',false)

        // ******* TODO: PART 3*******
        // Clear the map of any colors/markers; You can do this with inline styling or by
        // defining a class style in styles.css

        // Hint: If you followed our suggestion of using classes to style
        // the colors and markers for hosts/teams/winners, you can use
        // d3 selection and .classed to set these classes off here.

        //TODO - Your code goes here - 


    }
}