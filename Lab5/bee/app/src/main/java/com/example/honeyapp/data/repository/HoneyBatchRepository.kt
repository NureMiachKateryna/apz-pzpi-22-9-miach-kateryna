package com.example.honeyapp.data.repository

import com.example.honeyapp.data.api.HoneyBatchApiService
import com.example.honeyapp.data.model.CountResponseDto
import com.example.honeyapp.data.model.HoneyBatchDto
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

class HoneyBatchRepository(private val honeyBatchApiService: HoneyBatchApiService) {

    suspend fun getHoneyBatches(): Result<List<HoneyBatchDto>> {
        return withContext(Dispatchers.IO) {
            try {
                val response = honeyBatchApiService.getAllHoneyBatches()
                if (response.isSuccessful && response.body() != null) {
                    Result.Success(response.body()!!)
                } else {
                    val errorBody = response.errorBody()?.string() ?: "Unknown error"
                    Result.Error(Exception("Failed to fetch honey batches: ${response.code()} - $errorBody"), response.code(), errorBody)
                }
            } catch (e: Exception) {
                Result.Error(e)
            }
        }
    }

    suspend fun getHoneyBatchesCount(): Result<CountResponseDto> {
        return withContext(Dispatchers.IO) {
            try {
                val response = honeyBatchApiService.getHoneyBatchesCount()
                if (response.isSuccessful && response.body() != null) {
                    Result.Success(response.body()!!)
                } else {
                    val errorBody = response.errorBody()?.string() ?: "Unknown error"
                    Result.Error(Exception("Failed to fetch honey batch count: ${response.code()} - $errorBody"), response.code(), errorBody)
                }
            } catch (e: Exception) {
                Result.Error(e)
            }
        }
    }

}
