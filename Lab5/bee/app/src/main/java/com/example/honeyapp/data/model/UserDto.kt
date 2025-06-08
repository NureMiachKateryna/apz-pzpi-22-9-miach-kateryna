package com.example.honeyapp.data.model

import com.google.gson.annotations.SerializedName

data class UserDto(
    @SerializedName("user_id")
    val userId: Int,
    val username: String,
    val email: String,
    val role: String,
    @SerializedName("is_active")
    val isActive: Boolean,
    val createdAt: String,
    val updatedAt: String
)