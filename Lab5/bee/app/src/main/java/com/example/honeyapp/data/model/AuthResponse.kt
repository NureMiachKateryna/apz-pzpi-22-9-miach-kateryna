package com.example.honeyapp.data.model

data class AuthResponse(
    val message: String,
    val token: String,
    val user: UserDto
)