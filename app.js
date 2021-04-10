createCard = (data) => {
    for (const brew in data) {
        const $newEntry = $('<div>').addClass('entry-card');
        const $newNameBlock = $('<div>').addClass('name-block');
        $newEntry.append($newNameBlock);
        const $newName = $('<p>').text(data[brew].name).addClass('entry-name');
        $newNameBlock.append($newName);

        if (data[brew].website_url) {
            const $newWebsite = $('<a>').text(data[brew].website_url).attr('href', data[brew].website_url).attr('target', '_blank').addClass('website');
            $newNameBlock.append($newWebsite);
        } else {
            const $newWebsite = $('<p>').text('Website Not Available').addClass('website');
            $newNameBlock.append($newWebsite);
        };

        const $newStreetAddressBlock = $('<div>').addClass('address-block');
        const $newStreetAddressLine1 = $('<p>').addClass('address-line1').text(data[brew].street);
        const $newStreetAddressLine2 = $('<p>').text(`${data[brew].city}, ${data[brew].state} ${data[brew].postal_code}`).addClass('address-line2');
        $newStreetAddressBlock.append($newStreetAddressLine1);
        $newStreetAddressBlock.append($newStreetAddressLine2);
        $newEntry.append($newStreetAddressBlock);

        $('#entries').append($newEntry);
    };
};

addNewTitleCard = (type) => {
    $newTitleCard = $('<div>').text(type).addClass('title-card');
    $('#entries').append($newTitleCard);
};


const findData = (city, state) => {

    const breweryTypes = ['micro', 'brewpub', 'regional', 'nano'];

    for (let i = 0; i < breweryTypes.length; i++) {
        $.ajax({
            url: 'https://api.openbrewerydb.org/breweries?per_page=50&by_type=' + breweryTypes[i] + '&by_city=' + city + '& by_state=' + state
        }).then(
            (data) => {
                console.log(data);
                if (data.length > 0) {
                    addNewTitleCard(breweryTypes[i])
                    createCard(data);
                };
            },
            () => {
                console.log('bad');
            }
        );
    };
};


const $searchButton = $('#search');

$searchButton.on('click', (event) => {
    event.preventDefault();
    $('.entry-card').remove();
    $('.title-card').remove();
    const $searchCity = $('#city').val();
    const $searchState = $('#state').val();
    findData($searchCity, $searchState);
});


// logData('atlanta', 'georgia');