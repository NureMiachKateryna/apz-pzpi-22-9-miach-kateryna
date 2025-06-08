package com.example.honeyapp.data.repository

import com.example.honeyapp.data.api.AlertApiService
import com.example.honeyapp.data.model.AlertDto
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

class AlertRepository(private val alertApiService: AlertApiService) {

    suspend fun getRecentUnreadAlerts(limit: Int = 5): Result<List<AlertDto>> {
        return withContext(Dispatchers.IO) {
            try {
                val response = alertApiService.getAlerts(isRead = false, limit = limit, sortBy = "timestamp", sortOrder = "DESC")
                if (response.isSuccessful && response.body() != null) {
                    Result.Success(response.body()!!)
                } else {
                    val errorBody = response.errorBody()?.string() ?: "Unknown error"
                    Result.Error(Exception("Failed to fetch alerts: ${response.code()} - $errorBody"), response.code(), errorBody)
                }
            } catch (e: Exception) {
                Result.Error(e)
            }
        }
    }
}