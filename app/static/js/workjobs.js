let allWorkjobs = [];

function loadWorkjobs() {
    fetch('/api/search?s=workjobs')
        .then(response => response.json())
        .then(data => {
            allWorkjobs = data;
            displayWorkjobs(allWorkjobs);
            updateResultsInfo(allWorkjobs.length, allWorkjobs.length);
        });
}

function searchWorkjobs(query) {
    fetch('/api/search?q=' + encodeURIComponent(query) + '&s=workjobs')
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
            html += '<div class="workjob-info"><strong>Note:</strong> ' + job.notes + '</div>';
        }
        html += `
            <div class="reviews-section">

                <button class="toggle-review-btn" id="toggle-btn-${i}" onclick="toggleReviewBox(${i})">Add Review</button>

                <div class="review-box" id="review-box-${i}">
                    <div class="rating-stars" data-index="${i}">
                        ${[1,2,3,4,5].map(n =>
                            `<span class="star" data-value="${n}">&#9733;</span>`
                        ).join('')}
                    </div>
                    
                    <input type="hidden" id="rating-${i}">

                    <textarea class="review-input" id="review-${i}" placeholder="Write your review..."></textarea>

                    <button class="submit-btn" onclick="submitReview('${job.name}', ${i})">
                        Submit
                    </button>
                </div>

                <div id="reviews-${i}" class="reviews-container"></div>
            </div>
        `;

        html += '</div>';
    }
    grid.innerHTML = html;
    for (let i = 0; i < workjobs.length; i++) {
        loadReviews('workjobs', workjobs[i].name, `reviews-${i}`);
    }
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

function loadReviews(targetType, targetName, containerId) {
    fetch(`/api/reviews/${targetType}/${encodeURIComponent(targetName)}`)
        .then(res => res.json())
        .then(reviews => {
            const container = document.getElementById(containerId);
            let html = '';

            if (reviews.length === 0) {
                html = '<div class="no-reviews">No reviews yet. Be the first to add one!</div>';
            } else {
                reviews.forEach(r => {
                    const stars = "★".repeat(r.rating) + "☆".repeat(5 - r.rating);
                    html += `<div class="review-card">
                                <div class="starsowo"><strong>Rating:</strong> ${stars}</div>
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

    const MAX_LENGTH = 200;

    if (reviewText.length > MAX_LENGTH) {
        alert(`Review cannot exceed ${MAX_LENGTH} characters.`);
        return;
    }

    if (isNaN(rating) || rating < 1 || rating > 5) {
        alert("Rating must be a number between 1 and 5.");
        return;
    }
    fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            target_type: 'workjobs',
            target_name: targetName,
            review: reviewText,
            rating: rating
        })
    }).then(res => {
        if (res.ok) {
            loadReviews('workjobs', targetName, `reviews-${index}`);
            document.getElementById(`review-${index}`).value = '';
            document.getElementById(`rating-${index}`).value = '';
            const ratingInput = document.getElementById(`rating-${index}`);
            ratingInput.value = '';

            // Reset stars visually
            const stars = document.querySelectorAll(`#review-box-${index} .star`);
            stars.forEach(star => star.classList.remove('active'));
        } else {
            alert("Failed to add review. You must log in as an NMH student to add a review.");
        }
    });
}

function toggleReviewBox(i) {
    const box = document.getElementById(`review-box-${i}`);
    const btn = document.getElementById(`toggle-btn-${i}`);

    const isOpen = box.classList.toggle("open");

    if (isOpen) {
        btn.textContent = "Close";
    } else {
        btn.textContent = "Add Review";
    }
}

// star ratings
document.addEventListener("click", function(e) {
    if (!e.target.classList.contains("star")) return;

    const parent = e.target.parentElement;
    const index = parent.getAttribute("data-index");

    const value = Number(e.target.getAttribute("data-value"));
    document.getElementById(`rating-${index}`).value = value;

    [...parent.children].forEach(star => {
        let v = Number(star.getAttribute("data-value"));
        star.classList.toggle("active", v <= value);
    });
});


document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('searchBox').addEventListener('input', handleSearch);
    loadWorkjobs();
});