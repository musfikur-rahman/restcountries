window.onresize = function () {
    windowSize();
}

document.onreadystatechange = function () {
    windowSize();
    RestCountriesByFetch();
}

async function RestCountriesByFetch() {
    let response = await fetch('https://restcountries.com/v2/all');
    try {
        let data = await response.text();
        let obj = JSON.parse(data);
        var textSet = '';
        textSet += '<tr>';
        textSet += '<th><b>Name</b></th>';
        textSet += '<th><b>Top Level Domain</b></th>';
        textSet += '<th><b>Alpha 2 Code</b></th>';
        textSet += '<th><b>Calling Codes</b></th>';
        textSet += '<th><b>Capital</b></th>';
        textSet += '<th><b>Alt Spellings</b></th>';
        textSet += '<th><b>Region</b></th>';
        textSet += '<th><b>Subregion</b></th>';
        textSet += '<th><b>Population</b></th>';
        textSet += '<th><b>Latlng</b></th>';
        textSet += '<th><b>Demonym</b></th>';
        textSet += '<th><b>Area</b></th>';
        textSet += '<th><b>Gini</b></th>';
        textSet += '<th><b>Timezones</b></th>';
        textSet += '<th><b>Borders</b></th>';
        textSet += '<th><b>Native Name</b></th>';
        textSet += '<th><b>Numeric Code</b></th>';
        textSet += '<th><b>Currencies</b></th>';
        textSet += '<th><b>Languages</b></th>';
        textSet += '<th><b>Translations</b></th>';
        textSet += '<th><b>Regional Blocs</b></th>';
        textSet += '<th><b>Cioc</b></th>';
        textSet += '<th><b>Flag</b></th>';
        textSet += '</tr>';
        for (i = 0; i < obj.length; i++) {
            textSet += '<tr>';
            textSet += '<td>' + obj[i].name + '</td>';
            textSet += '<td>' + obj[i].topLevelDomain + '</td>';
            textSet += '<td>' + obj[i].alpha2Code + '</td>';
            textSet += '<td>' + obj[i].alpha3Code + '</td>';
            textSet += '<td>' + obj[i].callingCodes + '</td>';
            textSet += '<td>' + obj[i].capital + '</td>';
            textSet += '<td>' + obj[i].altSpellings + '</td>';
            textSet += '<td>' + obj[i].region + '</td>';
            textSet += '<td>' + obj[i].subregion + '</td>';
            textSet += '<td>' + obj[i].population + '</td>';
            textSet += '<td>' + obj[i].latlng + '</td>';
            textSet += '<td>' + obj[i].demonym + '</td>';
            textSet += '<td>' + obj[i].area + '</td>';
            textSet += '<td>' + obj[i].gini + '</td>';
            textSet += '<td>' + obj[i].timezones + '</td>';
            textSet += '<td>' + obj[i].borders + '</td>';
            textSet += '<td>' + obj[i].nativeName + '</td>';
            textSet += '<td>' + obj[i].numericCode + '</td>';
            textSet += '<td>' + obj[i].currencies + '</td>';
            textSet += '<td>' + obj[i].languages + '</td>';
            textSet += '<td>' + obj[i].translations + '</td>';
            textSet += '<td>' + obj[i].regionalBlocs + '</td>';
            textSet += '<td>' + obj[i].cioc + '</td>';
            textSet += '<td><img src=' + obj[i].flag + ' class="w3-image" ></td>';
            textSet += '</tr>';
        }
        document.getElementById('tableData').innerHTML = textSet;
    }
    catch (error) {
        alert(error.message);
    }
}

async function windowSize() {
    document.getElementById('screen').style.height = (window.innerHeight - 75) + 'px';
    document.getElementById('screen').style.overflow = scroll;
}
