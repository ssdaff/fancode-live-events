document.addEventListener('DOMContentLoaded', () => {
    const matchesGrid = document.getElementById('matches-grid');
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    let allMatchesData = [];

    fetch('fancode.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            allMatchesData = data.matches;
            
            renderMatches(allMatchesData);
            updateFilterCounts();
            setupFilterListeners();
        })
        .catch(error => {
            console.error('Error fetching match data:', error);
            matchesGrid.innerHTML = '<p>Could not load match data. Please try again later.</p>';
        });

    function renderMatches(matches) {
        matchesGrid.innerHTML = ''; 
        
        if (!matches || matches.length === 0) {
            matchesGrid.innerHTML = '<p>No matches found for this filter.</p>';
            return;
        }

        matches.forEach(match => {
            const card = document.createElement('div');
            card.className = 'match-card';
            
            let watchOptionsHTML = '';
            if (match.dai_url && match.adfree_url) {
                // --- মূল পরিবর্তন এখানে ---
                // এখন লিঙ্কে player.html থাকছে না, সরাসরি M3U8 লিঙ্ক ব্যবহার করা হচ্ছে
                const adUrl = match.dai_url;
                const adFreeUrl = match.adfree_url;
                // --------------------------

                watchOptionsHTML = `
                    <div class="watch-options">
                        <a href="${adUrl}" target="_blank" class="watch-btn">Ad</a>
                        <a href="${adFreeUrl}" target="_blank" class="watch-btn">Ad-free 2</a>
                    </div>
                `;
            }

            card.innerHTML = `
                <div class="thumbnail-container">
                    <img src="${match.src}" alt="${match.match_name}" class="thumbnail">
                    <span class="status-badge ${match.status.toLowerCase()}">${match.status}</span>
                </div>
                <div class="card-content">
                    <h2 class="tournament-title">${match.event_name}</h2>
                    <p class="match-info">${match.match_name}</p>
                    <p class="start-time">Start: ${match.startTime}</p>
                </div>
                ${watchOptionsHTML}
            `;
            matchesGrid.appendChild(card);
        });
    }

    function updateFilterCounts() {
        const liveCount = allMatchesData.filter(match => match.status === 'LIVE').length;
        const upcomingCount = allMatchesData.filter(match => match.status === 'UPCOMING').length;
        
        document.getElementById('all-count').textContent = allMatchesData.length;
        document.getElementById('live-count').textContent = liveCount;
        document.getElementById('upcoming-count').textContent = upcomingCount;
    }

    function setupFilterListeners() {
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');

                const filterValue = button.dataset.filter;
                let filteredMatches;

                if (filterValue === 'all') {
                    filteredMatches = allMatchesData;
                } else {
                    filteredMatches = allMatchesData.filter(match => match.status === filterValue);
                }
                
                renderMatches(filteredMatches);
            });
        });
    }
});