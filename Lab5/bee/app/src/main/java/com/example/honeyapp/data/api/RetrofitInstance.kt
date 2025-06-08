package com.example.honeyapp.data.api

import com.example.honeyapp.data.util.AuthInterceptor
import com.example.honeyapp.data.util.TokenManager
import okhttp3.OkHttpClient
import okhttp3.logging.HttpLoggingInterceptor
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import java.util.concurrent.TimeUnit

object RetrofitInstance {

    private const val BASE_URL = "http://10.0.2.2:3000/api/"

    private var tokenManagerInstance: TokenManager? = null

    fun initializeAuthInterceptor(tokenManager: TokenManager) {
        this.tokenManagerInstance = tokenManager

    }

    private val loggingInterceptor = HttpLoggingInterceptor().apply {
        level = HttpLoggingInterceptor.Level.BODY
    }

    private val okHttpClient: OkHttpClient by lazy {
        val builder = OkHttpClient.Builder()
            .addInterceptor(loggingInterceptor)
            .connectTimeout(30, TimeUnit.SECONDS)
            .readTimeout(30, TimeUnit.SECONDS)
            .writeTimeout(30, TimeUnit.SECONDS)

        tokenManagerInstance?.let { tm ->
            builder.addInterceptor(AuthInterceptor(tm))
        } ?: run {
            println("RetrofitInstance: TokenManager not initialized for AuthInterceptor at OkHttpClient creation.")
        }
        builder.build()
    }

    private val retrofit: Retrofit by lazy {
        Retrofit.Builder()
            .baseUrl(BASE_URL)
            .client(okHttpClient)
            .addConverterFactory(GsonConverterFactory.create())
            .build()
    }

    val authApi: AuthApiService by lazy {
        retrofit.create(AuthApiService::class.java)
    }

    val honeyBatchApi: HoneyBatchApiService by lazy {
        retrofit.create(HoneyBatchApiService::class.java)
    }

    val alertApi: AlertApiService by lazy {
        retrofit.create(AlertApiService::class.java)
    }
}