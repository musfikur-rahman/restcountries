document.onreadystatechange = function () {
    RestCountriesByFetch();
}

document.getElementById('countryName').onchange = function () {
    ClearAllField();
    RestSingleCountriesByFetch();
}

async function RestCountriesByFetch() {
    let response = await fetch('https://restcountries.com/v3.1/all');
    try {
        let data = await response.text();
        let demoData = JSON.parse(data);
        var txt = '';
        txt += '<option value="">-------Select-------</option>';
        let obj = Array.from(demoData);
        console.log(obj);
        for (i = 0; i < obj.length; i++) {
            txt += '<option value=' + obj[i].alpha2Code + '>' + obj[i].name + '</option>';
        }
        document.getElementById('countryName').innerHTML = txt;
    }
    catch (error) {
        alert(error.message);
    }
}

async function RestSingleCountriesByFetch() {
    var requestData = document.getElementById('countryName').value;
    if (requestData == '') {
        alert('Please select a country');
    }
    else {
        let response = await fetch('https://restcountries.com/v2/alpha/' + requestData);

        try {
            let responseData = await response.text();
            let obj = JSON.parse(responseData);
            if (Object.hasOwn(obj, 'name') == true) { document.getElementById('name').value = obj.name; } else { document.getElementById('name').value = ''; }
            if (Object.hasOwn(obj, 'topLevelDomain') == true) { document.getElementById('topLevelDomain').value = obj.topLevelDomain; } else { document.getElementById('topLevelDomain').value = ''; }
            if (Object.hasOwn(obj, 'alpha2Code') == true) { document.getElementById('alpha2Code').value = obj.alpha2Code; } else { document.getElementById('alpha2Code').value = ''; }
            if (Object.hasOwn(obj, 'alpha3Code') == true) { document.getElementById('alpha3Code').value = obj.alpha3Code; } else { document.getElementById('alpha3Code').value = ''; }
            if (Object.hasOwn(obj, 'callingCodes') == true) { document.getElementById('callingCodes').value = obj.callingCodes; } else { document.getElementById('callingCodes').value = ''; }
            if (Object.hasOwn(obj, 'capital') == true) { document.getElementById('capital').value = obj.capital; } else { document.getElementById('capital').value = ''; }
            if (Object.hasOwn(obj, 'altSpellings') == true) { document.getElementById('altSpellings').value = obj.altSpellings; } else { document.getElementById('altSpellings').value = ''; }
            if (Object.hasOwn(obj, 'region') == true) { document.getElementById('region').value = obj.region; } else { document.getElementById('region').value = ''; }
            if (Object.hasOwn(obj, 'subregion') == true) { document.getElementById('subregion').value = obj.subregion; } else { document.getElementById('subregion').value = ''; }
            if (Object.hasOwn(obj, 'population') == true) { document.getElementById('population').value = obj.population; } else { document.getElementById('population').value = ''; }
            if (Object.hasOwn(obj, 'latlng') == true) { document.getElementById('latlng').value = obj.latlng; } else { document.getElementById('latlng').value = ''; }
            if (Object.hasOwn(obj, 'demonym') == true) { document.getElementById('demonym').value = obj.demonym; } else { document.getElementById('demonym').value = ''; }
            if (Object.hasOwn(obj, 'area') == true) { document.getElementById('area').value = obj.area; } else { document.getElementById('area').value = ''; }
            if (Object.hasOwn(obj, 'gini') == true) { document.getElementById('gini').value = obj.gini; } else { document.getElementById('gini').value = ''; }
            if (Object.hasOwn(obj, 'timezones') == true) { document.getElementById('timezones').value = obj.timezones; } else { document.getElementById('timezones').value = ''; }
            if (Object.hasOwn(obj, 'borders') == true) { document.getElementById('borders').value = obj.borders; } else { document.getElementById('borders').value = ''; }
            if (Object.hasOwn(obj, 'nativeName') == true) { document.getElementById('nativeName').value = obj.nativeName; } else { document.getElementById('nativeName').value = ''; }
            if (Object.hasOwn(obj, 'numericCode') == true) { document.getElementById('numericCode').value = obj.numericCode; } else { document.getElementById('numericCode').value = ''; }
            if (Object.hasOwn(obj, 'currencies') == true) { if (obj.currencies.length > 0) { document.getElementById('currencies').value += obj.currencies[0].code + ',' + obj.currencies[0].name + ',' + obj.currencies[0].symbol; } else { document.getElementById('currencies').value = ''; } } else { document.getElementById('currencies').value = ''; }
            if (Object.hasOwn(obj, 'languages') == true) { if (obj.languages.length > 0) { document.getElementById('languages').value += obj.languages[0].iso639_1 + ',' + obj.languages[0].iso639_2 + ',' + obj.languages[0].name + ',' + obj.languages[0].nativeName; } else { document.getElementById('languages').value = ''; } } else { document.getElementById('languages').value = ''; }
            if (Object.hasOwn(obj, 'translations') == true) { if (obj.translations.length > 0) { document.getElementById('translations').value += obj.translations.de + ',' + obj.translations.es + ',' + obj.translations.fr + ',' + obj.translations.ja + ',' + obj.translations.it + ',' + obj.translations.br + ',' + obj.translations.pt + ',' + obj.translations.nl + ',' + obj.translations.hr + ',' + obj.translations.fa; } else { document.getElementById('translations').value = ''; } } else { document.getElementById('translations').value = ''; }
            if (Object.hasOwn(obj, 'regionalBlocs') == true) { if(obj.regionalBlocs.length > 0){ document.getElementById('regionalBlocs').value = obj.regionalBlocs[0].acronym + ',' + obj.regionalBlocs[0].name; } else { document.getElementById('regionalBlocs').value = ''; } } else { document.getElementById('regionalBlocs').value = ''; }
            if (Object.hasOwn(obj, 'cioc') == true) { document.getElementById('cioc').value = obj.cioc; } else { document.getElementById('cioc').value = ''; }
            if (Object.hasOwn(obj, 'flag') == true) { document.getElementById('flag').src = obj.flag; }
            if (Object.hasOwn(obj, 'flags') == true) { document.getElementById('flag').src = obj.flags.svg; } 
            document.getElementById('flag').className = 'w3-image w3-border w3-border-black';
        }
        catch (error) {
            alert(error.message);
        }
    }
}

async function ClearAllField() {
    document.getElementById('name').value = '';
    document.getElementById('topLevelDomain').value = '';
    document.getElementById('alpha2Code').value = '';
    document.getElementById('alpha3Code').value = '';
    document.getElementById('callingCodes').value = '';
    document.getElementById('capital').value = '';
    document.getElementById('altSpellings').value = '';
    document.getElementById('region').value = '';
    document.getElementById('subregion').value = '';
    document.getElementById('population').value = '';
    document.getElementById('latlng').value = '';
    document.getElementById('demonym').value = '';
    document.getElementById('area').value = '';
    document.getElementById('gini').value = '';
    document.getElementById('timezones').value = '';
    document.getElementById('borders').value = '';
    document.getElementById('nativeName').value = '';
    document.getElementById('numericCode').value = '';
    document.getElementById('currencies').value = '';
    document.getElementById('languages').value = '';
    document.getElementById('translations').value = '';
    document.getElementById('regionalBlocs').value = '';
    document.getElementById('cioc').value = '';
    document.getElementById('flag').src = '';
    document.getElementById('flag').className = '';
}
