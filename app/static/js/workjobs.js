let allWorkjobs = [];
let currentSort = 'name';
let currentBuildingFilter = '';
let currentTypeFilter = '';

function loadWorkjobs() {
    fetch('/api/search?s=workjobs')
        .then(response => response.json())
        .then(data => {
            allWorkjobs = data;
            sortAndDisplay();
            updateResultsInfo(allWorkjobs.length, allWorkjobs.length);
        })
        .catch(error => {
            console.error('Error loading workjobs:', error);
            document.getElementById('workjobsGrid').innerHTML =
                '<div class="no-results"><h2>Error Loading Workjobs</h2><p>Please try again later.</p></div>';
        });
}

function searchWorkjobs(query) {
    fetch('/api/search?q=' + encodeURIComponent(query) + '&s=workjobs')
        .then(response => response.json())
        .then(results => {
            const filtered = filterWorkjobs(results);
            displayWorkjobs(sortWorkjobs(filtered));
            updateResultsInfo(filtered.length, allWorkjobs.length);
        })
        .catch(error => {
            console.error('Error searching workjobs:', error);
        });
}

function filterWorkjobs(workjobs) {
    let filtered = workjobs;

    // Filter by building
    if (currentBuildingFilter) {
        filtered = filtered.filter(w =>
            (w.location || '').toLowerCase() === currentBuildingFilter.toLowerCase()
        );
    }

    // Filter by type
    if (currentTypeFilter) {
        filtered = filtered.filter(w =>
            (w.selected_or_assigned || '').toLowerCase() === currentTypeFilter.toLowerCase()
        );
    }

    return filtered;
}

function sortWorkjobs(workjobs) {
    const sorted = [...workjobs];

    switch(currentSort) {
        case 'name':
            sorted.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
            break;
        case 'location':
            sorted.sort((a, b) => (a.location || '').localeCompare(b.location || ''));
            break;
        case 'spots':
            sorted.sort((a, b) => {
                const spotsA = parseInt(a.spots) || 0;
                const spotsB = parseInt(b.spots) || 0;
                return spotsB - spotsA; // Descending order
            });
            break;
    }

    return sorted;
}

function sortAndDisplay() {
    const filtered = filterWorkjobs(allWorkjobs);
    const sorted = sortWorkjobs(filtered);
    displayWorkjobs(sorted);
    updateResultsInfo(filtered.length, allWorkjobs.length);
}

function displayWorkjobs(workjobs) {
    const grid = document.getElementById('workjobsGrid');

    if (workjobs.length === 0) {
        grid.innerHTML = '<div class="no-results"><h2>No workjobs found</h2><p>Try adjusting your search terms or filters</p></div>';
        return;
    }

    let html = '';
    for (let i = 0; i < workjobs.length; i++) {
        const w = workjobs[i];
        html += '<div class="workjob-card">';

        // Header
        html += '<div class="workjob-header">';
        html += '<div class="workjob-title">' + (w.name || 'Unnamed Workjob') + '</div>';
        if (w.location) {
            html += '<span class="workjob-location">' + w.location + '</span>';
        }
        html += '</div>';

        // Body
        html += '<div class="workjob-body">';

        if (w.supervisor) {
            html += '<div class="workjob-info"><strong>Supervisor:</strong> ' + w.supervisor + '</div>';
        }

        if (w.blocks) {
            html += '<div class="workjob-info"><strong>Blocks:</strong> ' + w.blocks + '</div>';
        }

        if (w.description) {
            html += '<div class="workjob-description">' + w.description + '</div>';
        }

        html += '</div>';

        // Footer
        html += '<div class="workjob-footer">';

        if (w.spots) {
            html += '<div class="workjob-spots">' + w.spots + ' spot' + (w.spots !== '1' ? 's' : '') + '</div>';
        }

        if (w.selected_or_assigned) {
            const typeClass = w.selected_or_assigned.toLowerCase();
            html += '<span class="workjob-type ' + typeClass + '">' + w.selected_or_assigned + '</span>';
        }

        html += '</div>';

        // Contact link
        if (w.supervisor_email) {
            html += '<div class="workjob-contact">';
            html += '<a href="mailto:' + w.supervisor_email + '">Contact Supervisor</a>';
            html += '</div>';
        }

        html += '</div>';
    }

    grid.innerHTML = html;
}

function updateResultsInfo(shown, total) {
    const info = document.getElementById('resultsInfo');
    if (shown === total) {
        info.textContent = 'Showing all ' + total + ' workjob' + (total !== 1 ? 's' : '');
    } else {
        info.textContent = 'Showing ' + shown + ' of ' + total + ' workjob' + (total !== 1 ? 's' : '');
    }
}

function handleSearch() {
    const query = document.getElementById('searchBox').value.trim();
    if (query) {
        searchWorkjobs(query);
    } else {
        sortAndDisplay();
    }
}

function handleBuildingFilter() {
    currentBuildingFilter = document.getElementById('buildingFilter').value;
    handleSearch();
}

function handleTypeFilter() {
    currentTypeFilter = document.getElementById('typeFilter').value;
    handleSearch();
}

function handleSort() {
    currentSort = document.getElementById('sortSelect').value;
    handleSearch();
}

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('searchBox').addEventListener('input', handleSearch);
    document.getElementById('buildingFilter').addEventListener('change', handleBuildingFilter);
    document.getElementById('typeFilter').addEventListener('change', handleTypeFilter);
    document.getElementById('sortSelect').addEventListener('change', handleSort);
    loadWorkjobs();
});