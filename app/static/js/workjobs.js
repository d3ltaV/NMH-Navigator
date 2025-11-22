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
            html += '<div class="workjob-info" style="margin-top: 10px; font-style: italic;"><strong>Note:</strong> ' + job.notes + '</div>';
        }
        html += `<div class="add-review">
            <input type="number" min="1" max="5" placeholder="Rating (1-5)" id="rating-${i}">
            <textarea placeholder="Write your review..." id="review-${i}"></textarea>
            <button onclick="submitReview('${job.name}', ${i})">Submit Review</button>
         </div>
         <div id="reviews-${i}" class="reviews-container"></div>`;

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
                    html += `<div class="review-card">
                                <div><strong>User:</strong> ${r.user_id}</div>
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
        } else {
            alert("Failed to add review. Are you logged in?");
        }
    });
}

