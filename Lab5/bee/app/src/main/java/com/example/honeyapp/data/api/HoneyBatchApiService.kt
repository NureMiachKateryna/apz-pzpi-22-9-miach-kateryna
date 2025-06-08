package com.example.honeyapp.data.api

import com.example.honeyapp.data.model.CountResponseDto
import com.example.honeyapp.data.model.HoneyBatchDto
import retrofit2.Response
import retrofit2.http.GET

interface HoneyBatchApiService {

    @GET("honey-batches")
    suspend fun getAllHoneyBatches(): Response<List<HoneyBatchDto>>

    @GET("honey-batches/count")
    suspend fun getHoneyBatchesCount(): Response<CountResponseDto>

}