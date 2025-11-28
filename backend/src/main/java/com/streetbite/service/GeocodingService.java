package com.streetbite.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.streetbite.model.GeocodeCache;
import com.streetbite.repository.GeocodeCacheRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Optional;

@Service
public class GeocodingService {

    @Autowired
    private GeocodeCacheRepository geocodeCacheRepository;

    private final RestTemplate rest = new RestTemplate();
    private final ObjectMapper mapper = new ObjectMapper();

    @Value("${google.geocoding.api.key:}")
    private String googleApiKey;

    @Cacheable(value = "geocodingCache", key = "#address.toLowerCase().trim()")
    public LatLng geocodeAddressOnce(String address) {
        String normalizedAddress = address.toLowerCase().trim();

        // 1. Check MySQL Cache
        Optional<GeocodeCache> cached = geocodeCacheRepository.findByAddress(normalizedAddress);
        if (cached.isPresent()) {
            return new LatLng(cached.get().getLatitude(), cached.get().getLongitude());
        }

        // 2. Google API
        if (googleApiKey != null && !googleApiKey.isEmpty() && !googleApiKey.equals("api_key")) {
            try {
                String url = "https://maps.googleapis.com/maps/api/geocode/json?address={address}&key={key}";
                ResponseEntity<String> resp = rest.getForEntity(url, String.class, normalizedAddress, googleApiKey);

                JsonNode root = mapper.readTree(resp.getBody());
                if ("OK".equals(root.path("status").asText())) {
                    JsonNode loc = root.path("results").get(0).path("geometry").path("location");
                    double lat = loc.path("lat").asDouble();
                    double lng = loc.path("lng").asDouble();

                    saveToCache(normalizedAddress, lat, lng);
                    return new LatLng(lat, lng);
                }
            } catch (Exception e) {
                System.err.println("Geocoding API failed: " + e.getMessage());
            }
        }

        // 3. Fallback (Deterministic fake location)
        return fallbackGeocode(normalizedAddress);
    }

    private LatLng fallbackGeocode(String address) {

        double baseLat = 19.9975;
        double baseLng = 73.7898;
        int hash = address.hashCode();
        double lat = baseLat + (hash % 100) * 0.001;
        double lng = baseLng + ((hash / 100) % 100) * 0.001;

        saveToCache(address, lat, lng);
        return new LatLng(lat, lng);
    }

    private void saveToCache(String address, double lat, double lng) {
        GeocodeCache cache = new GeocodeCache();
        cache.setAddress(address);
        cache.setLatitude(lat);
        cache.setLongitude(lng);
        geocodeCacheRepository.save(cache);
    }

    public static class LatLng {
        public final double lat;
        public final double lng;

        public LatLng(double lat, double lng) {
            this.lat = lat;
            this.lng = lng;
        }
    }
}
