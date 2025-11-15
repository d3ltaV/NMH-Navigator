let allWorkjobs = [];

function loadClasses() {
    fetch('/api/search')
        .then(response => response.json())
        .then(data => {
            allWorkjobs = data;
            displayWorkjobs(allWorkjobs);
            updateResultsInfo(allWorkjobs.length, allWorkjobs.length);
        });
}

function searchWorkjobs(query) {
    fetch('/api/search?q=' + encodeURIComponent(query))
        .then(response => response.json())
        .then(results => {
            displayWorkjobs(results);
            updateResultsInfo(results.length, allWorkjobs.length);
        });
}

function displayWorkjobs(workjobs) {
    const grid = document.getElementById('workjobsGrid');

    if (workjobs.length === 0) {
        grid.innerHTML = '<div class="no-results"><h2>No workjobs found</h2><p>Try adjusting your search terms</p></div>';
        return;
    }

    let html = '';
    for (let i = 0; i < workjobs.length; i++) {
        const job = workjobs[i];
        html += '<div class="workjob-card">';
        html += '<div class="workjob-title">' + (job.name || 'Untitled Position') + '</div>';
        html += '<span class="workjob-location">' + (job.location || 'Location TBD') + '</span>';
        html += '<div class="workjob-info"><strong>Supervisor:</strong> ' + (job.supervisor || 'TBD') + '</div>';

        if (job.supervisor_email) {
            html += '<div class="workjob-info"><strong>Email:</strong> <a href="mailto:' + job.supervisor_email + '">' + job.supervisor_email + '</a></div>';
        }

        html += '<div class="workjob-info"><strong>Available Spots:</strong> ' + (job.spots || 'N/A') + '</div>';

        if (job.blocks) {
            html += '<div class="workjob-blocks">Blocks: ' + job.blocks + '</div>';
        }

        if (job.description) {
            html += '<div class="workjob-description">' + job.description + '</div>';
        }

        if (job.notes) {
            html += '<div class="workjob-info" style="margin-top: 10px; font-style: italic;"><strong>Note:</strong> ' + job.notes + '</div>';
        }

        html += '</div>';
    }

    grid.innerHTML = html;
}

function updateResultsInfo(shown, total) {
    const info = document.getElementById('resultsInfo');
    if (shown === total) {
        info.textContent = 'Showing all workjobs!';
    } else {
        info.textContent = 'Showing ' + shown + ' of ' + total + ' workjob' + (total !== 1 ? 's' : '');
    }
}

function handleSearch() {
    const query = document.getElementById('searchBox').value.trim();
    if (query) {
        searchWorkjobs(query);
    } else {
        displayWorkjobs(allWorkjobs);
        updateResultsInfo(allWorkjobs.length, allWorkjobs.length);
    }
}


document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('searchBox').addEventListener('input', handleSearch);
    loadWorkjobs();
});