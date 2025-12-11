let allCocurriculars = [];

function loadCocurriculars() {
    fetch('/api/search?s=cocurriculars')
        .then(response => response.json())
        .then(data => {
            allCocurriculars = data;
            displayCocurriculars(allCocurriculars);
            updateResultsInfo(allCocurriculars.length, allCocurriculars.length);
        });
}

function searchCocurriculars(query) {
    fetch('/api/search?q=' + encodeURIComponent(query) + '&s=cocurriculars')
        .then(response => response.json())
        .then(results => {
            displayCocurriculars(results);
            updateResultsInfo(results.length, allCocurriculars.length);
        });
}

function displayCocurriculars(cocurriculars) {
    const grid = document.getElementById('cocurricularsGrid');

    if (cocurriculars.length === 0) {
        grid.innerHTML = '<div class="no-results"><h2>No cocurriculars found</h2><p>Try adjusting your search terms</p></div>';
        return;
    }

    let html = '';
    for (let i = 0; i < cocurriculars.length; i++) {
        const cocurricular = cocurriculars[i];
        html += '<div class="cocurricular-card">';
        html += '<div class="cocurricular-title">' + (cocurricular.name || 'Untitled Position') + '</div>';
        html += '<div class="cocurricular-info"><strong>Category:</strong> ' + (cocurricular.category || 'Category NA') + '</div>';
        html += '<div class="cocurricular-info"><strong>Season:</strong> ' + (cocurricular.season || 'Season NA') + '</div>';
        html += '<div class="cocurricular-info"><strong>Prerequisites:</strong> ' + (cocurricular.prerequisites || 'Prerequisites NA') + '</div>';
        html += '<div class="cocurricular-info"><strong>Location:</strong> ' + (cocurricular.location || 'TBD') + '</div>';
        html += '<div class="cocurricular-info"><strong>Schedule:</strong> ' + (cocurricular.schedule || 'TBD') + '</div>';
        html += '<div class="cocurricular-info"><strong>Advisor:</strong> ' + (cocurricular.advisor || 'TBD') + '</div>';
        const safeName = encodeURIComponent(cocurricular.name); 

        html += `
        <div class="reviews-section">
            <button class="view-reviews-btn" onclick="openReviewsPopup(decodeURIComponent('${safeName}'), ${i})">View Reviews</button>
            <button class="toggle-review-btn" onclick="openAddReviewPopup(decodeURIComponent('${safeName}'), ${i})">Add Review</button>
        </div>`;
        html += '</div>';
    }
    grid.innerHTML = html;
}

function updateResultsInfo(shown, total) {
    const info = document.getElementById('resultsInfo');
    if (shown === total) {
        info.textContent = 'Showing all cocurriculars!';
    } else {
        info.textContent = 'Showing ' + shown + ' of ' + total + ' cocurricular' + (total !== 1 ? 's' : '');
    }
}

function handleSearch() {
    const query = document.getElementById('searchBox').value.trim();
    if (query) {
        searchCocurriculars(query);
    } else {
        displayCocurriculars(allCocurriculars);
        updateResultsInfo(allCocurriculars.length, allCocurriculars.length);
    }
}

function openReviewsPopup(targetName, index) {
    fetch(`/api/reviews/cocurriculars/${encodeURIComponent(targetName)}`)
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
    
    // Add event listener for stars in popup
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
            target_type: 'cocurriculars',
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
    loadCocurriculars();
});