<template>
  <div class="map-container">
    <div id="protest-map" style="height: 500px; width: 100%; border-radius: 8px;"></div>
    <div class="map-controls">
      <button @click="filterProtests('all')" class="map-filter-btn" :class="{ active: currentFilter === 'all' }">Tümü</button>
      <button @click="filterProtests('ongoing')" class="map-filter-btn" :class="{ active: currentFilter === 'ongoing' }">Devam Eden</button>
      <button @click="filterProtests('planned')" class="map-filter-btn" :class="{ active: currentFilter === 'planned' }">Planlanmış</button>
    </div>
    <div class="map-legend">
      <div class="map-legend-item ongoing">Devam Eden Eylemler</div>
      <div class="map-legend-item planned">Planlanmış Eylemler</div>
      <div class="map-legend-item multiple">Çoklu Eylemler</div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      map: null,
      markerLayer: null,
      currentFilter: 'all',
      protests: [
        {
          id: 1,
          name: "Freedom Square Demonstration",
          location: [41.0082, 28.9784], // Istanbul coordinates
          status: "ongoing",
          date: "2025-03-23",
          details: "Large scale peaceful demonstration for civil liberties.",
          time: "14:00 - 18:00",
          dateObj: new Date("2025-03-23T14:00:00")
        },
        {
          id: 2,
          name: "Workers' Rights Rally",
          location: [39.9334, 32.8597], // Ankara coordinates
          status: "ongoing",
          date: "2025-03-23",
          details: "Labor union organized demonstration.",
          time: "12:00 - 16:00",
          dateObj: new Date("2025-03-23T12:00:00")
        },
        {
          id: 3,
          name: "Student March",
          location: [38.4237, 27.1428], // Izmir coordinates
          status: "planned",
          date: "2025-03-25",
          details: "University students protesting education policy changes.",
          time: "15:00 - 17:00",
          dateObj: new Date("2025-03-25T15:00:00")
        },
        {
          id: 4,
          name: "Environmental Protection Rally",
          location: [37.0000, 35.3213], // Adana coordinates
          status: "planned",
          date: "2025-03-26",
          details: "Demonstration against industrial pollution.",
          time: "13:00 - 17:00",
          dateObj: new Date("2025-03-26T13:00:00")
        },
        {
          id: 5,
          name: "Second Izmir Student Protest",
          location: [38.4237, 27.1428], // Izmir coordinates
          status: "planned",
          date: "2025-03-26",
          details: "Additional student demonstration.",
          time: "16:00 - 18:00",
          dateObj: new Date("2025-03-26T16:00:00")
        },
        {
          id: 6,
          name: "Digital Rights March",
          location: [41.0082, 28.9784], // Istanbul coordinates
          status: "planned",
          date: "2025-03-25",
          details: "Demonstration for digital rights and internet freedom.",
          time: "15:00 - 17:00",
          dateObj: new Date("2025-03-25T15:00:00")
        },
        {
          id: 7,
          name: "Teachers' Rights Rally",
          location: [39.9334, 32.8597], // Ankara coordinates
          status: "planned",
          date: "2025-03-25",
          details: "Teachers gathering for better working conditions.",
          time: "15:00 - 17:00",
          dateObj: new Date("2025-03-25T15:00:00")
        }
      ]
    };
  },
  mounted() {
    // Only run on client-side
    if (typeof window !== 'undefined') {
      this.loadLeaflet();
    }
  },
  methods: {
    loadLeaflet() {
      // Add the CSS if not already added
      if (!document.getElementById('leaflet-css')) {
        const link = document.createElement('link');
        link.id = 'leaflet-css';
        link.rel = 'stylesheet';
        link.href = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.css';
        document.head.appendChild(link);
      }

      // Create a script element to load Leaflet
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.js';
      script.onload = () => {
        // After Leaflet is loaded, initialize the map
        this.initMap(window.L);
      };
      script.onerror = (err) => {
        console.error('Error loading Leaflet script:', err);
      };
      document.head.appendChild(script);
    },
    
    initMap(L) {
      // Check if map element exists and L is defined
      if (!document.getElementById('protest-map') || !L) {
        console.error('Map element or Leaflet not available');
        return;
      }
      
      // Initialize the map centered on Turkey
      this.map = L.map('protest-map').setView([39.0, 35.0], 6);

      // Add OSM tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap contributors'
      }).addTo(this.map);

      // Create a marker layer group
      this.markerLayer = L.layerGroup().addTo(this.map);
      
      // Add zoom animation handlers
      this.map.on('zoomstart', this.handleZoomStart);
      this.map.on('zoomend', this.handleZoomEnd);
      
      // Initial render of markers
      this.renderMarkers(L);
    },
    
    handleZoomStart() {
      // Add zoom-out animation to all markers
      const markers = document.querySelectorAll('.custom-div-icon div');
      markers.forEach(marker => {
        marker.classList.add('zoom-animation');
      });
    },
    
    handleZoomEnd() {
      // Remove animation class after zoom is complete
      setTimeout(() => {
        const markers = document.querySelectorAll('.custom-div-icon div');
        markers.forEach(marker => {
          marker.classList.remove('zoom-animation');
        });
      }, 300);
    },
    
    renderMarkers(L) {
      // Clear existing markers
      this.markerLayer.clearLayers();
      
      let filteredProtests = [...this.protests];
      
      // Apply filter if not 'all'
      if (this.currentFilter !== 'all') {
        filteredProtests = this.protests.filter(p => p.status === this.currentFilter);
      }
      
      // Group by location
      const locationGroups = this.groupProtestsByLocation(filteredProtests);
      
      // Group by date and time (for same time events)
      const timeGroups = this.groupProtestsByTime(filteredProtests);
      
      // Create location markers
      this.createLocationMarkers(L, locationGroups);
      
      // Create time cluster markers
      this.createTimeClusterMarkers(L, timeGroups);
    },
    
    createLocationMarkers(L, locationGroups) {
      Object.keys(locationGroups).forEach(locationKey => {
        const locationProtests = locationGroups[locationKey];
        const location = locationProtests[0].location;
        
        // Determine marker size based on number of protests
        const baseSize = 16;
        const sizeMultiplier = Math.min(locationProtests.length * 8, 48); // Max size of 48px
        const markerSize = baseSize + sizeMultiplier;
        
        // Determine overall status (prioritize ongoing)
        const status = locationProtests.some(p => p.status === 'ongoing') ? 'ongoing' : 'planned';
        
        const icon = this.createDynamicIcon(L, status, markerSize, locationProtests.length);
        
        const marker = L.marker(location, { icon: icon }).addTo(this.markerLayer);
        
        // Create popup content with all protests at this location
        const popupContent = this.createPopupContent(locationProtests);
        
        marker.bindPopup(popupContent);
        
        // Add hover effect
        marker.on('mouseover', function(e) {
          const iconElement = e.target._icon.querySelector('div');
          iconElement.classList.add('hover-effect');
        });
        
        marker.on('mouseout', function(e) {
          const iconElement = e.target._icon.querySelector('div');
          iconElement.classList.remove('hover-effect');
        });
      });
    },
    
    createTimeClusterMarkers(L, timeGroups) {
      Object.keys(timeGroups).forEach(timeKey => {
        const timeProtests = timeGroups[timeKey];
        
        // Skip if less than 2 protests at the same time or they're at the same location
        if (timeProtests.length < 2) return;
        
        // Check if these protests are at different locations
        const uniqueLocations = new Set(timeProtests.map(p => this.locationToKey(p.location)));
        if (uniqueLocations.size < 2) return;
        
        // Calculate center point for all protests happening at the same time
        const centerLocation = this.calculateCenterPoint(timeProtests.map(p => p.location));
        
        // Create a special cluster marker showing simultaneous events
        const markerSize = 40; // Fixed size for time clusters
        
        const icon = L.divIcon({
          className: 'custom-div-icon time-cluster',
          html: `<div style='background-color:#9b59b6; width:${markerSize}px; height:${markerSize}px; 
                 border-radius:50%; border:2px solid white; display:flex; 
                 justify-content:center; align-items:center; font-weight:bold; 
                 color:white; font-size:${markerSize/2}px;'>${timeProtests.length}</div>`,
          iconSize: [markerSize, markerSize],
          iconAnchor: [markerSize/2, markerSize/2]
        });
        
        const marker = L.marker(centerLocation, { icon: icon }).addTo(this.markerLayer);
        
        // Create popup content showing all simultaneous events
        const popupContent = `
          <div class="protest-popup time-cluster-popup">
            <h3>Aynı Saatte Gerçekleşen Eylemler</h3>
            <p><strong>Tarih:</strong> ${timeProtests[0].date}</p>
            <p><strong>Saat:</strong> ${timeProtests[0].time}</p>
            <hr>
            ${timeProtests.map(protest => `
              <div class="protest-details">
                <p><strong>${protest.name}</strong> (${this.getLocationName(protest.location)})</p>
                <p><strong>Durum:</strong> ${protest.status === 'ongoing' ? 'Devam Ediyor' : 'Planlanmış'}</p>
                <p>${protest.details}</p>
              </div>
            `).join('<hr>')}
          </div>
        `;
        
        marker.bindPopup(popupContent);
        
        // Add hover and pulse effect
        marker.on('mouseover', function(e) {
          const iconElement = e.target._icon.querySelector('div');
          iconElement.classList.add('pulse-effect');
        });
        
        marker.on('mouseout', function(e) {
          const iconElement = e.target._icon.querySelector('div');
          iconElement.classList.remove('pulse-effect');
        });
      });
    },
    
    createDynamicIcon(L, status, size, count) {
      let color;
      if (count > 1) {
        color = '#3498db'; // Multiple protests at same location
      } else {
        color = status === 'ongoing' ? '#c00' : '#F4D03F';
      }
      
      return L.divIcon({
        className: 'custom-div-icon',
        html: `<div style='background-color:${color}; 
              width:${size}px; height:${size}px; border-radius:50%; 
              border:2px solid white; 
              display:flex; 
              justify-content:center; 
              align-items:center;
              font-weight:bold;
              color:white;
              font-size:${size/2}px;'>${count}</div>`,
        iconSize: [size, size],
        iconAnchor: [size/2, size/2]
      });
    },
    
    createPopupContent(protests) {
      return `
        <div class="protest-popup">
          <h3>${protests.length > 1 ? 'Bu Konumdaki Eylemler' : 'Eylem Detayları'}</h3>
          ${protests.map(protest => `
            <div class="protest-details">
              <p><strong>${protest.name}</strong></p>
              <p><strong>Durum:</strong> ${protest.status === 'ongoing' ? 'Devam Ediyor' : 'Planlanmış'}</p>
              <p><strong>Tarih:</strong> ${protest.date}</p>
              <p><strong>Saat:</strong> ${protest.time}</p>
              <p>${protest.details}</p>
            </div>
          `).join('<hr>')}
        </div>
      `;
    },
    
    groupProtestsByLocation(protests) {
      const protestMap = {};
      protests.forEach(protest => {
        const key = this.locationToKey(protest.location);
        if (!protestMap[key]) {
          protestMap[key] = [];
        }
        protestMap[key].push(protest);
      });
      return protestMap;
    },
    
    groupProtestsByTime(protests) {
      const timeMap = {};
      protests.forEach(protest => {
        // Create a unique key for date and time
        const timeKey = `${protest.date}-${protest.time}`;
        if (!timeMap[timeKey]) {
          timeMap[timeKey] = [];
        }
        timeMap[timeKey].push(protest);
      });
      return timeMap;
    },
    
    locationToKey(location) {
      // Round coordinates to reduce precision and group nearby protests
      return `${location[0].toFixed(2)},${location[1].toFixed(2)}`;
    },
    
    calculateCenterPoint(locations) {
      // Simple average calculation for center point
      const lat = locations.reduce((sum, loc) => sum + loc[0], 0) / locations.length;
      const lng = locations.reduce((sum, loc) => sum + loc[1], 0) / locations.length;
      return [lat, lng];
    },
    
    getLocationName(location) {
      // Map coordinates to city names (simplified)
      const cityMap = {
        '41.01,28.98': 'İstanbul',
        '39.93,32.86': 'Ankara',
        '38.42,27.14': 'İzmir',
        '37.00,35.32': 'Adana'
      };
      
      const key = this.locationToKey(location);
      return cityMap[key] || `${location[0].toFixed(2)}, ${location[1].toFixed(2)}`;
    },
    
    filterProtests(filter) {
      this.currentFilter = filter;
      if (this.map && window.L) {
        this.renderMarkers(window.L);
      }
    }
  }
};
</script>

