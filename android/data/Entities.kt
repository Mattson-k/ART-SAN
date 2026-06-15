package com.artsan.app.data

import com.artsan.app.domain.Artist
import com.artsan.app.domain.MuralProject
import com.artsan.app.domain.ProjectStatus
import com.artsan.app.domain.Milestone
import com.artsan.app.domain.MilestoneStatus
import com.artsan.app.domain.UserComment

// 1. ROOM DATABASE ENTITIES
data class ArtistEntity(
    val id: String,
    val name: String,
    val avatarUrl: String,
    val location: String,
    val style: String,
    val rating: Double,
    val reviewsCount: Int,
    val priceRange: String,
    val bio: String,
    val portfolioUrlsCsv: String // Serialized list of URLs
)

data class ProjectEntity(
    val id: String,
    val title: String,
    val businessName: String,
    val address: String,
    val artistId: String,
    val artistName: String,
    val style: String,
    val dimensions: String,
    val budget: Double,
    val targetDate: String,
    val status: String, // "REQUEST", "ACTIVE", "COMPLETED"
    val progress: Int,
    val timelineJson: String, // Serialized list of milestones
    val updatesJson: String, // Serialized comments
    val muralImageUrl: String,
    val isDepositPaid: Boolean,
    val isFinalPaid: Boolean
)

// 2. LAYER MAPPERS (Kotlin extension functions)
fun ArtistEntity.toDomain() = Artist(
    id = id,
    name = name,
    avatarUrl = avatarUrl,
    location = location,
    style = style,
    rating = rating,
    reviewsCount = reviewsCount,
    priceRange = priceRange,
    bio = bio,
    portfolioUrls = portfolioUrlsCsv.split("|")
)

fun Artist.toEntity() = ArtistEntity(
    id = id,
    name = name,
    avatarUrl = avatarUrl,
    location = location,
    style = style,
    rating = rating,
    reviewsCount = reviewsCount,
    priceRange = priceRange,
    bio = bio,
    portfolioUrlsCsv = portfolioUrls.joinToString("|")
)

fun ProjectEntity.toDomain(): MuralProject {
    // Basic parser placeholders for demo purposes
    val parsedStatus = when(status) {
        "ACTIVE" -> ProjectStatus.ACTIVE
        "COMPLETED" -> ProjectStatus.COMPLETED
        else -> ProjectStatus.REQUEST
    }
    
    // De-serialize simple representation for timelines (Split entries)
    val parsedTimeline = timelineJson.split(";").filter { it.isNotEmpty() }.map {
        val parts = it.split(",")
        Milestone(
            name = parts.getOrNull(0) ?: "",
            description = parts.getOrNull(1) ?: "",
            status = MilestoneStatus.valueOf(parts.getOrNull(2) ?: "PENDING")
        )
    }

    val parsedUpdates = updatesJson.split(";").filter { it.isNotEmpty() }.map {
        val parts = it.split(",")
        UserComment(
            user = parts.getOrNull(0) ?: "",
            time = parts.getOrNull(1) ?: "",
            text = parts.getOrNull(2) ?: ""
        )
    }

    return MuralProject(
        id = id,
        title = title,
        businessName = businessName,
        address = address,
        artistId = artistId,
        artistName = artistName,
        style = style,
        dimensions = dimensions,
        budget = budget,
        targetDate = targetDate,
        status = parsedStatus,
        progress = progress,
        timeline = parsedTimeline,
        updates = parsedUpdates,
        muralImageUrl = muralImageUrl,
        isDepositPaid = isDepositPaid,
        isFinalPaid = isFinalPaid
    )
}

fun MuralProject.toEntity(): ProjectEntity {
    val timelineCsv = timeline.joinToString(";") { "${it.name},${it.description},${it.status.name}" }
    val updatesCsv = updates.joinToString(";") { "${it.user},${it.time},${it.text}" }
    
    return ProjectEntity(
        id = id,
        title = title,
        businessName = businessName,
        address = address,
        artistId = artistId,
        artistName = artistName,
        style = style,
        dimensions = dimensions,
        budget = budget,
        targetDate = targetDate,
        status = status.name,
        progress = progress,
        timelineJson = timelineCsv,
        updatesJson = updatesCsv,
        muralImageUrl = muralImageUrl,
        isDepositPaid = isDepositPaid,
        isFinalPaid = isFinalPaid
    )
}
