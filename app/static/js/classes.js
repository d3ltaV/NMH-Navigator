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
        
        html += `
            <div class="reviews-section">
                <button class="view-reviews-btn" onclick="openReviewsPopup('${c.name}', ${i})">View Reviews</button>
                <button class="toggle-review-btn" onclick="openAddReviewPopup('${c.name}', ${i})">Add Review</button>
            </div>
        `;

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

function openReviewsPopup(targetName, index) {
    fetch(`/api/reviews/classes/${encodeURIComponent(targetName)}`)
        .then(res => res.json())
        .then(reviews => {
            let html = '<div class="reviews-popup-overlay" onclick="closePopup(event)">';
                html += '<div class="reviews-popup-content" onclick="event.stopPropagation()">';
                    html += '<div class="reviews-popup-header">';
                        html += `<h3>Reviews for ${targetName}</h3>`;
                        html += '<button class="close-popup-btn" onclick="closePopup()">×</button>';
                    html += '</div>';
                    html += '<div class="reviews-popup-body">';

                    if (reviews.length === 0) {
                        html += '<div class="no-reviews">No reviews yet. Be the first to add one!</div>';
                    } else {
                        reviews.forEach(r => {
                            const stars = "★".repeat(r.rating) + "☆".repeat(5 - r.rating);
                            html += `<div class="review-card">
                                        <div class="starsowo"><strong>Rating:</strong> ${stars}</div>
                                        <div>${r.review || ''}</div>
                                    </div>`;
                        });
                    }

                    html += '</div>';
                html += '</div>';
            html += '</div>';

            document.body.insertAdjacentHTML('beforeend', html);
        });
}

function openAddReviewPopup(targetName, index) {
    let html = '<div class="reviews-popup-overlay" onclick="closePopup(event)">';
        html += '<div class="reviews-popup-content" onclick="event.stopPropagation()">';
            html += '<div class="reviews-popup-header">';
            html += `<h3>Add Review for ${targetName}</h3>`;
                html += '<button class="close-popup-btn" onclick="closePopup()">×</button>';
                html += '</div>';
                html += '<div class="reviews-popup-body">';
                
                html += '<div class="add-review-form">';
                html += '<div class="rating-stars" id="popup-rating-stars">';
                for (let i = 1; i <= 5; i++) {
                    html += `<span class="star" data-value="${i}">★</span>`;
                }
                html += '</div>';
                    html += '<input type="hidden" id="popup-rating">';
                    html += '<textarea class="review-input" id="popup-review" placeholder="Write your review (max 200 characters)..."></textarea>';
                    html += `<button class="submit-btn" onclick="submitReviewFromPopup('${targetName}')">Submit Review</button>`;
                html += '</div>';
            html += '</div>';
        html += '</div>';
    html += '</div>';

    document.body.insertAdjacentHTML('beforeend', html);

    const stars = document.querySelectorAll('#popup-rating-stars .star');
    stars.forEach(star => {
        star.addEventListener('click', function() {
            const value = Number(this.getAttribute('data-value'));
            document.getElementById('popup-rating').value = value;
            
            stars.forEach(s => {
                const v = Number(s.getAttribute('data-value'));
                s.classList.toggle('active', v <= value);
            });
        });
    });
}

function submitReviewFromPopup(targetName) {
    const reviewText = document.getElementById('popup-review').value;
    const rating = document.getElementById('popup-rating').value;

    const MAX_LENGTH = 200;

    if (reviewText.length > MAX_LENGTH) {
        alert(`Review cannot exceed ${MAX_LENGTH} characters.`);
        return;
    }

    if (!rating || isNaN(rating) || rating < 1 || rating > 5) {
        alert("Please select a rating between 1 and 5 stars.");
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
            closePopup();
        } else {
            alert("Failed to add review. You must log in as an NMH student to add a review.");
        }
    });
}

function closePopup(event) {
    if (!event || event.target.classList.contains('reviews-popup-overlay')) {
        const popup = document.querySelector('.reviews-popup-overlay');
        if (popup) {
            popup.remove();
        }
    }
}

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('searchBox').addEventListener('input', handleSearch);
    document.getElementById('subjectFilter').addEventListener('change', handleSubjectFilter);
    document.getElementById('sortSelect').addEventListener('change', handleSort);
    document.getElementById('descendingCheck').addEventListener('change', handleSort);
    loadClasses();
});