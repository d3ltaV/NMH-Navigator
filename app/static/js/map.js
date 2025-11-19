const mapElement = document.querySelector('gmp-map');

async function initMap() {
    const { Map, InfoWindow } = await google.maps.importLibrary("maps");
    const { AdvancedMarkerElement, PinElement } = await google.maps.importLibrary("marker");

    const bounds = {
        north: 42.7200,
        south: 42.6200,
        west: -72.5450,
        east: -72.4300
    };

    const locations = [
        { title: "Gilder", position: { lat: 42.667144, lng: -72.481665 } },
        { title: "Dorms", position: { lat: 42.6676204, lng: -72.4838411 } },
        { title: "Admissions (Bolger)", position: { lat: 42.66644601940982 , lng:-72.48515196277874 } },
        { title: "Alumni Hall", position: { lat:42.66748046088102 , lng:-72.48557843400381 } },
        { title: "Schauffler Library", position: { lat: 42.66899511246868, lng:-72.48312287168545 } },
        { title: "Gym", position: { lat:42.66622766388029 , lng:-72.48156656247123 } },
        { title: "RAC", position: { lat: 42.66798729516262, lng: -72.4816328964554 } },
        { title: "O'Connor Health Center", position: { lat: 42.66725816449024, lng: -72.4867499314032} },
        { title: "Communications office", position: { lat: 42.67012671214381, lng: -72.48195950620217} },
        { title: "Early Childhood Center", position: { lat:42.66832414764135, lng:-72.47894604438869 } },
        { title: "Farm", position: { lat:42.670343686705166, lng:-72.48129390883983 } },
        { title: "Plant Facilities", position: { lat: 42.66961202001847, lng: -72.48068772960862 } },
        { title: "BEV", position: { lat:42.66896317632714 , lng: -72.48240568446545} },
        { title: "Forest", position: {lat: 42.67102844380024, lng: -72.48804669028948} },
        { title: "Blake", position: {lat: 42.66851986413596, lng: -72.4847851241787} },
    ];

    await mapElement.innerMap;
    mapElement.innerMap.setOptions({
        restriction: {
            latLngBounds: bounds,
            strictBounds: true
        }
    });

    locations.forEach(({ title, position }, i) => {
        const pin = new PinElement({
            glyphText: `${i + 1}`,
            scale: 1.5
        });

        const marker = new AdvancedMarkerElement({
            map: mapElement.innerMap,
            position,
            title,
            content: pin.element
        });

        marker.addListener("click", () => {
            fetch(`/api/workjobs/${encodeURIComponent(title)}`)
                .then(r => r.json())
                .then(data => {
                    const popup = document.getElementById("popup");
                    const popupContent = document.getElementById("popup-content");

                    let html = `<h3>${title}</h3><strong>Workjobs:</strong><br><br>`;

                    if (!data.error) {
                        data.forEach(job => {
                            const sJob = encodeURIComponent(JSON.stringify(job));
                            const sData = encodeURIComponent(JSON.stringify(data));
                            const name = job.name ?? "Unnamed Workjob";
                            html += `<a href="#" class="workjob-link" data-job="${sJob}" data-all="${sData}">${name}</a><br>`;
                        });
                    } else {
                        html += "No workjobs found.";
                    }

                    popupContent.innerHTML = html;
                    popup.style.display = "block";

                    document.querySelectorAll('.workjob-link').forEach(link => {
                        link.addEventListener('click', (e) => {
                            e.preventDefault();
                            const dwj = decodeURIComponent(e.target.dataset.job);
                            const aj = decodeURIComponent(e.target.dataset.all);
                            const workjob = JSON.parse(dwj);
                            const allJobs = JSON.parse(aj);
                            showWorkJobDetail(workjob, allJobs);
                        });
                    });
                })
                .catch(err => console.error(err));
        });
    });

    document.getElementById("popup-close").addEventListener("click", () => {
        document.getElementById("popup").style.display = "none";
    });

    document.getElementById("workjob-detail-close").addEventListener("click", () => {
        document.getElementById("workjob-detail").style.display = "none";
    });
}

function showWorkJobDetail(workjob, allJobs) {
    const detail = document.getElementById("workjob-detail");
    const detailContent = document.getElementById("workjob-detail-content");

    let html = '';

    if (allJobs && allJobs.length > 1) {
        html += '<div class="workjob-tabs">';
        allJobs.forEach((j, idx) => {
            const active = j.name === workjob.name ? 'active' : '';
            html += `<button class="workjob-tab ${active}" data-index="${idx}">${j.name}</button>`;
        });
        html += '</div>';
    }

    html += `
        <h2>${workjob.name}</h2>
        <p><strong>Location:</strong> ${workjob.location ?? 'N/A'}</p>
        <p><strong>Supervisor:</strong> ${workjob.supervisor ?? 'N/A'}</p>
        <p><strong>Email:</strong> ${workjob.supervisor_email ?? 'N/A'}</p>
        <p><strong>Spots:</strong> ${workjob.spots ?? 'N/A'}</p>
        <p><strong>Blocks:</strong> ${workjob.blocks ?? 'N/A'}</p>
        <p><strong>Type:</strong> ${workjob.selected_or_assigned ?? 'N/A'}</p>
        <p><strong>Description:</strong> ${workjob.description ?? 'N/A'}</p>
        ${workjob.notes ? `<p><strong>Notes:</strong> ${workjob.notes}</p>` : ''}
    `;

    detailContent.innerHTML = html;
    detail.style.display = "block";

    document.querySelectorAll('.workjob-tab').forEach(tab => {
        tab.addEventListener('click', (e) => {
            const idx = parseInt(e.target.dataset.index);
            showWorkJobDetail(allJobs[idx], allJobs);
        });
    });
}

initMap();