<style>
.map-container {
  margin-bottom: 2rem;
}

.map-controls {
  display: flex;
  margin: 1rem 0;
  gap: 0.5rem;
}

.map-filter-btn {
  padding: 0.5rem 1rem;
  background-color: #f0f0f0;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s;
}

.map-filter-btn:hover {
  background-color: #e0e0e0;
}

.map-filter-btn.active {
  background-color: var(--vp-c-brand);
  color: white;
  border-color: var(--vp-c-brand);
}

.map-legend {
  display: flex;
  flex-wrap: wrap;
  margin-top: 1rem;
  background-color: rgba(255, 255, 255, 0.8);
  padding: 0.5rem 1rem;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.map-legend-item {
  display: inline-flex;
  align-items: center;
  margin-right: 20px;
  margin-bottom: 10px;
  font-size: 0.9rem;
}

.map-legend-item:before {
  content: '';
  display: inline-block;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  margin-right: 8px;
  border: 2px solid white;
  box-shadow: 0 0 0 1px rgba(0,0,0,0.2);
}

.map-legend-item.ongoing:before {
  background-color: #c00;
}

.map-legend-item.planned:before {
  background-color: #F4D03F;
}

.map-legend-item.multiple:before {
  background-color: #3498db;
}

/* Map popup styling */
.protest-popup {
  min-width: 250px;
  max-height: 350px;
  overflow-y: auto;
}

.protest-popup h3 {
  margin: 0 0 10px 0;
  color: #e63946;
  font-size: 16px;
}

.protest-popup p {
  margin: 5px 0;
  font-size: 14px;
}

.time-cluster-popup h3 {
  color: #9b59b6;
}

/* Marker animations */
.custom-div-icon {
  transition: transform 0.3s ease-in-out;
  transform: scale(0);
  animation: scaleUp 0.3s forwards;
}

.custom-div-icon div {
  transition: all 0.3s;
}

.custom-div-icon div.hover-effect {
  transform: scale(1.1);
  box-shadow: 0 0 15px rgba(255, 255, 255, 0.8);
}

.custom-div-icon div.zoom-animation {
  animation: zoomPulse 0.3s ease-in-out;
}

.time-cluster div.pulse-effect {
  animation: pulsate 1.5s ease-in-out infinite;
}

@keyframes scaleUp {
  to {
    transform: scale(1);
  }
}

@keyframes zoomPulse {
  0% { transform: scale(1); }
  50% { transform: scale(0.8); }
  100% { transform: scale(1); }
}

@keyframes pulsate {
  0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(155, 89, 182, 0.7); }
  50% { transform: scale(1.1); box-shadow: 0 0 0 10px rgba(155, 89, 182, 0); }
  100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(155, 89, 182, 0); }
}
</style>