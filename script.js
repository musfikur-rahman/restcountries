document.addEventListener('DOMContentLoaded', () => {
    const countrySelect = document.getElementById('country-select');
    const resultsContainer = document.getElementById('results-container');
    const tabNav = document.getElementById('tab-nav');
    const tabContent = document.getElementById('tab-content');
    const themeSwitcher = document.getElementById('theme-switcher');
    const body = document.body;

    // --- THEME SWITCHER LOGIC ---
    const themeIcon = themeSwitcher.querySelector('i');
    const setTheme = (theme) => {
        if (theme === 'light') {
            body.classList.add('light-theme');
            themeIcon.classList.remove('bi-moon-fill');
            themeIcon.classList.add('bi-sun-fill');
        } else {
            body.classList.remove('light-theme');
            themeIcon.classList.remove('bi-sun-fill');
            themeIcon.classList.add('bi-moon-fill');
        }
        localStorage.setItem('theme', theme);
    };

    themeSwitcher.addEventListener('click', () => {
        const currentTheme = body.classList.contains('light-theme') ? 'light' : 'dark';
        setTheme(currentTheme === 'light' ? 'dark' : 'light');
    });

    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);


    // --- INITIALIZATION ---
    fetch('https://ipinfo.io/json')
        .then(response => response.json())
        .then(data => {
            if (data.country) loadCountries(data.country);
            else loadCountries();
        })
        .catch(() => loadCountries());

    function loadCountries(defaultCountryCode = '') {
        fetch('https://restcountries.com/v3.1/all?fields=name,cca2')
            .then(response => response.json())
            .then(countries => {
                countries.sort((a, b) => a.name.common.localeCompare(b.name.common));
                countries.forEach(country => {
                    const option = document.createElement('option');
                    option.value = country.cca2;
                    option.textContent = country.name.common;
                    countrySelect.appendChild(option);
                });
                if (defaultCountryCode) {
                    countrySelect.value = defaultCountryCode;
                    countrySelect.dispatchEvent(new Event('change'));
                }
            })
            .catch(error => console.error('Error fetching country list:', error));
    }

    let currentCountryData = null; // Declare a variable to store the current country data
    let osmMap = null; // Variable to hold the Leaflet map instance

    countrySelect.addEventListener('change', () => {
        const countryCode = countrySelect.value;
        resultsContainer.classList.add('hidden');
        const existingHeader = document.getElementById('country-header');
        if (existingHeader) existingHeader.remove();
        tabNav.innerHTML = '';
        tabContent.innerHTML = '';
        currentCountryData = null; // Reset current country data
        if (osmMap) { // Destroy existing map instance if it exists
            osmMap.remove();
            osmMap = null;
        }

        if (countryCode) {
            fetch(`https://restcountries.com/v3.1/alpha/${countryCode}`)
                .then(response => response.json())
                .then(data => {
                    const country = data[0];
                    currentCountryData = country; // Store the current country data
                    buildUI(country);
                    resultsContainer.classList.remove('hidden');
                })
                .catch(error => console.error('Error fetching country details:', error));
        }
    });

    // --- UI BUILDING ---
    function buildUI(country) {
        displayCountryHeader(country);
        
        const tabs = {
            'General': { icon: 'bi-info-circle-fill', content: createGeneralInfoContent },
            'Geography': { icon: 'bi-globe-americas', content: createGeographyContent },
            'People': { icon: 'bi-people-fill', content: createPeopleCultureContent },
            'Economy': { icon: 'bi-bank', content: createEconomyContent },
            'Codes': { icon: 'bi-qr-code', content: createCodesContent },
            'Transport': { icon: 'bi-sign-turn-right-fill', content: createTransportationContent },
            'Symbols': { icon: 'bi-flag-fill', content: createNationalSymbolsContent },
            'Maps': { icon: 'bi-map-fill', content: createMapsContent },
            'Translations': { icon: 'bi-translate', content: createTranslationsContent }
        };

        let isFirstTab = true;
        for (const [name, { icon, content }] of Object.entries(tabs)) {
            const contentHtml = content(country);
            if (contentHtml) { // Only create a tab if there is content for it
                const tabId = `tab-${name.toLowerCase()}`;
                
                const tabLink = document.createElement('li');
                tabLink.className = 'tab-link';
                if (isFirstTab) tabLink.classList.add('active');
                tabLink.dataset.tab = tabId;
                tabLink.innerHTML = `<i class="${icon}"></i> ${name}`;
                tabNav.appendChild(tabLink);

                const pane = document.createElement('div');
                pane.id = tabId;
                pane.className = 'tab-pane';
                if (isFirstTab) pane.classList.add('active');
                pane.innerHTML = contentHtml;
                tabContent.appendChild(pane);
                
                isFirstTab = false;
            }
        }
        
        addTabEventListeners();
    }

    function addTabEventListeners() {
        tabNav.addEventListener('click', (e) => {
            const clickedTab = e.target.closest('.tab-link');
            if (!clickedTab) return;

            // Deactivate current active tab/pane
            tabNav.querySelector('.active').classList.remove('active');
            tabContent.querySelector('.active').classList.remove('active');

            // Activate new tab/pane
            const tabId = clickedTab.dataset.tab;
            clickedTab.classList.add('active');
            const targetPane = document.getElementById(tabId);
            targetPane.classList.add('active');

            // Special handling for the Maps tab to ensure map reloads
            if (tabId === 'tab-maps' && currentCountryData) {
                // Re-render the map content to ensure the map div is present
                targetPane.innerHTML = createMapsContent(currentCountryData);

                // Initialize Leaflet map
                if (osmMap) {
                    osmMap.remove(); // Remove existing map instance
                }
                const [lat, lon] = currentCountryData.latlng;
                osmMap = L.map('osm-map').setView([lat, lon], 5); // Initial zoom level

                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                }).addTo(osmMap);

                L.marker([lat, lon]).addTo(osmMap)
                    .bindPopup(currentCountryData.name.common)
                    .openPopup();

                // Invalidate map size to ensure it renders correctly
                setTimeout(() => { osmMap.invalidateSize(); }, 100);
            }
        });
    }

    function displayCountryHeader(country) {
        const headerDiv = document.createElement('div');
        headerDiv.id = 'country-header';
        headerDiv.innerHTML = `
            <img src="${country.flags.svg}" alt="Flag of ${country.name.common}" class="header-flag">
            <div>
                <h1>${country.name.common}</h1>
                <h2>${country.name.official}</h2>
            </div>
        `;
        resultsContainer.insertBefore(headerDiv, resultsContainer.firstChild);
    }

    // --- CONTENT CREATION FUNCTIONS ---
    const addDetail = (label, value) => {
        if (value === undefined || value === null || value === '' || (Array.isArray(value) && value.length === 0)) return '';
        return `<p><strong>${label}:</strong> ${value}</p>`;
    };

    function createGeneralInfoContent(country) {
        let html = addDetail('Capital(s)', country.capital?.join(', '));
        html += addDetail('Population', country.population?.toLocaleString());
        html += addDetail('Status', country.status);
        html += addDetail('UN Member', country.unMember ? 'Yes' : 'No');
        html += addDetail('Independent', country.independent ? 'Yes' : 'No');
        html += addDetail('Start of Week', country.startOfWeek);
        html += addDetail('Timezones', country.timezones?.join(', '));
        html += addDetail('Continents', country.continents?.join(', '));
        
        if (country.name.nativeName) {
            html += '<h4>Native Names</h4><ul>';
            for (const langCode in country.name.nativeName) {
                const langName = new Intl.DisplayNames(['en'], { type: 'language' }).of(langCode);
                const native = country.name.nativeName[langCode];
                html += `<li><strong>In ${langName}:</strong> ${native.common} <em>(${native.official})</em></li>`;
            }
            html += '</ul>';
        }
        if (country.altSpellings && country.altSpellings.length > 0) {
            html += '<h4>Alternative Spellings</h4>';
            html += `<p>${country.altSpellings.join(', ')}</p>`;
        }
        return html;
    }

    function createGeographyContent(country) {
        let html = addDetail('Region', country.region);
        html += addDetail('Subregion', country.subregion);
        html += addDetail('Area', `${country.area?.toLocaleString()} km²`);
        html += addDetail('Landlocked', country.landlocked ? 'Yes' : 'No');
        html += addDetail('Borders', country.borders?.join(', '));
        html += addDetail('Coordinates (Lat, Lng)', country.latlng?.join(', '));
        html += addDetail('Capital Coordinates (Lat, Lng)', country.capitalInfo?.latlng?.join(', '));
        return html;
    }

    function createPeopleCultureContent(country) {
        let html = addDetail('Languages', Object.values(country.languages || {}).join(', '));
        if (country.demonyms) {
            const demonym = country.demonyms.eng;
            const value = demonym.f === demonym.m ? demonym.m : `Female: ${demonym.f}, Male: ${demonym.m}`;
            html += addDetail('Demonym', value);
        }
        return html;
    }

    function createEconomyContent(country) {
        let html = '';
        if (country.currencies) {
            const currencyStr = Object.values(country.currencies).map(c => `${c.name} (${c.symbol})`).join(', ');
            html += addDetail('Currencies', currencyStr);
        }
        if (country.gini) {
            const giniStr = Object.entries(country.gini).map(([year, value]) => `${value} (${year})`).join(', ');
            html += addDetail('Gini Index', giniStr);
        }
        return html;
    }

    function createCodesContent(country) {
        let html = '<div class="grid-list">';
        if (country.idd) {
            const iddStr = `${country.idd.root}${country.idd.suffixes ? country.idd.suffixes.join(',') : ''}`;
            html += addDetail('Calling Code', iddStr);
        }
        html += addDetail('Top-Level Domain', country.tld?.join(', '));
        html += addDetail('CCA2', country.cca2);
        html += addDetail('CCA3', country.cca3);
        html += addDetail('CCN3', country.ccn3);
        html += addDetail('CIOC', country.cioc);
        html += addDetail('FIFA', country.fifa);
        if (country.postalCode) {
            html += addDetail('Postal Code Format', country.postalCode.format);
            html += addDetail('Postal Code Regex', `<code>${country.postalCode.regex}</code>`);
        }
        html += '</div>';
        return html;
    }

    function createTransportationContent(country) {
        if (!country.car) return null;
        let html = addDetail('Driving Side', country.car.side);
        html += addDetail('Car Signs', country.car.signs?.join(', '));
        return html;
    }

    function createNationalSymbolsContent(country) {
        let html = '<div class="symbols-container">';
        if (country.flags?.png) {
            html += `<div><h4>Flag</h4><img src="${country.flags.png}" alt="Flag" class="flag-image"></div>`;
        }
        if (country.coatOfArms?.png) {
            html += `<div><h4>Coat of Arms</h4><img src="${country.coatOfArms.png}" alt="Coat of Arms"></div>`;
        }
        html += '</div>';
        return html;
    }

    function createMapsContent(country) {
        if (!country.maps || !country.latlng) return null;
        let html = '';
        if (country.maps.googleMaps) {
            html += `<h4>Google Map</h4><p><a href="${country.maps.googleMaps}" target="_blank">${country.maps.googleMaps}</a></p>`;
            if (country.latlng) {
                const [lat, lon] = country.latlng;
                html += `<div class="map-wrapper"><iframe width="100%" height="400" frameborder="0" src="https://maps.google.com/maps?q=${lat},${lon}&hl=en&z=6&amp;output=embed"></iframe></div>`;
            }
        }
        
        html += `<h4>OpenStreetMap</h4><div id="osm-map" style="height: 400px; width: 100%;"></div>`;
        return html;
    }

    function createTranslationsContent(country) {
        if (!country.translations) return null;
        let html = '<div class="grid-list">';
        for (const [langCode, translation] of Object.entries(country.translations)) {
            const langName = new Intl.DisplayNames(['en'], { type: 'language' }).of(langCode) || langCode;
            html += addDetail(langName, `${translation.common} <em>(${translation.official})</em>`);
        }
        html += '</div>';
        return html;
    }
});