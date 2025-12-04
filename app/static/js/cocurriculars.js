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

        html += `<div class="add-review">
            <input type="number" placeholder="Rating (1-5 stars)" id="rating-${i}">
            <textarea placeholder="Write your review..." id="review-${i}"></textarea>
            <button onclick="submitReview('${cocurricular.name}', ${i})">Submit Review</button>
         </div>
         <div id="reviews-${i}" class="reviews-container"></div>`;

        html += '</div>';
    }
    grid.innerHTML = html;
    for (let i = 0; i < cocurriculars.length; i++) {
        loadReviews('cocurriculars', cocurriculars[i].name, `reviews-${i}`);
    }
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
            target_type: 'cocurriculars',
            target_name: targetName,
            review: reviewText,
            rating: rating
        })
    }).then(res => {
        if (res.ok) {
            loadReviews('cocurriculars', targetName, `reviews-${index}`);
            document.getElementById(`review-${index}`).value = '';
            document.getElementById(`rating-${index}`).value = '';
        } else {
            alert("Failed to add review. You must log in as an NMH student to add a review.");
        }
    });
}

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('searchBox').addEventListener('input', handleSearch);
    loadCocurriculars();
});