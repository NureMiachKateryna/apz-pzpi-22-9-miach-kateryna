package com.example.honeyapp.data.model

import android.os.Parcelable
import com.google.gson.annotations.SerializedName
import kotlinx.parcelize.Parcelize

@Parcelize
data class AlertDto(
    @SerializedName("alert_id")
    val alertId: Int,
    @SerializedName("user_id")
    val userId: Int,
    @SerializedName("sensor_id")
    val sensorId: String?,
    @SerializedName("reading_id")
    val readingId: Int?,
    val message: String,
    @SerializedName("alert_level")
    val alertLevel: String?,
    val timestamp: String,
    @SerializedName("is_read")
    val isRead: Boolean,
    @SerializedName("Sensor")
    val sensor: SensorSimpleDto?
) : Parcelable

@Parcelize
data class SensorSimpleDto(
    @SerializedName("sensor_id")
    val sensorId: String,
    val name: String?
) : Parcelable