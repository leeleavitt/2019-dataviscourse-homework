/** Data structure for the data associated with an individual country. */
class InfoBoxData {
    /**
     *
     * @param country name of the active country
     * @param region region of the active country
     * @param indicator_name the label name from the data category
     * @param value the number value from the active year
     */
    constructor(country, region, indicator_name, value) {
        this.country = country;
        this.region = region;
        this.indicator_name = indicator_name;
        this.value = value;
    }
}

/** Class representing the highlighting and selection interactivity. */
class InfoBox {
    /**
     * Creates a InfoBox Object
     * @param data the full data array
     */
    constructor(data) {
        this.data = data;
    }



    drawUpdateText(){
        d3.select("#country-detail")
            .append('div')
            .attr('id','firstDiv')
            .append('i')
            .attr('class', 'fas fa-globe-americas')
            .attr('id','littleGlobe')
            .append('text')
            .attr('id','labelText')

    }
    /**
     * Renders the country description
     * @param activeCountry the IDs for the active country
     * @param activeYear the year to render the data for
     */
    updateTextDescription(activeCountry, activeYear) {
        this.clearHighlight()
        //this.drawUpdateText()

            console.log(this.data)
            console.log(activeCountry);
            console.log(activeYear);

        if(activeCountry !== null){

            console.log('hi')

            var indicators = ['child-mortality', 'fertility-rate', 'gdp', 'life-expectancy', 'population']
            var totalInfoData = []
            for(var i=0; i < indicators.length; i++){
                totalInfoData[i] = new InfoBoxData;
                totalInfoData[i].country = this.data[indicators[1]].find(d=>d.geo===activeCountry).country;
                var regionLogic = this.data.population.filter(d=> d.geo === activeCountry)[0]
                totalInfoData[i].region = (regionLogic === undefined) ? null : regionLogic.region ;
                totalInfoData[i].indicator_name = indicators[i].toString()
                totalInfoData[i].value = this.data[ indicators[i] ].find(d=> d.geo === activeCountry)[activeYear]
            }

            d3.select('#country-detail')
                .append('div')
                .classed('label', true)
                .append('i')
                .classed('fas fa-globe-americas', true)
                .classed(totalInfoData[0].region, true)
                
            d3.select('#country-detail').select('div')
                .classed('label', true)
                .append('span')
                .text(totalInfoData[0].country)
            
            var countryDetail = d3.select('#country-detail').selectAll('div')
                .data(totalInfoData)
                .enter()
                .append('div')
                //.classed('label', true)
                //.exit().remove()

            //countryDetail.exit().remove()
            
            //countryDetail = countryDetail.merge(countryDetailEnter)
            
            countryDetail
                .text(d=> d.indicator_name+": ")
                .append('span')
                .classed('stats', true)
                .text(d=>d.value)
        }


        // ******* TODO: PART 4 *******
        // Update the text elements in the infoBox to reflect:
        // Selected country, region, population and stats associated with the country.
        /*
         * You will need to get an array of the values for each category in your data object
         * hint: you can do this by using Object.values(this.data)
         * you will then need to filter just the activeCountry data from each array
         * you will then pass the data as paramters to make an InfoBoxData object for each category
         *
         */

        //TODO - Your code goes here - 


    }

    /**
     * Removes or makes invisible the info box
     */
    clearHighlight() {
        d3.select('#country-detail').selectAll('div').remove()
        //TODO - Your code goes here - 
    }

}