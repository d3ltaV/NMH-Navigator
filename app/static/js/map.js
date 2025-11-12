const mapElement = document.querySelector('gmp-map');

async function initMap() {
    // Load required libraries
    const { Map, InfoWindow } = await google.maps.importLibrary("maps");
    const { AdvancedMarkerElement, PinElement } = await google.maps.importLibrary("marker");
    const bounds = {
        north: 42.7800,
        south: 42.5600,
        west: -72.5950,
        east: -72.3700
    };
    const locations = [
        { title: "Library", position: { lat: 42.6686206, lng: -72.4834041 } },
        { title: "RAC", position: { lat: 42.6679954, lng: -72.4814605 } },
        { title: "Gilder", position: { lat: 42.667541, lng: -72.481520 } },
        { title: "Dorms", position: { lat: 42.6676204, lng: -72.4838411 } }
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

