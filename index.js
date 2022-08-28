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
        let obj = JSON.parse(data);        
        var txt = '';
        txt += '<option value="">-------Select-------</option>';
        obj.forEach(element => (txt += '<option value=' + element.cca2 + '>' + element.name.common + '</option>'));
        document.getElementById('countryName').innerHTML = txt;
    }
    catch (error) {
        console.log(error.message);
    }
}

async function RestSingleCountriesByFetch() {
    var requestData = document.getElementById('countryName').value;
    if (requestData == '') {
        alert('Please select a country');
    }
    else {
        let response = await fetch('https://restcountries.com/v3.1/alpha/' + requestData);

        try {
            let responseData = await response.text();
            let obj = JSON.parse(responseData)[0];
            if (Object.hasOwn(obj.name, 'common') == true) { document.getElementById('common').value = obj.name.common; } else { document.getElementById('common').value = ''; }
            if (Object.hasOwn(obj.name, 'official') == true) { document.getElementById('official').value = obj.name.official; } else { document.getElementById('official').value = ''; }
            if (Object.hasOwn(obj.name, 'nativeName') == true) { 
                let nativeName = '';
                for (let x in obj.name.nativeName) {
                    nativeName += x + '- ';
                    for (let y in obj.name.nativeName[x]) {
                        nativeName += y + ': ' + obj.name.nativeName[x][y] + ', '
                    }
                }
                document.getElementById('nativeName').value = nativeName; 
            } else { document.getElementById('nativeName').value = ''; }
            if (Object.hasOwn(obj, 'tld') == true) { document.getElementById('tld').value = obj.tld; } else { document.getElementById('tld').value = ''; }
            if (Object.hasOwn(obj, 'cca2') == true) { document.getElementById('cca2').value = obj.cca2; } else { document.getElementById('cca2').value = ''; }
            if (Object.hasOwn(obj, 'ccn3') == true) { document.getElementById('ccn3').value = obj.ccn3; } else { document.getElementById('ccn3').value = ''; }
            if (Object.hasOwn(obj, 'cca3') == true) { document.getElementById('cca3').value = obj.cca3; } else { document.getElementById('cca3').value = ''; }
            if (Object.hasOwn(obj, 'cioc') == true) { document.getElementById('cioc').value = obj.cioc; } else { document.getElementById('cioc').value = ''; }
            if (Object.hasOwn(obj, 'independent') == true) { document.getElementById('independent').value = obj.independent; } else { document.getElementById('independent').value = ''; }
            if (Object.hasOwn(obj, 'status') == true) { document.getElementById('status').value = obj.status; } else { document.getElementById('status').value = ''; }
            if (Object.hasOwn(obj, 'unMember') == true) { document.getElementById('unMember').value = obj.unMember; } else { document.getElementById('unMember').value = ''; }
            if (Object.hasOwn(obj, 'currencies') == true) { 
                let currenciesName = '';
                for (let x in obj.currencies) {
                    currenciesName += x + '- ';
                    for (let y in obj.currencies[x]) {
                        currenciesName += y + ': ' + obj.currencies[x][y] + ', '
                    }
                }
                document.getElementById('currencies').value = currenciesName;                 
            } else { document.getElementById('currencies').value = ''; }
            if (Object.hasOwn(obj, 'idd') == true) { 
                let iddName = '';
                for (let x in obj.idd) {
                    iddName += x + '- ';
                    for (let y in obj.idd[x]) {
                        iddName += y + ': ' + obj.idd[x][y] + ', '
                    }
                }
                document.getElementById('idd').value = iddName;                 
            } else { document.getElementById('idd').value = ''; }
            if (Object.hasOwn(obj, 'capital') == true) { 
                let capitalName = '';
                for (let x = 0; x < obj.capital.length; x++) { capitalName += obj.capital[x]; }
                document.getElementById('capital').value = capitalName;
            } else { document.getElementById('capital').value = ''; }

            
            
            
            
            if (Object.hasOwn(obj, 'flag') == true) { document.getElementById('flag_1').src = obj.flag; }
            if (Object.hasOwn(obj, 'flags') == true) { document.getElementById('flag_1').src = obj.flags.svg; } 
            if (Object.hasOwn(obj, 'flags') == true) { document.getElementById('flag_2').src = obj.flags.png; } 
            document.getElementById('flag_1').className = 'w3-image w3-border w3-border-black';
            document.getElementById('flag_2').className = 'w3-image w3-border w3-border-black';
        }
        catch (error) {
            console.log(error.message);
        }
    }
}

async function ClearAllField() {
    document.getElementById('common').value = '';
    document.getElementById('official').value = '';
    document.getElementById('nativeName').value = '';
    document.getElementById('tld').value = '';
    document.getElementById('cca2').value = '';
    document.getElementById('ccn3').value = '';
    document.getElementById('cca3').value = '';
    document.getElementById('cioc').value = '';
    document.getElementById('independent').value = '';
    document.getElementById('status').value = '';
    document.getElementById('unMember').value = '';
    document.getElementById('currencies').value = '';
    document.getElementById('idd').value = '';
    document.getElementById('capital').value = '';
    












    document.getElementById('flag_1').src = '';
    document.getElementById('flag_2').src = '';
}
