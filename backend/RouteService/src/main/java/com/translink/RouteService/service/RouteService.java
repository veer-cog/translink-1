//package com.translink.RouteService.service;
//
//import com.google.maps.DistanceMatrixApi;
//import com.google.maps.GeoApiContext;
//import com.google.maps.model.DistanceMatrix;
//import com.google.maps.model.TravelMode;
//import com.translink.RouteService.dto.RouteDTO;
//import com.translink.RouteService.dto.RouteRequest;
//import com.translink.RouteService.model.Route;
//import com.translink.RouteService.repository.RouteRepository;
//import lombok.RequiredArgsConstructor;
//import lombok.extern.slf4j.Slf4j;
//import org.springframework.stereotype.Service;
//
//import java.util.ArrayList;
//import java.util.List;
//import java.util.Map;
//import java.util.UUID;
//
//@Service
//@RequiredArgsConstructor
//@Slf4j
//public class RouteService {
//
//    private final RouteRepository routeRepository;
//    private final GeoApiContext geoContext;
//
////    private static final Map<String, double[]> HUB_COORDINATES = Map.of(
////            "MUMBAI", new double[]{19.0760, 72.8777},
////            "PUNE",   new double[]{18.5204, 73.8567},
////            "DELHI",  new double[]{28.6139, 77.2090}
////    );
//
////    public RouteDTO generateRoute(RouteRequest request, String userId, String companyId) {
////        RouteDTO dto = new RouteDTO();
////        dto.setVehicleID(request.getVehicleId().toString());
////
////        List<RouteDTO.StopDTO> stopDetails = new ArrayList<>();
////
////        for (String name : request.getStopNames()) {
////            RouteDTO.StopDTO stop = new RouteDTO.StopDTO();
////            stop.setName(name);
////
////            double[] coords = HUB_COORDINATES.entrySet().stream()
////                    .filter(entry -> name.toUpperCase().contains(entry.getKey()))
////                    .map(Map.Entry::getValue)
////                    .findFirst()
////                    .orElse(new double[]{0.0, 0.0});
////
////            stop.setLat(coords[0]);
////            stop.setLng(coords[1]);
////            stopDetails.add(stop);
////        }
////        dto.setStops(stopDetails);
////
////        // Calculate Metrics
////        double duration = stopDetails.size() * 2.5;
////        float distance = stopDetails.size() * 60.0f;
////
////        dto.setTotalDuration(duration);
////        dto.setTotalDistance(distance);
////
////        // Build and Save Entity
////        Route entity = Route.builder()
////                .id(UUID.randomUUID().toString())
////                .vehicleID(request.getVehicleId().toString())
////                .companyId(companyId)
////                .createdById(userId)
////                .stops(String.join(", ", request.getStopNames()))
////                .totalDuration(duration)
////                .totalDistance(distance)
////                .build();
////
////        routeRepository.save(entity);
////        return dto;
////    }
//
//    public RouteDTO generateRoute(RouteRequest request, String userId, String companyId) {
//        // 1. Call Google to get real Distance and Duration
//        Map<String, Double> metrics = calculateGoogleMetrics(request.getStopNames());
//
//        double totalDuration = metrics.get("duration"); // in hours
//        float totalDistance = metrics.get("distance").floatValue(); // in km
//
//        // 2. Prepare the DTO for Postman
//        RouteDTO dto = new RouteDTO();
//        dto.setVehicleID(request.getVehicleId().toString());
//        dto.setTotalDuration(totalDuration);
//        dto.setTotalDistance(totalDistance);
//
//        // Map stop names to the DTO list
//        List<RouteDTO.StopDTO> stops = request.getStopNames().stream().map(name -> {
//            RouteDTO.StopDTO s = new RouteDTO.StopDTO();
//            s.setName(name);
//            return s;
//        }).toList();
//        dto.setStops(stops);
//
//        // 3. Save the Entity to Database
//        Route entity = Route.builder()
//                .id(UUID.randomUUID().toString())
//                .vehicleID(request.getVehicleId().toString())
//                .companyId(companyId)
//                .createdById(userId)
//                .stops(String.join(", ", request.getStopNames()))
//                .totalDuration(totalDuration)
//                .totalDistance(totalDistance)
//                .build();
//
//        routeRepository.save(entity);
//        return dto;
//    }
//
//    private Map<String, Double> calculateGoogleMetrics(List<String> stopNames) {
//        if (stopNames == null || stopNames.size() < 2) return Map.of("distance", 0.0, "duration", 0.0);
//
//        try {
//            String[] stops = stopNames.toArray(new String[0]);
//            DistanceMatrix matrix = DistanceMatrixApi.getDistanceMatrix(geoContext, stops, stops)
//                    .mode(TravelMode.DRIVING)
//                    .await();
//
//            double meters = 0;
//            double seconds = 0;
//
//            for (int i = 0; i < stops.size() - 1; i++) {
//                var element = matrix.rows[i].elements[i + 1];
//                if ("OK".equals(element.status.toString())) {
//                    meters += element.distance.inBytes;
//                    seconds += element.duration.inSeconds;
//                }
//            }
//            return Map.of("distance", meters / 1000.0, "duration", seconds / 3600.0);
//        } catch (Exception e) {
//            log.error("Google API failed, using fallback", e);
//            return Map.of("distance", 0.0, "duration", 0.0);
//        }
//    }
//}
//    public List<Route> getAllRoutes(String vehicleId, String companyId) {
//        if (vehicleId != null) {
//            return routeRepository.findByVehicleIDAndCompanyId(vehicleId, companyId);
//        }
//        return routeRepository.findByCompanyId(companyId);
//    }
//
//    public Route getById(String id) {
//        return routeRepository.findById(id)
//                .orElseThrow(() -> new RuntimeException("Route not found"));
//    }
//
//    public void delete(String id) {
//        routeRepository.deleteById(id);
//    }

