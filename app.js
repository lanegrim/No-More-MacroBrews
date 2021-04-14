console.log(localStorage);

//creates and adds each result to the page as an individual card
createCard = (data) => {
    for (const brew in data) {
        const $newEntry = $('<div>').addClass('entry-card').addClass(data[brew].brewery_type);
        const $newNameBlock = $('<div>').addClass('name-block');
        $newEntry.append($newNameBlock);
        const $newName = $('<p>').text(data[brew].name).addClass('entry-name');
        $newNameBlock.append($newName);

        if (data[brew].website_url) {
            const $newWebsite = $('<a>').text('Visit Their Website').attr('href', data[brew].website_url).attr('target', '_blank').addClass('website');
            $newNameBlock.append($newWebsite);
        } else {
            const $newWebsite = $('<p>').text('Website Not Available').addClass('website');
            $newNameBlock.append($newWebsite);
        };

        if (localStorage.getItem(`${data[brew].id}`)) {
            const $newFavoriteButton = $('<p>').text('Saved').addClass('savedButton');
            $newNameBlock.append($newFavoriteButton);
        } else {
            const $newFavoriteButton = $('<p>').text('Save for Later').addClass('fav-button');
            $newNameBlock.append($newFavoriteButton);
        };

        const $newStreetAddressBlock = $('<div>').addClass('address-block');
        const $newStreetAddressLine1 = $('<p>').addClass('address-line1').text(data[brew].street);
        const $newStreetAddressLine2 = $('<p>').text(`${data[brew].city}, ${data[brew].state} ${data[brew].postal_code}`).addClass('address-line2');
        const $newMapButton = $('<p>').text('View Map').addClass('map-button');
        $newStreetAddressBlock.append($newStreetAddressLine1);
        $newStreetAddressBlock.append($newStreetAddressLine2);
        $newStreetAddressBlock.append($newMapButton);
        $newEntry.append($newStreetAddressBlock);

        $newNameBlock.append($('<p>').text(data[brew].id).addClass('entry-id').hide());

        $('#breweries').append($newEntry);
    };
    $('.entry-card').hide();
    $(`.${$('#breweries').children().eq(0).attr('class').split(' ')[1]}`).show();
    $(`#${$('#breweries').children().eq(0).attr('class').split(' ')[1]}-title`).addClass('active-tab');
};

//similar to the above function, but populates the favorites/saved tab with data from localStorage
buildFavorites = () => {
    $('.saved').remove();
    for (let i = 0; i < localStorage.length; i++) {
        const currentFavorite = JSON.parse(localStorage.getItem(localStorage.key(i)));

        const $newEntry = $('<div>').addClass('entry-card').addClass(`saved`);
        const $newNameBlock = $('<div>').addClass('name-block');
        $newEntry.append($newNameBlock);
        const $newName = $('<p>').text(currentFavorite.name).addClass('entry-name');
        $newNameBlock.append($newName);

        if (currentFavorite.website_url.includes(".")) {
            const $newWebsite = $('<a>').text('Visit Their Website').attr('href', currentFavorite.website_url).attr('target', '_blank').addClass('website');
            $newNameBlock.append($newWebsite);
        } else {
            const $newWebsite = $('<p>').text('Website Not Available').addClass('website');
            $newNameBlock.append($newWebsite);
        };

        if (localStorage.getItem(`${currentFavorite.id}`)) {
            const $newFavoriteButton = $('<p>').text('Saved').addClass('savedButton');
            $newNameBlock.append($newFavoriteButton);
        } else {
            const $newFavoriteButton = $('<p>').text('Save for Later').addClass('fav-button');
            $newNameBlock.append($newFavoriteButton);
        };

        const $newStreetAddressBlock = $('<div>').addClass('address-block');
        const $newStreetAddressLine1 = $('<p>').addClass('address-line1').text(currentFavorite.streetAddressLine1);
        const $newStreetAddressLine2 = $('<p>').text(`${currentFavorite.streetAddressLine2}`).addClass('address-line2');
        const $newMapButton = $('<p>').text('View Map').addClass('map-button');
        $newStreetAddressBlock.append($newStreetAddressLine1);
        $newStreetAddressBlock.append($newStreetAddressLine2);
        $newStreetAddressBlock.append($newMapButton);
        $newEntry.append($newStreetAddressBlock);

        $newNameBlock.append($('<p>').text(currentFavorite.id).addClass('entry-id').hide());

        $('#breweries').append($newEntry);
    };
};


