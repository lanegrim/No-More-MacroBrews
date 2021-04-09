addNewData = (data) => {
    for (const brew in data) {
        const $newEntry = $('<div>').text(data[brew].name).addClass('entry-card');
        if (data[brew].website_url) {
            const $newWebsite = $('<a>').text(data[brew].website_url).attr('href', data[brew].website_url).attr('target', '_blank').addClass('website');
            $newEntry.append($newWebsite);
        } else {
            const $newWebsite = $('<div>').text('Not Available').addClass('website');
            $newEntry.append($newWebsite);
        }
        $('#entries').append($newEntry);
    };
};

addNewTitleCard = (type) => {
    $newTitleCard = $('<div>').text(type).css('font-size', '2em');
    $('#entries').append($newTitleCard);
};


const logData = (city, state) => {

    const breweryTypes = ['micro', 'brewpub', 'regional', 'nano'];

    for (let i = 0; i < breweryTypes.length; i++) {
        $.ajax({
            url: 'https://api.openbrewerydb.org/breweries?per_page=50&by_type=' + breweryTypes[i] + '&by_city=' + city + '& by_state=' + state
        }).then(
            (data) => {
                console.log(data);
                if (data.length > 0) {
                    addNewTitleCard(breweryTypes[i])
                    addNewData(data);
                };
            },
            () => {
                console.log('bad');
            }
        );
    };
};
logData('Denver', 'Colorado');