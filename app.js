createCard = (data) => {
    for (const brew in data) {
        const $newEntry = $('<div>').addClass('entry-card').addClass(data[brew].brewery_type);
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

        $('#breweries').append($newEntry);
    };
    $('.entry-card').hide();
    $('.micro').show();
};

addNewTitleCard = (type) => {
    $newTitleCard = $('<div>').addClass('title-card').attr('id', `${type}-title`);
    $newTypeTitle = $('<h2>').text(type).addClass('type-title');
    $newTitleCard.append($newTypeTitle);
    $('#tab-bar').append($newTitleCard);
    $('#micro-title').addClass('active-tab');
};

const breweryTypes = ['micro', 'brewpub', 'regional', 'nano'];

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

const $breweries = $('<div>').attr('id', 'breweries');
const findData = (city, state) => {
    const $hoverForDefinition = $('<p>').text('Hover over each brewery type to see a definition.')
        .attr('id', 'tooltip-instructions').css('color', '#e5e7df');
    $('#search-form').append($hoverForDefinition);
    const $tabBar = $('<div>').attr('id', 'tab-bar');
    $('#entries').append($tabBar);
    for (let i = 0; i < breweryTypes.length; i++) {
        window.setTimeout(() => {
            callAPI(city, state, i);
        }, 200 * i);
    };
};


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

$(window).on('mouseover', (event) => {
    if ($(event.target).attr('class') === 'type-title') {
        let $tooltip = $('<div>').addClass('tooltip');
        let $tooltipText = $('<p>').text($(`#${$(event.target).text()}-tooltip`).text());
        $tooltip.append($tooltipText);
        $(event.target).parent().append($tooltip);
        $(event.target).on('mouseout', (event) => {
            $(event.target).next().remove();
        });
    };
});

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
    }
});

