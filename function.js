// Initialize Plyr
const player = new Plyr('#stream', {
  controls: ['play', 'progress', 'current-time', 'mute', 'volume', 'settings', 'fullscreen'],
  settings: ['quality'],
  autoplay: true // Added autoplay option
});

// Function to load the stream
function loadStream(url) {
  if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(url);
      hls.attachMedia(player.media);

      hls.on(Hls.Events.MANIFEST_PARSED, function (event, data) {
          // Get available quality levels
          const availableQualities = hls.levels.map(level => level.height);
          availableQualities.sort((a, b) => b - a); // Sort quality levels in descending order

          // Remove duplicates
          const uniqueQualities = [...new Set(availableQualities)];

          // Update the player's quality options
          player.quality = {
              default: uniqueQualities[0], // Default to the highest quality
              options: uniqueQualities,
              forced: true,
              onChange: quality => updateQuality(hls, quality)
          };

          // Trigger Plyr to update settings menu
          player.config.controls.includes('settings') && player.config.settings.includes('quality') && player.setControls();
      });

      hls.on(Hls.Events.LEVEL_SWITCHED, function(event, data) {
          const quality = hls.levels[data.level].height;
          player.quality = quality; // Update Plyr's quality indicator
      });
      
      player.play(); // Play the video automatically
  } else if (player.media.canPlayType('application/vnd.apple.mpegurl')) {
      player.source = {
          type: 'video',
          sources: [
              {
                  src: url,
                  type: 'application/vnd.apple.mpegurl',
              },
          ],
      };
      player.play(); // Play the video automatically
  }
}

// Function to update quality
function updateQuality(hls, quality) {
  const level = hls.levels.findIndex(level => level.height === quality);
  hls.currentLevel = level;
}

// Stream URLs
const stream1Url = 'https://ythls.armelin.one/channel/UCATUkaOHwO9EP_W87zCiPbA.m3u8';
const stream2Url = 'https://d1g8wgjurz8via.cloudfront.net/bpk-tv/Zeecinemalu1/default/zeecinemalu1.m3u8';
const stream3Url = 'https://ythls.armelin.one/channel/UCxHoBXkY88Tb8z1Ssj6CWsQ.m3u8';
const stream4Url = 'https://ythls.armelin.one/channel/UCN6sm8iHiPd0cnoUardDAnw.m3u8';

// Load the initial stream (stream 1 by default)
loadStream(stream1Url);

// Button click handlers
document.getElementById('stream1Button').addEventListener('click', function () {
  loadStream(stream1Url);
});

document.getElementById('stream2Button').addEventListener('click', function () {
  loadStream(stream2Url);
});

document.getElementById('stream3Button').addEventListener('click', function () {
  loadStream(stream3Url);
});

document.getElementById('stream4Button').addEventListener('click', function () {
  loadStream(stream4Url);
});
