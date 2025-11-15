let allClasses = [];
let currentSort = 'name';
let isDescending = false;
let currentSubjectFilter = '';

function loadClasses() {
    fetch('/api/search?s=classes')
        .then(response => response.json())
        .then(data => {
            allClasses = data;
            populateSubjectFilter();
            sortAndDisplay();
            updateResultsInfo(allClasses.length, allClasses.length);
        });
}

function extractSubject(bnc) {
    if (!bnc) return '';
    const match = bnc.match(/^[A-Z_]+/);
    return match ? match[0] : '';
}

function populateSubjectFilter() {
    const subjects = new Set();
    allClasses.forEach(c => {
        const subject = extractSubject(c.bnc);
        if (subject) {
            subjects.add(subject);
        }
    });

    const sortedSubjects = Array.from(subjects).sort();
    const filterSelect = document.getElementById('subjectFilter');

    sortedSubjects.forEach(subject => {
        const option = document.createElement('option');
        option.value = subject;
        option.textContent = subject;
        filterSelect.appendChild(option);
    });
}

function searchClasses(query) {
    fetch('/api/search?q=' + encodeURIComponent(query) + '&s=classes')
        .then(response => response.json())
        .then(results => {
            const filtered = filterBySubject(results);
            displayClasses(sortClasses(filtered));
            updateResultsInfo(filtered.length, allClasses.length);
        });
}

function filterBySubject(classes) {
    if (!currentSubjectFilter) {
        return classes;
    }

    return classes.filter(c => {
        const subject = extractSubject(c.bnc);
        return subject === currentSubjectFilter;
    });
}

function sortClasses(classes) {
    const sorted = [...classes];


    switch(currentSort) {
        case 'name':
            sorted.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
            break;
        case 'bnc':
            sorted.sort((a, b) => (a.bnc || '').localeCompare(b.bnc || ''));
            break;
        case 'semester':
            sorted.sort((a, b) => (a.semester || '').localeCompare(b.semester || ''));
            break;
        case 'room':
            sorted.sort((a, b) => (a.room || '').localeCompare(b.room || ''));
            break;
    }

    if (isDescending) {
        sorted.reverse();
    }

    return sorted;
}

function sortAndDisplay() {
    const filtered = filterBySubject(allClasses);
    const sorted = sortClasses(filtered);
    displayClasses(sorted);
    updateResultsInfo(filtered.length, allClasses.length);
}

function displayClasses(classes) {
    const grid = document.getElementById('classesGrid');

    if (classes.length === 0) {
        grid.innerHTML = '<div class="no-results"><h2>No classes found</h2><p>Try adjusting your search terms or filters</p></div>';
        return;
    }

    let html = '';
    for (let i = 0; i < classes.length; i++) {
        const c = classes[i];
        html += '<div class="class-card">';
        html += '<div class="class-title">' + (c.name || 'Untitled Class') + '</div>';
        html += '<div class="class-info"><strong>BNC:</strong> ' + (c.bnc || 'TBD') + '</div>';
        if (c.semester) {
            html += '<div class="class-info"><strong>Semester:</strong> ' + c.semester + '</div>';
        }
        if (c.room) {
            html += '<div class="class-info"><strong>Room:</strong> ' + c.room + '</div>';
        }
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
        searchClasses(query);
    } else {
        sortAndDisplay();
    }
}

function handleSubjectFilter() {
    currentSubjectFilter = document.getElementById('subjectFilter').value;
    handleSearch();
}

function handleSort() {
    currentSort = document.getElementById('sortSelect').value;
    isDescending = document.getElementById('descendingCheck').checked;
    handleSearch();
}

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('searchBox').addEventListener('input', handleSearch);
    document.getElementById('subjectFilter').addEventListener('change', handleSubjectFilter);
    document.getElementById('sortSelect').addEventListener('change', handleSort);
    document.getElementById('descendingCheck').addEventListener('change', handleSort);
    loadClasses();
});