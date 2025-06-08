// util/TokenManager.kt
package com.example.honeyapp.data.util

import android.content.Context
import android.content.SharedPreferences
import com.example.honeyapp.data.model.UserDto
import com.google.gson.Gson

class TokenManager(context: Context) {
    private val prefs: SharedPreferences = context.getSharedPreferences("auth_prefs", Context.MODE_PRIVATE)
    private val gson = Gson()

    companion object {
        private const val USER_TOKEN = "user_token"
        private const val USER_DETAILS_JSON = "user_details_json"
    }

    fun saveToken(token: String) {
        println("TOKEN_MANAGER_SAVE: Saving token: ${token.take(15)}...")
        prefs.edit().putString(USER_TOKEN, token).apply()
    }
    fun getToken(): String? {
        val token = prefs.getString(USER_TOKEN, null)
        println("TOKEN_MANAGER_GET: Retrieving token: ${token?.take(15)}...")
        return token
    }

    fun saveUserDetails(user: UserDto) {
        val userJson = gson.toJson(user)
        prefs.edit().putString(USER_DETAILS_JSON, userJson).apply()
    }

    fun getUserDetailsJson(): String? {
        return prefs.getString(USER_DETAILS_JSON, null)
    }



    fun clearToken() {
        prefs.edit().remove(USER_TOKEN).apply()
    }

    fun clearUserDetailsJson() {
        prefs.edit().remove(USER_DETAILS_JSON).apply()
    }

    fun clearAllAuthData() {
        prefs.edit().clear().apply()
    }
}