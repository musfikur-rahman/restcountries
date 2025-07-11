document.addEventListener('DOMContentLoaded', () => {
    const countriesContainer = document.getElementById('countries-container');
    const scrollToTopBtn = document.getElementById('scrollToTopBtn');

    // Show or hide the scroll-to-top button based on scroll position
    window.onscroll = function() {
        if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
            scrollToTopBtn.style.display = "block";
        } else {
            scrollToTopBtn.style.display = "none";
        }
    };

    // When the user clicks on the button, scroll to the top of the document
    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    fetch('https://restcountries.com/v3.1/all?fields=name')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(namesData => {
            if (!Array.isArray(namesData)) {
                throw new Error('Expected an array of country names.');
            }
            namesData.forEach(countryName => {
                if (countryName && countryName.name && countryName.name.common) {
                    fetch(`https://restcountries.com/v3.1/name/${countryName.name.common}`)
                        .then(response => {
                            if (!response.ok) {
                                throw new Error(`HTTP error! status: ${response.status} for ${countryName.name.common}`);
                            }
                            return response.json();
                        })
                        .then(countryData => {
                            const country = countryData[0];
                            if (country) {
                                const countryCard = document.createElement('div');
                                countryCard.classList.add('country-card');

                                let detailsHtml = `
                                    <img src="${country.flags.png}" alt="${country.flags.alt || `Flag of ${country.name.common}`}">
                                    <div class="country-card-info">
                                        <h2>${country.name.common}</h2>
                                        <p><strong>Official Name:</strong> ${country.name.official || 'N/A'}</p>
                                `;

                                // Add native names
                                if (country.name.nativeName) {
                                    const nativeNames = Object.values(country.name.nativeName).map(n => n.common).filter(Boolean);
                                    if (nativeNames.length > 0) {
                                        detailsHtml += `<p><strong>Native Names:</strong> ${nativeNames.join(', ')}</p>`;
                                    }
                                }

                                // Add alt spellings
                                if (country.altSpellings && country.altSpellings.length > 0) {
                                    detailsHtml += `<p><strong>Alt Spellings:</strong> ${country.altSpellings.join(', ')}</p>`;
                                }

                                for (const [key, value] of Object.entries(country)) {
                                    if (['flags', 'name', 'altSpellings'].includes(key)) {
                                        continue; // Already handled or will be handled by specific fields
                                    }

                                    let displayValue;
                                    if (typeof value === 'object' && value !== null) {
                                        if (Array.isArray(value)) {
                                            if (key === 'borders' || key === 'timezones' || key === 'continents') {
                                                displayValue = value.join(', ');
                                            } else if (key === 'tld') {
                                                displayValue = value[0] || 'N/A';
                                            } else if (key === 'latlng') {
                                                displayValue = `Lat: ${value[0]}, Lng: ${value[1]}`; 
                                            } else {
                                                displayValue = `[Array: ${key} with ${value.length} items]`; // Fallback for unhandled arrays
                                            }
                                        } else {
                                            // Handle specific common objects for better display
                                            switch (key) {
                                                case 'currencies':
                                                    displayValue = Object.values(value).map(c => `${c.name} (${c.symbol || ''})`).join(', ') || 'N/A';
                                                    break;
                                                case 'languages':
                                                    displayValue = Object.values(value).join(', ') || 'N/A';
                                                    break;
                                                case 'capital':
                                                    displayValue = value[0] || 'N/A';
                                                    break;
                                                case 'maps':
                                                    displayValue = `<a href="${value.googleMaps}" target="_blank">Google Maps</a>, <a href="${value.openStreetMaps}" target="_blank">OpenStreetMap</a>`;
                                                    break;
                                                case 'demonyms':
                                                    displayValue = value.eng ? `Male: ${value.eng.m}, Female: ${value.eng.f}` : 'N/A';
                                                    break;
                                                case 'car':
                                                    displayValue = value.signs && value.signs.length > 0 ? `Side: ${value.side}, Signs: ${value.signs.join(', ')}` : `Side: ${value.side || 'N/A'}`; 
                                                    break;
                                                case 'gini':
                                                    const giniYear = Object.keys(value)[0];
                                                    displayValue = giniYear ? `${value[giniYear]} (${giniYear})` : 'N/A';
                                                    break;
                                                case 'coatOfArms':
                                                    displayValue = value.png ? `<img src="${value.png}" alt="Coat of Arms" style="width:50px;height:auto;">` : (value.svg ? `<img src="${value.svg}" alt="Coat of Arms" style="width:50px;height:auto;">` : 'N/A');
                                                    break;
                                                case 'idd':
                                                    displayValue = value.suffixes && value.suffixes.length > 0 ? `Root: ${value.root}, Suffixes: ${value.suffixes.join(', ')}` : `Root: ${value.root || 'N/A'}`; 
                                                    break;
                                                case 'translations':
                                                    displayValue = Object.entries(value).map(([langCode, trans]) => `${langCode}: ${trans.common}`).join('; ');
                                                    break;
                                                case 'capitalInfo':
                                                    displayValue = value.latlng ? `Lat: ${value.latlng[0]}, Lng: ${value.latlng[1]}` : 'N/A';
                                                    break;
                                                case 'postalCode':
                                                    displayValue = `Format: ${value.format}, Regex: ${value.regex}`; 
                                                    break;
                                                default:
                                                    displayValue = `[Object: ${key}]`; // Fallback for unhandled objects
                                            }
                                        }
                                    } else if (typeof value === 'boolean') {
                                        displayValue = value ? 'Yes' : 'No';
                                    } else if (typeof value === 'number') {
                                        displayValue = value.toLocaleString();
                                    } else {
                                        displayValue = value || 'N/A';
                                    }
                                    detailsHtml += `<p><strong>${key.charAt(0).toUpperCase() + key.slice(1)}:</strong> ${displayValue}</p>`;
                                }
                                countryCard.innerHTML = detailsHtml + `</div>`;
                                countriesContainer.appendChild(countryCard);
                            }
                        })
                        .catch(error => {
                            console.error(`Error fetching details for ${countryName.name.common}:`, error);
                        });
                } else {
                    console.warn('Invalid country name object received:', countryName);
                }
            });
        })
        .catch(error => {
            console.error('Error fetching country names:', error);
            countriesContainer.innerHTML = '<p>Failed to load countries. Please try again later.</p>';
        });
});