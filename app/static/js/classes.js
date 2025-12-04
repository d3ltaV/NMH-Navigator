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
        
        html += `<div class="add-review">
            <input type="number" placeholder="Rating (1-5 stars)" id="rating-${i}">
            <textarea placeholder="Write your review..." id="review-${i}"></textarea>
            <button onclick="submitReview('${c.name}', ${i})">Submit Review</button>
         </div>
         <div id="reviews-${i}" class="reviews-container"></div>`;

        html += '</div>';
    }

    grid.innerHTML = html;
    for (let i = 0; i < classes.length; i++) {
        loadReviews('classes', classes[i].name, `reviews-${i}`);
    }
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

function loadReviews(targetType, targetName, containerId) {
    fetch(`/api/reviews/${targetType}/${encodeURIComponent(targetName)}`)
        .then(res => res.json())
        .then(reviews => {
            const container = document.getElementById(containerId);
            let html = '';

            if (reviews.length === 0) {
                html = '<div class="no-reviews">No reviews yet.</div>';
            } else {
                reviews.forEach(r => {
                    html += `<div class="review-card">
                                <div><strong>Rating:</strong> ${r.rating || 'N/A'}</div>
                                <div>${r.review || ''}</div>
                             </div>`;
                });
            }
            container.innerHTML = html;
        });
}

function submitReview(targetName, index) {
    const reviewText = document.getElementById(`review-${index}`).value;
    const rating = document.getElementById(`rating-${index}`).value;
    if (isNaN(rating) || rating < 1 || rating > 5) {
        alert("Rating must be a number between 1 and 5.");
        return;
    }
    fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            target_type: 'classes',
            target_name: targetName,
            review: reviewText,
            rating: rating
        })
    }).then(res => {
        if (res.ok) {
            loadReviews('classes', targetName, `reviews-${index}`);
            document.getElementById(`review-${index}`).value = '';
            document.getElementById(`rating-${index}`).value = '';
        } else {
            alert("Failed to add review. You must log in as an NMH student to add a review.");
        }
    });
}

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('searchBox').addEventListener('input', handleSearch);
    document.getElementById('subjectFilter').addEventListener('change', handleSubjectFilter);
    document.getElementById('sortSelect').addEventListener('change', handleSort);
    document.getElementById('descendingCheck').addEventListener('change', handleSort);
    loadClasses();
});