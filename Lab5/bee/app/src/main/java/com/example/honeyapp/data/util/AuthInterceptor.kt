package com.example.honeyapp.data.util

import okhttp3.Interceptor
import okhttp3.Response

class AuthInterceptor(private val tokenManager: TokenManager) : Interceptor {

    override fun intercept(chain: Interceptor.Chain): Response {
        val originalRequest = chain.request()
        val token = tokenManager.getToken()

        if (originalRequest.url.encodedPath.endsWith("/auth/login") ||
            originalRequest.url.encodedPath.endsWith("/auth/register")) {
            return chain.proceed(originalRequest)
        }

        if (!token.isNullOrBlank()) {
            val authenticatedRequest = originalRequest.newBuilder()
                .header("Authorization", "Bearer $token")
                .build()
            return chain.proceed(authenticatedRequest)
        }

        return chain.proceed(originalRequest)
    }
}