package com.translink.AuthServices.dto;

import lombok.Data;

@Data
public class UpdateUserRequest {
    private String firstName;
    private String lastName;
    private String email;
    // You can add other fields here like phoneNumber if needed
}