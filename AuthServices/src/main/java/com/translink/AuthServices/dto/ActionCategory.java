package com.translink.AuthServices.dto;

public enum ActionCategory {
    AUTH,          // Login, Logout, MFA toggle
    USER_MGMT,     // Create/Edit Operators
    ROUTE_OPS,     // Start, Stop, Delay Routes
    MAINTENANCE,   // Service records, Breakdowns
    VEHICLE_MGMT   // Adding/Removing Vehicles
}