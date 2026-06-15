package com.artsan.app

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import com.artsan.app.data.*
import com.artsan.app.domain.*
import com.artsan.app.presentation.*

class MainActivity : ComponentActivity() {

    // Simple mock dependency injections
    private val artistRepo = ArtistRepositoryImpl()
    private val projectRepo = MuralRepositoryImpl()

    private val getArtists = GetArtistsUseCase(artistRepo)
    private val observeProjects = ObserveProjectsUseCase(projectRepo)
    private val updateProgress = UpdateProjectProgressUseCase(projectRepo)
    private val addComment = AddCommentUseCase(projectRepo)
    private val processPayment = ProcessPaymentUseCase(projectRepo)

    private val marketplaceViewModel = MarketplaceViewModel(getArtists)
    private val workspaceViewModel = WorkspaceViewModel(observeProjects, updateProgress, addComment, processPayment)

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        
        // Trigger initial data load
        runBlockingMockLoad()

        setContent {
            var activeTab by remember { mutableStateOf("marketplace") }
            
            MaterialTheme(
                colorScheme = darkColorScheme(
                    background = ObsidianBg,
                    surface = GlassCardColor,
                    primary = ElectricPurple,
                    secondary = CoralPink
                )
            ) {
                Scaffold(
                    modifier = Modifier.fillMaxSize(),
                    bottomBar = {
                        NavigationBar(containerColor = Color(0xCC080B11)) {
                            NavigationBarItem(
                                selected = activeTab == "marketplace",
                                onClick = { activeTab = "marketplace" },
                                label = { Text("Marketplace") },
                                icon = { Text("🎨") }
                            )
                            NavigationBarItem(
                                selected = activeTab == "workspace",
                                onClick = { activeTab = "workspace" },
                                label = { Text("Workspace") },
                                icon = { Text("💼") }
                            )
                        }
                    }
                ) { innerPadding ->
                    Box(modifier = Modifier.padding(innerPadding)) {
                        when (activeTab) {
                            "marketplace" -> MarketplaceScreen(
                                viewModel = marketplaceViewModel,
                                onArtistSelected = {
                                    activeTab = "workspace"
                                }
                            )
                            "workspace" -> WorkspaceScreen(
                                viewModel = workspaceViewModel
                            )
                        }
                    }
                }
            }
        }
    }

    private fun runBlockingMockLoad() {
        // Run simple initial load actions
        // (Simulating typical coroutine scopes loading artist list values)
    }
}
