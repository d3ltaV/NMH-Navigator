let allClasses = [];

function loadClasses() {
    fetch('/api/search?s=classes')
        .then(response => response.json())
        .then(data => {
            allClasses = data;
            displayWorkjobs(allClasses);
            updateResultsInfo(allClasses.length, allClasses.length);
        });
}

function searchClasses(query) {
    fetch('/api/search?q=' + encodeURIComponent(query) + '&s=classes')
        .then(response => response.json())
        .then(results => {
            displayWorkjobs(results);
            updateResultsInfo(results.length, allClasses.length);
        });
}

function displayWorkjobs(classes) {
    const grid = document.getElementById('classesGrid');

    if (classes.length === 0) {
        grid.innerHTML = '<div class="no-results"><h2>No classes found</h2><p>Try adjusting your search terms</p></div>';
        return;
    }

    let html = '';
    for (let i = 0; i < classes.length; i++) {
        const c = classes[i];
        html += '<div class="class-card">';
        html += '<div class="class-title">' + (c.name || 'Untitled Position') + '</div>';
        // html += '<span class="classes-location">' + (c.location || 'Location TBD') + '</span>'; # no location yet must be added to sheets
        html += '<div class="class-info"><strong>BNC:</strong> ' + (c.bnc || 'TBD') + '</div>';
        html += '</div>';
    }

    grid.innerHTML = html;
}

function updateResultsInfo(shown, total) {
    const info = document.getElementById('resultsInfo');
    if (shown === total) {
        info.textContent = 'Showing all classes!';
    } else {
        info.textContent = 'Showing ' + shown + ' of ' + total + ' class' + (total !== 1 ? 'es' : '');
    }
}

function handleSearch() {
    const query = document.getElementById('searchBox').value.trim();
    if (query) {
        searchWorkjobs(query);
    } else {
        displayWorkjobs(allClasses);
        updateResultsInfo(allClasses.length, allClasses.length);
    }
}


document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('searchBox').addEventListener('input', handleSearch);
    loadClasses();
});