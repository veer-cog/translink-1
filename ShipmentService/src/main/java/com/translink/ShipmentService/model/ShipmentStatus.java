package com.translink.ShipmentService.model;

public enum ShipmentStatus {
    CREATED,
    READY_FOR_PICKUP,
    IN_TRANSIT,
    ARRIVED_AT_HUB,
    OUT_FOR_DELIVERY,
    DELIVERED,
    CANCELLED}