//creates new tabs for each of the brewery types that retuned results in a given search
addNewTitleCard = (type) => {
    const $newTitleCard = $('<div>').addClass('title-card').attr('id', `${type}-title`);
    const $newTypeTitle = $('<h2>').text(type).addClass('type-title');
    $newTitleCard.append($newTypeTitle);
    $('#tab-bar').append($newTitleCard);
};

//similar to the above function, but for the favorites/saved tab
//this will always put the saved tab first
addFavoritesTab = () => {
    const $newFavoritesTab = $('<div>').addClass('title-card').attr('id', `favorites-tab`);
    const $newFavoritesTitle = $('<h2>').text('saved').addClass('favorites-title');
    $newFavoritesTab.append($newFavoritesTitle);
    $('#tab-bar').prepend($newFavoritesTab);
}

//handles the indivudal requests to the OpenBreweryDB API
const breweryTypes = ['micro', 'brewpub', 'regional'];
const callAPI = (city, state, i) => {
    $.ajax({
        url: 'https://api.openbrewerydb.org/breweries?per_page=50&by_type=' + breweryTypes[i] + '&by_city=' + city + '&by_state=' + state
    }).then(
        (data) => {
            if (data.length > 0) {
                addNewTitleCard(breweryTypes[i]);
                createCard(data);
            };
        },
        () => {
            console.log('bad');
        });
}

//loops over the callAPI function for each of the desired types of brewery for every search
const $breweries = $('<div>').attr('id', 'breweries');
const findData = (city, state) => {
    const $hoverForDefinition = $('<p>').text('Hover over each brewery type to see a definition.')
        .attr('id', 'tooltip-instructions').css('color', '#f0f7f9');
    $('#search-form').append($hoverForDefinition);
    const $tabBar = $('<div>').attr('id', 'tab-bar');
    $('#entries').append($tabBar);
    for (let i = 0; i < breweryTypes.length; i++) {
        window.setTimeout(() => {
            callAPI(city, state, i);
        }, 250 * i);
    };
    addFavoritesTab();
};

const loadFavoritesFirst = () => {
    if (localStorage.length > 0) {
        const $tabBar = $('<div>').attr('id', 'tab-bar');
        $('#entries').append($tabBar);
        $('#entries').append($($breweries));
        $breweries.addClass('active-tab');
        buildFavorites();
        addFavoritesTab();
        $('#favorites-tab').addClass('active-tab');
    };
};

loadFavoritesFirst();

/////////////////////////////////////////////////////
////////////EVENT LISTENERS AND HANDLERS/////////////
/////////////////////////////////////////////////////

//directs the seach field values to the API request function and populates the page
const $searchButton = $('#search');
$searchButton.on('click', (event) => {
    event.preventDefault();
    $('#tooltip-instructions').remove();
    $('#tab-bar').remove();
    $('.entry-card').remove();
    $('.title-card').remove();
    const $searchCity = $('#city').val();
    const $searchState = $('#state').val();
    findData($searchCity, $searchState);
    $('#entries').append($breweries);
    $('#breweries').addClass('active-tab');
});

//Triggers the brewery type definition tooltips when users mouseover the tabs
$(window).on('mouseenter', (event) => {
    if ($(event.target).attr('class') === 'type-title') {
        let $tooltip = $('<div>').addClass('tooltip');
        let $tooltipText = $('<p>').text($(`#${$(event.target).text()}-tooltip`).text());
        $tooltip.append($tooltipText);
        $(event.target).parent().append($tooltip);
        $(event.target).on('mouseleave', (event) => {
            $(event.target).next().remove();
        });
    };
});

