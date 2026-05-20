import React, { useEffect, useRef, useState } from 'react';
import styles from './ProjectMap.module.css';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import geoData from '../../data/mygeodata/all_projects.json';

// Fix Leaflet default icon paths in Webpack environments
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Dynamic color hashing engine
const getColorByStatus = (status) => {
    const cleanStatus = String(status).toLowerCase().trim();
    
    if (cleanStatus === 'generation') return '#10b981';           
    if (cleanStatus === 'under construction') return '#f59e0b';    
    if (cleanStatus === 'testing and commisioning') return '#06b6d4'; 
    if (cleanStatus === 'ppa stage') return '#3b82f6';             
    if (cleanStatus === 'unspecified') return '#94a3b8';           

    let hash = 0;
    for (let i = 0; i < cleanStatus.length; i++) {
        hash = cleanStatus.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    const hue = Math.abs(hash) % 360;
    return `hsl(${hue}, 75%, 50%)`;
};

const ProjectMap = () => {
    const mapContainerRef = useRef(null);
    const mapRef = useRef(null);
    const [mapLoaded, setMapLoaded] = useState(false);

    useEffect(() => {
        if (!mapContainerRef.current) return;

        if (!mapRef.current) {
            mapRef.current = L.map(mapContainerRef.current, {
                center: [28.3949, 84.1240], // Default center (Nepal)
                zoom: 7,
                scrollWheelZoom: false,
                zoomControl: false
            });

            // 1. DEFINE BASEMAP VARIANT TILES
            const googleSat = L.tileLayer('http://mt0.google.com/vt/lyrs=s&hl=en&x={x}&y={y}&z={z}', {
                maxZoom: 20,
                attribution: 'Map data &copy; <a href="https://www.google.com/maps">Google Maps</a>'
            }).addTo(mapRef.current); // Added by default

            const osmStandard = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 19,
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            });

            const googleTerrain = L.tileLayer('http://mt0.google.com/vt/lyrs=p&hl=en&x={x}&y={y}&z={z}', {
                maxZoom: 20,
                attribution: 'Map data &copy; <a href="https://www.google.com/maps">Google Maps</a>'
            });

            const googleHybrid = L.tileLayer('http://mt0.google.com/vt/lyrs=y&hl=en&x={x}&y={y}&z={z}', {
                maxZoom: 20,
                attribution: 'Map data &copy; <a href="https://www.google.com/maps">Google Maps</a>'
            });

            // Set up radio button menu dictionary
            const baseMaps = { 
                "Google Satellite": googleSat,
                "Google Hybrid": googleHybrid,
                "Google Terrain": googleTerrain,
                "OpenStreetMap": osmStandard
            };
            
            const filterLayers = {}; 

            // Tooltip template engine
            const onEachFeature = (feature, layer) => {
                if (feature.properties && feature.properties.description) {
                    const popupContent = `<div class="${styles.customPopup}">${feature.properties.description}</div>`;
                    layer.options.interactive = true;
                    layer.bindTooltip(popupContent, { sticky: true, opacity: 1, direction: 'auto' });
                }
            };

            // DYNAMIC STATUS PARSING ENGINE
            const featuresGroupedByStatus = {};

            if (geoData && geoData.features) {
                geoData.features.forEach(feature => {
                    if (feature.geometry && feature.geometry.type === 'Point') {
                        const coords = feature.geometry.coordinates;
                        if (coords && coords[0] === 0 && coords[1] === 0) return;
                    }

                    let statusName = 'Unspecified';
                    const description = feature.properties?.description;

                    if (description) {
                        const match = description.match(/Status:<\/b>\s*([^<]+)/i);
                        if (match && match[1] && match[1].trim() !== "") {
                            statusName = match[1].trim();
                        }
                    }

                    if (!featuresGroupedByStatus[statusName]) {
                        featuresGroupedByStatus[statusName] = [];
                    }
                    featuresGroupedByStatus[statusName].push(feature);
                });
            }

            // BUILD INDIVIDUAL GEOJSON FILTER LAYERS DYNAMICALLY
            Object.keys(featuresGroupedByStatus).forEach(status => {
                const statusColor = getColorByStatus(status);

                const statusGeoJsonLayer = L.geoJSON(featuresGroupedByStatus[status], {
                    style: {
                        color: statusColor,
                        weight: 2,
                        opacity: 1,
                        fillColor: statusColor,
                        fillOpacity: 0.4,
                        interactive: true
                    },
                    pointToLayer: (feature, latlng) => {
                        return L.circleMarker(latlng, {
                            radius: 6,
                            fillColor: statusColor,
                            color: "#fff",
                            weight: 2,
                            opacity: 1,
                            fillOpacity: 0.8,
                            interactive: true
                        });
                    },
                    onEachFeature
                }).addTo(mapRef.current);

                filterLayers[status] = statusGeoJsonLayer;
            });

            // Initialize control layers panel synchronously including new base maps choices
            const layersControl = L.control.layers(baseMaps, filterLayers, { 
                collapsed: true, 
                position: 'topleft' 
            }).addTo(mapRef.current);

            let nepalLayerBounds = null;

            // Custom Zoom to Fit Control
            const ZoomToFitControl = L.Control.extend({
                options: { position: 'topright' },
                onAdd: function() {
                    const container = L.DomUtil.create('div', 'leaflet-bar leaflet-control');
                    const button = L.DomUtil.create('a', '', container);
                    button.innerHTML = '<i class="fas fa-expand"></i>';
                    button.href = '#';
                    button.title = 'Zoom to fit Nepal';
                    button.role = 'button';
                    button.style.display = 'flex';
                    button.style.alignItems = 'center';
                    button.style.justifyContent = 'center';
                    button.style.color = '#2d3748';
                    button.style.fontSize = '14px';

                    L.DomEvent.disableClickPropagation(button);
                    L.DomEvent.on(button, 'click', function(e) {
                        L.DomEvent.preventDefault(e);
                        if (nepalLayerBounds) {
                            mapRef.current.fitBounds(nepalLayerBounds, { padding: [20, 20], maxZoom: 12 });
                        } else {
                            const firstKey = Object.keys(filterLayers)[0];
                            if (firstKey) {
                                mapRef.current.fitBounds(filterLayers[firstKey].getBounds(), { padding: [20, 20], maxZoom: 12 });
                            }
                        }
                    });

                    return container;
                }
            });
            new ZoomToFitControl().addTo(mapRef.current);

            // Fetch Nepal Outline Asynchronously
            fetch('/nepal_outline.geojson')
                .then(res => res.json())
                .then(nepalData => {
                    const nepalLayer = L.geoJSON(nepalData, {
                        style: {
                            color: '#000000',
                            weight: 3,
                            opacity: 0.6,
                            fillColor: 'transparent',
                            interactive: false
                        }
                    }).addTo(mapRef.current);

                    nepalLayer.bringToBack();
                    
                    layersControl.addOverlay(nepalLayer, "Nepal Outline");

                    nepalLayerBounds = nepalLayer.getBounds();
                    mapRef.current.fitBounds(nepalLayerBounds, { padding: [20, 20], maxZoom: 12 });
                    setMapLoaded(true);
                })
                .catch(err => {
                    console.error("Error loading Nepal Outline Layer", err);
                    const keys = Object.keys(filterLayers);
                    if (keys.length > 0) {
                        const temporaryGroup = L.featureGroup(Object.values(filterLayers));
                        mapRef.current.fitBounds(temporaryGroup.getBounds(), { padding: [20, 20] });
                    }
                    setMapLoaded(true);
                });
        }

        return () => {
            if (mapRef.current) {
                mapRef.current.remove();
                mapRef.current = null;
            }
        };
    }, []);

    const enableScrollZoom = () => {
        if (mapRef.current) {
            mapRef.current.scrollWheelZoom.enable();
        }
    };

    return (
        <section className={styles.mapSection} id="project-map">
            <div className={styles.container}>
                <div className={styles.sectionHeader}>
                    <h2>Hydropower Footprint</h2>
                    <div className={styles.line}></div>
                    <p className={styles.subtitle}>Explore our nationwide presence across Nepal categorized dynamically by operational status.</p>
                </div>

                <div className={styles.mapWrapper} onClick={enableScrollZoom} onMouseLeave={() => mapRef.current?.scrollWheelZoom.disable()}>
                    <div className={styles.mapOverlayHint} style={{ display: mapLoaded ? 'none' : 'flex' }}>
                        <span>Loading Map...</span>
                    </div>
                    <div ref={mapContainerRef} className={styles.mapContainer}></div>
                    <div className={styles.interactionHint}>
                        Click on the map to enable scroll-to-zoom
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ProjectMap;