package com.translink.RouteService.service;

import com.google.maps.DistanceMatrixApi;
import com.google.maps.GeocodingApi;
import com.google.maps.GeoApiContext;
import com.google.maps.model.DistanceMatrix;
import com.google.maps.model.TravelMode;
import com.translink.RouteService.client.VehicleClient;
import com.translink.RouteService.dto.RouteDTO;
import com.translink.RouteService.dto.RouteRequest;
import com.translink.RouteService.dto.VehicleDTO;
import com.translink.RouteService.exception.ExternalServiceException;
import com.translink.RouteService.model.Route;
import com.translink.RouteService.repository.RouteRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class RouteService {

    private final RouteRepository routeRepository;
    private final GeoApiContext geoContext;
    private final VehicleClient vehicleClient;

    /**
     * Generates a route only if the vehicle exists.
     * Calculates distance, duration, and geocodes stops.
     */
    @Transactional
    public RouteDTO generateRoute(RouteRequest request, String userId, String companyId) {

        // 1. HARD VALIDATION: Check if vehicle exists via Feign
        log.info("[RouteService] Validating vehicle ID: {} for company: {}", request.getVehicleId(), companyId);
        VehicleDTO vehicle;
        try {
            vehicle = vehicleClient.getVehicleById(request.getVehicleId());
        } catch (Exception e) {
            log.error("Failed to reach Vehicle Service: {}", e.getMessage());
            throw new ExternalServiceException("Vehicle validation failed: Service is unreachable.");
        }

        // Fix: If vehicle is null or ID is 0 (from fallback), BLOCK creation
        if (vehicle == null || vehicle.getId() == null) {
            throw new ExternalServiceException("Cannot create route: Vehicle ID " + request.getVehicleId() + " does not exist.");
        }

        // 2. Metrics Calculation (Distance Matrix)
        Map<String, Double> metrics = calculateGoogleMetrics(request.getStopNames());


        // --- ADD CALCULATION HERE ---
        float distance = metrics.get("distance").floatValue();
        double fuelCost = distance * 10.0;
        log.info(String.valueOf(fuelCost));
        // ----------------------------

        // 3. Geocoding (Convert names to Lat/Lng)
        List<RouteDTO.StopDTO> stopDetails = request.getStopNames().stream()
                .map(this::geocodeStop)
                .collect(Collectors.toList());

        // 4. Build and Save Entity
        Route entity = Route.builder()
                .id(UUID.randomUUID().toString())
                .vehicleID(request.getVehicleId().toString())
                .companyId(companyId)
                .createdById(userId)
                .stops(String.join(", ", request.getStopNames()))
                .totalDuration(metrics.get("duration"))
                .totalDistance(metrics.get("distance").floatValue())
                .totalFuelExpense(fuelCost)
                .build();

        routeRepository.save(entity);

        // 5. Build Response
        return RouteDTO.builder()
                .vehicleID(entity.getVehicleID())
                .totalDistance(entity.getTotalDistance())
                .totalDuration(entity.getTotalDuration())
                .totalFuelExpense(fuelCost)
                .stops(stopDetails)
                .build();
    }

    public RouteDTO updateRoute(String id, RouteRequest request, String userId, String companyId) {
        Route existingRoute = routeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Route not found"));

        // SECURITY CHECK: Ensure user's company owns this route
        if (!existingRoute.getCompanyId().equals(companyId)) {
            throw new RuntimeException("Unauthorized: This route does not belong to your company");
        }

        Map<String, Double> metrics = calculateGoogleMetrics(request.getStopNames());
        float distance = metrics.get("distance").floatValue();

        double fuelCost = distance * 10.0;

        existingRoute.setVehicleID(request.getVehicleId().toString());
        existingRoute.setStops(String.join(", ", request.getStopNames()));
        existingRoute.setTotalDuration(metrics.get("duration"));
        existingRoute.setTotalDistance(metrics.get("distance").floatValue());
        existingRoute.setTotalFuelExpense(fuelCost);

        routeRepository.save(existingRoute);
        return mapToDTO(existingRoute, request.getStopNames());
    }

    private RouteDTO mapToDTO(Route route, List<String> stopNames) {
        RouteDTO dto = new RouteDTO();
        dto.setId(route.getId());
        dto.setVehicleID(route.getVehicleID());
        dto.setTotalDuration(route.getTotalDuration());
        dto.setTotalDistance(route.getTotalDistance());
        dto.setTotalFuelExpense(route.getTotalFuelExpense());
        dto.setStops(stopNames.stream().map(name -> {
            RouteDTO.StopDTO s = new RouteDTO.StopDTO();
            s.setName(name);
            return s;
        }).toList());
        return dto;
    }
    /**
     * Helper: Fetches Distance and Duration from Google
     */
    private Map<String, Double> calculateGoogleMetrics(List<String> stopNames) {
        if (stopNames == null || stopNames.size() < 2) {
            return Map.of("distance", 0.0, "duration", 0.0);
        }
        try {
            String[] stops = stopNames.toArray(new String[0]);
            DistanceMatrix matrix = DistanceMatrixApi.getDistanceMatrix(geoContext, stops, stops)
                    .mode(TravelMode.DRIVING)
                    .await();

            double meters = 0;
            double seconds = 0;

            for (int i = 0; i < stopNames.size() - 1; i++) {
                var element = matrix.rows[i].elements[i + 1];
                if ("OK".equals(element.status.toString())) {
                    meters += element.distance.inMeters; // Use inMeters
                    seconds += element.duration.inSeconds;
                }
            }
            return Map.of("distance", meters / 1000.0, "duration", seconds / 3600.0);
        } catch (Exception e) {
            log.error("Google Distance Matrix failed: {}", e.getMessage());
            return Map.of("distance", 0.0, "duration", 0.0);
        }
    }

    /**
     * Helper: Converts a string address to Lat/Lng coordinates
     */
    private RouteDTO.StopDTO geocodeStop(String name) {
        RouteDTO.StopDTO stop = new RouteDTO.StopDTO();
        stop.setName(name);
        try {
            var results = GeocodingApi.geocode(geoContext, name).await();
            if (results.length > 0) {
                stop.setLat(results[0].geometry.location.lat);
                stop.setLng(results[0].geometry.location.lng);
            }
        } catch (Exception e) {
            log.error("Geocoding failed for {}: {}", name, e.getMessage());
        }
        return stop;
    }

    public List<Route> getAllRoutes(String vehicleId, String companyId) {
        if (vehicleId != null) {
            return routeRepository.findByVehicleIDAndCompanyId(vehicleId, companyId);
        }
        return routeRepository.findByCompanyId(companyId);
    }

    public Route getById(String id) {
        return routeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Route not found with id: " + id));
    }

    @Transactional
    public void delete(String id, String companyId) {
        Route route = getById(id);
        if (!route.getCompanyId().equals(companyId)) {
            throw new RuntimeException("Unauthorized: Route belongs to another company.");
        }
        routeRepository.deleteById(id);
    }
}