//switches the active tab to whichever tab is clicked -- hides all others
$(window).on('click', (event) => {
    if ($(event.target).attr('class') === 'title-card') {
        $('.active-tab').removeClass('active-tab');
        $(event.target).addClass('active-tab');
        $('#breweries').addClass('active-tab');
        $('.entry-card').hide();
        $(`.${$(event.target).children().eq(0).text()}`).show();
    } else if ($(event.target).parent().attr('class') === 'title-card') {
        $('.active-tab').removeClass('active-tab');
        $(event.target).parent().addClass('active-tab');
        $('#breweries').addClass('active-tab');
        $('.entry-card').hide();
        $(`.${$(event.target).text()}`).show();
    };
});

//similar to the above event handler, but updates the favorites/saved tab every time the user returns to it
$(window).on('click', (event) => {
    if ($(event.target).attr('id') === 'favorites-tab') {
        if (localStorage.length > 0) {
            console.log('building favorites');
            buildFavorites();
        };
        $('.entry-card').hide();
        $(`.${$(event.target).text()}`).show();
    } else if ($(event.target).parent().attr('id') === 'favorites-tab') {
        if (localStorage.length > 0) {
            buildFavorites();
        };
        $('.entry-card').hide();
        $(`.${$(event.target).text()}`).show();
    };
});

//requests a static map from Google Maps Static API centered on the location of the brewery when the 'view map' button is pressed
//when a new map is requested, the current map collapses
$(window).on('click', (event) => {
    if ($(event.target).attr('class') === 'map-button') {
        $('.entry-card').removeClass('current-map');
        $('.map').hide();
        if ($(event.target).parent().siblings().eq(1).length === 0) {
            const $newMap = $('<img>').addClass('map').attr('src', `https://maps.googleapis.com/maps/api/staticmap?center=${$(event.target).siblings().eq(0).text()}+${$(event.target).siblings().eq(1).text()}&markers=color:blue|label:!|${$(event.target).siblings().eq(0).text()}+${$(event.target).siblings().eq(1).text()}|&zoom=15&size=1100x450&maptype=roadmap&key=AIzaSyAKLOP67mzbsOniqbwdcOHikHn-EZ-ghL8`);
            $(event.target).parents().eq(1).append($newMap);
            $(event.target).parents().eq(1).addClass('current-map');
        } else {
            $(event.target).parent().siblings().eq(1).toggle();
            $(event.target).parents().eq(1).addClass('current-map');
        };
    };
});

//handles the saving of entries to localStorage and the toggling of the 'saved' and 'save for later' buttons
$(window).on('click', (event) => {
    if ($(event.target).attr('class') === 'fav-button') {
        const newFavorite = {
            name: `${$(event.target).siblings().eq(0).text()}`,
            website_url: `${$(event.target).siblings().eq(1).attr('href')}`,
            streetAddressLine1: `${$(event.target).parent().siblings().eq(0).children().eq(0).text()}`,
            streetAddressLine2: `${$(event.target).parent().siblings().eq(0).children().eq(1).text()}`,
            brewery_type: `${$(event.target).parents().eq(1).attr('class').split(" ")[1]}`,
            id: `${$(event.target).siblings().eq(2).text()}`
        };
        localStorage.setItem(`${$(event.target).siblings().eq(2).text()}`, JSON.stringify(newFavorite));
        $(event.target).removeClass('fav-button').addClass('savedButton').text('Saved');
    } else if ($(event.target).attr('class') === 'savedButton') {
        localStorage.removeItem(`${$(event.target).siblings().eq(2).text()}`);
        $(event.target).addClass('fav-button').removeClass('savedButton').text('Save for Later');
        buildFavorites();
        for (const card in $('#breweries').children()) {
            if ($('#breweries').children().eq(card).children().eq(0).children().eq(2).attr('class') === 'savedButton') {
                if ($('#breweries').children().eq(card).children().eq(0).children().eq(3).text()
                    === $(event.target).siblings().eq(2).text()) {
                    $('#breweries').children().eq(card).children().eq(0).children().eq(2).addClass('fav-button').removeClass('savedButton').text('Save for Later');
                };
            };
        };
    };
});