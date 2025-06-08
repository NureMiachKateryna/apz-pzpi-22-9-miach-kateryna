package com.example.honeyapp.data.api

import com.example.honeyapp.data.model.AuthRequest
import com.example.honeyapp.data.model.AuthResponse
import com.example.honeyapp.data.model.RegisterRequest
import com.example.honeyapp.data.model.UserDto
import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.POST

interface AuthApiService {

    @POST("auth/register")
    suspend fun registerUser(@Body registerRequest: RegisterRequest): Response<UserDto>

    @POST("auth/login")
    suspend fun loginUser(@Body authRequest: AuthRequest): Response<AuthResponse>
}