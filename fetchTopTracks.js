const API_KEY = '72cc14b830030d6fd7e276ff838c00f4'; // Your Last.fm API key

// Function to fetch the duration and playcount for each track and calculate total listens
async function fetchTrackDetails(artist, track) {
    const url = `https://ws.audioscrobbler.com/2.0/?method=track.getInfo&api_key=${API_KEY}&artist=${artist}&track=${track}&format=json`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.track) {
            const trackDurationMs = data.track.duration; // Duration in milliseconds
            const playcount = data.track.playcount;

            // Convert duration from milliseconds to seconds
            const trackDurationSec = trackDurationMs / 1000; // Convert to seconds

            // Calculate total listens (duration * playcount)
            const totalListens = trackDurationSec * playcount; // Now in seconds

            return { totalListens, trackDurationSec, playcount };
        } else {
            console.error("Track not found.");
            return null;
        }
    } catch (error) {
        console.error("Error fetching track details:", error);
        return null;
    }
}

// Function to display the top tracks
async function displayTopTracks() {
    const user = 'rj'; // Example user
    const url = `https://ws.audioscrobbler.com/2.0/?method=user.getTopTracks&user=${user}&api_key=${API_KEY}&format=json&limit=3`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        const trackListContainer = document.getElementById('track-list');
        trackListContainer.innerHTML = ''; // Clear previous tracks

        if (data.toptracks) {
            const tracks = data.toptracks.track;

            for (let track of tracks) {
                const { name, playcount, artist } = track;
                const artistName = artist.name;

                // Fetch track details (duration and total listens)
                const trackDetails = await fetchTrackDetails(artistName, name);

                if (trackDetails) {
                    // Create a new element for each track
                    const trackElement = document.createElement('div');
                    trackElement.classList.add('track');

                    trackElement.innerHTML = `
                        <h3>${name}</h3>
                        <p><strong>Artist:</strong> ${artistName}</p>
                        <p><strong>Playcount:</strong> ${playcount}</p>
                        <p><strong>Duration (seconds):</strong> ${trackDetails.trackDurationSec}</p>
                        <p><strong>Total Listens (in seconds):</strong> ${trackDetails.totalListens}</p>
                        <p><strong>Total Listens (in minutes):</strong> ${(trackDetails.totalListens / 60).toFixed(2)}</p>
                    `;

                    // Append the track element to the track list container
                    trackListContainer.appendChild(trackElement);
                }
            }
        } else {
            console.error("No tracks found.");
        }
    } catch (error) {
        console.error("Error fetching top tracks:", error);
    }
}

// Attach the displayTopTracks function to the button click event
document.getElementById('get-top-tracks').addEventListener('click', displayTopTracks);
