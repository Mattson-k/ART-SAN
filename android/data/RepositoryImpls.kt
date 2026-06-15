package com.artsan.app.data

import com.artsan.app.domain.*
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.map

class ArtistRepositoryImpl : ArtistRepository {
    private val artistsList = listOf(
        ArtistEntity(
            id = "art-1",
            name = "Jessica Davis",
            avatarUrl = "assets/artist_avatar_1.png",
            location = "Brooklyn, NY",
            style = "Botanical",
            rating = 4.9,
            reviewsCount = 28,
            priceRange = "$1,200 - $3,500",
            bio = "Specializing in oversized botanical storefront murals that bring organic warmth.",
            portfolioUrlsCsv = "assets/mural_botanical.png|assets/mural_realism.png"
        ),
        ArtistEntity(
            id = "art-2",
            name = "Marcus Vance",
            avatarUrl = "assets/artist_avatar_2.png",
            location = "Queens, NY",
            style = "Abstract",
            rating = 4.8,
            reviewsCount = 34,
            priceRange = "$1,500 - $4,000",
            bio = "Focused on high-contrast geometric abstractions.",
            portfolioUrlsCsv = "assets/mural_abstract.png|assets/mural_realism.png"
        )
    )

    override suspend fun getArtists(): Result<List<Artist>> = Result.success(
        artistsList.map { it.toDomain() }
    )

    override suspend fun getArtistById(id: String): Result<Artist?> = Result.success(
        artistsList.find { it.id == id }?.toDomain()
    )
}

class MuralRepositoryImpl : MuralRepository {
    private val mockDb = MutableStateFlow<List<ProjectEntity>>(
        listOf(
            ProjectEntity(
                id = "proj-101",
                title = "Majestic Tiger Facade Painting",
                businessName = "The Tiger's Den",
                address = "142 Bedford Ave, Brooklyn NY",
                artistId = "art-1",
                artistName = "Jessica Davis",
                style = "Realism",
                dimensions = "12ft x 18ft",
                budget = 2500.0,
                targetDate = "2026-06-28",
                status = "ACTIVE",
                progress = 65,
                timelineJson = "Initial Design Approval,Sketch contract approved,DONE;Milestone Deposit Paid,Stripe 50% checkout complete,DONE;Surface Preparation,Brick clean outline,DONE;Color Fill & Rendering,Detail spray paint in progress,CURRENT;Final Client Inspection,Owner sign off,PENDING",
                updatesJson = "Elena Rostova,2 hours ago,Tiger teeth shades completed;The Tiger's Den,Yesterday,Looks beautiful",
                muralImageUrl = "assets/mural_realism.png",
                isDepositPaid = true,
                isFinalPaid = false
            )
        )
    )

    override fun observeProjects(): Flow<List<MuralProject>> {
        return mockDb.map { list -> list.map { it.toDomain() } }
    }

    override suspend fun getProjectById(id: String): Result<MuralProject?> {
        val proj = mockDb.value.find { it.id == id }?.toDomain()
        return Result.success(proj)
    }

    override suspend fun insertProject(project: MuralProject): Result<Unit> {
        val list = mockDb.value.toMutableList()
        list.add(0, project.toEntity())
        mockDb.value = list
        return Result.success(Unit)
    }

    override suspend fun updateProjectProgress(projectId: String, progress: Int): Result<Unit> {
        val list = mockDb.value.map {
            if (it.id == projectId) {
                // Compile new milestones status
                val originalDomain = it.toDomain()
                val updatedTimeline = originalDomain.timeline.mapIndexed { idx, mil ->
                    when {
                        progress >= 100 && idx == 4 -> mil.copy(status = MilestoneStatus.DONE)
                        progress >= 90 && idx == 3 -> mil.copy(status = MilestoneStatus.DONE)
                        progress >= 30 && idx == 2 -> mil.copy(status = MilestoneStatus.DONE)
                        else -> mil
                    }
                }
                originalDomain.copy(
                    progress = progress,
                    timeline = updatedTimeline
                ).toEntity()
            } else it
        }
        mockDb.value = list
        return Result.success(Unit)
    }

    override suspend fun addComment(projectId: String, comment: UserComment): Result<Unit> {
        val list = mockDb.value.map {
            if (it.id == projectId) {
                val orig = it.toDomain()
                orig.copy(
                    updates = listOf(comment) + orig.updates
                ).toEntity()
            } else it
        }
        mockDb.value = list
        return Result.success(Unit)
    }

    override suspend fun processMilestonePayment(projectId: String, paymentType: String): Result<Unit> {
        val list = mockDb.value.map {
            if (it.id == projectId) {
                val orig = it.toDomain()
                val updated = if (paymentType == "deposit") {
                    orig.copy(
                        isDepositPaid = true,
                        status = ProjectStatus.ACTIVE
                    )
                } else {
                    orig.copy(
                        isFinalPaid = true,
                        status = ProjectStatus.COMPLETED
                    )
                }
                updated.toEntity()
            } else it
        }
        mockDb.value = list
        return Result.success(Unit)
    }
}
