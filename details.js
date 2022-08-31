window.onresize = function () {
    windowSize();
}

document.onreadystatechange = function () {
    windowSize();
    RestCountriesByFetch();
}

async function RestCountriesByFetch() {
    let response = await fetch('https://restcountries.com/v3.1/all');
    try {
        let data = await response.text();
        let obj = JSON.parse(data);
        var textSet = '';
        textSet += '<tr>';
        textSet += '<th><b>Name</b></th>';
        textSet += '<th><b>official</b></th>';
        textSet += '<th><b>nativeName</b></th>';
        textSet += '<th><b>tld</b></th>';
        textSet += '<th><b>cca2</b></th>';
        textSet += '<th><b>ccn3</b></th>';
        


        
        textSet += '<th><b>Flag</b></th>';
        textSet += '</tr>';
        for (i = 0; i < obj.length; i++) {
            textSet += '<tr>';
            textSet += '<td>' + obj[i].name.common + '</td>';
            textSet += '<td>' + obj[i].name.official + '</td>';
            let nativeNameValue = '';
            for (let x in obj[i].name.nativeName) { 
                nativeNameValue += '[' + x + '- '; 
                for (let y in obj[i].name.nativeName[x]) { 
                    nativeNameValue += y + ': ' + obj[i].name.nativeName[x][y] + ', '
                } 
                nativeNameValue += '] '
            } 
        textSet += '<td>' + nativeNameValue + '</td>';
        textSet += '<td>' + obj[i].tld + '</td>';
        textSet += '<td>' + obj[i].cca2 + '</td>';
        textSet += '<td>' + obj[i].ccn3 + '</td>';

        

            





            textSet += '<td><img src=' + obj[i].flags.png + ' class="w3-image" ></td>';
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
