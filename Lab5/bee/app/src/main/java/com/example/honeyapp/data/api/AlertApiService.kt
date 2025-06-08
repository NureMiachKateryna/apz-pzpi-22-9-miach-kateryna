package com.example.honeyapp.data.api

import com.example.honeyapp.data.model.AlertDto
import retrofit2.Response
import retrofit2.http.GET
import retrofit2.http.Query

interface AlertApiService {
    @GET("alerts")
    suspend fun getAlerts(

        @Query("isRead") isRead: Boolean? = null,
        @Query("limit") limit: Int? = null,
        @Query("sortBy") sortBy: String? = null,
        @Query("sortOrder") sortOrder: String? = null
    ): Response<List<AlertDto>>

}