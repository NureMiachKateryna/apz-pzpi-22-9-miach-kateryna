package com.example.honeyapp.data.repository

import com.example.honeyapp.data.api.AuthApiService
import com.example.honeyapp.data.model.AuthRequest
import com.example.honeyapp.data.model.AuthResponse
import com.example.honeyapp.data.model.RegisterRequest
import com.example.honeyapp.data.model.UserDto
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

sealed class Result<out T> {
    data class Success<out T>(val data: T) : Result<T>()
    data class Error(val exception: Exception, val errorCode: Int? = null, val errorMessage: String? = null) : Result<Nothing>()
}

class AuthRepository(private val authApiService: AuthApiService) {

    suspend fun loginUser(authRequest: AuthRequest): Result<AuthResponse> {
        return withContext(Dispatchers.IO) {
            try {
                val response = authApiService.loginUser(authRequest)
                if (response.isSuccessful && response.body() != null) {
                    Result.Success(response.body()!!)
                } else {
                    val errorBody = response.errorBody()?.string() ?: "Unknown error during login"
                    Result.Error(Exception("Login API request failed: ${response.code()} - $errorBody"), response.code(), errorBody)
                }
            } catch (e: Exception) {
                Result.Error(e)
            }
        }
    }

    suspend fun registerUser(registerRequest: RegisterRequest): Result<UserDto> {
        return withContext(Dispatchers.IO) {
            try {
                val response = authApiService.registerUser(registerRequest)
                if (response.isSuccessful && response.body() != null) {
                    Result.Success(response.body()!!)
                } else {
                    val errorBody = response.errorBody()?.string() ?: "Unknown error during registration"
                    Result.Error(Exception("Registration API request failed: ${response.code()} - $errorBody"), response.code(), errorBody)
                }
            } catch (e: Exception) {
                Result.Error(e)
            }
        }
    }
}