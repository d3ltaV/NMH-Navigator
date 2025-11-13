const mapElement = document.querySelector('gmp-map');

async function initMap() {
    // Load required libraries
    const { Map, InfoWindow } = await google.maps.importLibrary("maps");
    const { AdvancedMarkerElement, PinElement } = await google.maps.importLibrary("marker");
    const bounds = {
        north: 42.7200,
        south: 42.6200,
        west: -72.5450,
        east: -72.4300
    };
    const locations = [
        { title: "Library", position: { lat: 42.6686206, lng: -72.4834041 } },
        { title: "RAC", position: { lat: 42.6679954, lng: -72.4814605 } },
        { title: "Gilder", position: { lat: 42.667144, lng: -72.481665 } },
        { title: "Dorms", position: { lat: 42.6676204, lng: -72.4838411 } },
        { title: "Bolger", position: { lat: 42.66644601940982 , lng:-72.48515196277874 } },
        { title: "Alumni Hall", position: { lat:42.66748046088102 , lng:-72.48557843400381 } },
        { title: "Schauffler Library", position: { lat: 42.66899511246868, lng:-72.48312287168545 } },
        { title: "Forslund Gym", position: { lat:42.66622766388029 , lng:-72.48156656247123 } },
        { title: "RAC", position: { lat: 42.66894637358398, lng: -72.48241011724572 } },
        { title: "Health Center", position: { lat: 42.66725816449024, lng: -72.4867499314032} },
        { title: "Communications Office", position: { lat: 42.67012671214381, lng: -72.48195950620217} },
        { title: "Early Childhood Center", position: { lat:42.66832414764135, lng:-72.47894604438869 } },
        { title: "Farm", position: { lat:42.670343686705166, lng:-72.48129390883983 } },
        { title: "Plant Facilities", position: { lat: 42.66961202001847, lng: -72.48068772960862 } },
        { title: "BEV", position: { lat:42.66896317632714 , lng: -72.48240568446545} }


    ];
    
    await mapElement.innerMap;
    mapElement.innerMap.setOptions({
        restriction: {
            latLngBounds: bounds,
            strictBounds: true
        }
    });
    
    const infoWindow = new InfoWindow();
    locations.forEach(({ title, position }, i) => {
        const pin = new PinElement({
            //@ts-ignore
            glyphText: `${i + 1}`,
            scale: 1.5
        });

        const marker = new AdvancedMarkerElement({
            position,
            title,
            gmpClickable: true
        });

        marker.append(pin);
        mapElement.append(marker);

        marker.addListener("click", () => {
            infoWindow.close();
            infoWindow.setContent(`<strong>${title}</strong>`);
            infoWindow.open(marker.map, marker);
        });
    });
}

initMap();

