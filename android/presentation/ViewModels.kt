package com.artsan.app.presentation

import com.artsan.app.domain.*
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update

// 1. UI States
data class MarketplaceUiState(
    val artists: List<Artist> = emptyList(),
    val isLoading: Boolean = false,
    val selectedStyle: String = "All",
    val searchKeyword: String = ""
)

data class WorkspaceUiState(
    val projects: List<MuralProject> = emptyList(),
    val activeProject: MuralProject? = null,
    val activeRole: String = "business", // "business" | "artist"
    val isStripeSheetOpen: Boolean = false,
    val activeCheckoutType: String = "" // "deposit" | "final"
)

// 2. ViewModels
class MarketplaceViewModel(
    private val getArtistsUseCase: GetArtistsUseCase
) {
    private val _uiState = MutableStateFlow(MarketplaceUiState())
    val uiState: StateFlow<MarketplaceUiState> = _uiState.asStateFlow()

    suspend fun loadArtists() {
        _uiState.update { it.copy(isLoading = true) }
        getArtistsUseCase().onSuccess { list ->
            _uiState.update { it.copy(artists = list, isLoading = false) }
        }.onFailure {
            _uiState.update { it.copy(isLoading = false) }
        }
    }

    fun setFilterStyle(style: String) {
        _uiState.update { it.copy(selectedStyle = style) }
    }

    fun setSearchKeyword(keyword: String) {
        _uiState.update { it.copy(searchKeyword = keyword) }
    }
}

class WorkspaceViewModel(
    private val observeProjectsUseCase: ObserveProjectsUseCase,
    private val updateProjectProgressUseCase: UpdateProjectProgressUseCase,
    private val addCommentUseCase: AddCommentUseCase,
    private val processPaymentUseCase: ProcessPaymentUseCase
) {
    private val _uiState = MutableStateFlow(WorkspaceUiState())
    val uiState: StateFlow<WorkspaceUiState> = _uiState.asStateFlow()

    suspend fun startObserving() {
        observeProjectsUseCase().collect { list ->
            _uiState.update { state ->
                val nextActive = list.find { it.id == state.activeProject?.id } ?: list.firstOrNull()
                state.copy(projects = list, activeProject = nextActive)
            }
        }
    }

    fun selectProject(project: MuralProject) {
        _uiState.update { it.copy(activeProject = project) }
    }

    fun toggleRole(role: String) {
        _uiState.update { it.copy(activeRole = role) }
    }

    suspend fun updateProgress(projectId: String, progress: Int) {
        updateProjectProgressUseCase(projectId, progress)
    }

    suspend fun submitComment(projectId: String, text: String, author: String) {
        val comment = UserComment(
            user = author,
            time = "Just now",
            text = text
        )
        addCommentUseCase(projectId, comment)
    }

    fun openStripeCheckout(type: String) {
        _uiState.update { it.copy(isStripeSheetOpen = true, activeCheckoutType = type) }
    }

    fun closeStripeCheckout() {
        _uiState.update { it.copy(isStripeSheetOpen = false, activeCheckoutType = "") }
    }

    suspend fun executePayment(projectId: String) {
        val type = _uiState.value.activeCheckoutType
        processPaymentUseCase(projectId, type)
        closeStripeCheckout()
    }
}
