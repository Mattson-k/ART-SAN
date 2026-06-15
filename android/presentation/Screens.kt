package com.artsan.app.presentation

import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedRectangle
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.artsan.app.domain.*

// Theme Colors matching Obsidian design
val ObsidianBg = Color(0xFF080B11)
val GlassCardColor = Color(0x99111827)
val ElectricPurple = Color(0xFF9D6EFF)
val CoralPink = Color(0xFFEC4899)
val EmeraldGreen = Color(0xFF10B981)
val TextMain = Color(0xFFF3F4F6)
val TextMuted = Color(0xFF9CA3AF)

@Composable
fun MarketplaceScreen(
    viewModel: MarketplaceViewModel,
    onArtistSelected: (Artist) -> Unit
) {
    val uiState by viewModel.uiState.collectAsState()
    
    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(ObsidianBg)
            .padding(16.dp)
    ) {
        Text(
            text = "Discover Local Artists",
            fontSize = 28.sp,
            fontWeight = FontWeight.Bold,
            color = TextMain
        )
        Spacer(modifier = Modifier.height(16.dp))
        
        // Search & Filter
        Row(modifier = Modifier.fillMaxWidth()) {
            OutlinedTextField(
                value = uiState.searchKeyword,
                onValueChange = { viewModel.setSearchKeyword(it) },
                label = { Text("Search styles, cities...") },
                colors = OutlinedTextFieldDefaults.colors(focusedBorderColor = ElectricPurple),
                modifier = Modifier.weight(1f)
            )
        }
        
        Spacer(modifier = Modifier.height(16.dp))
        
        LazyColumn(verticalArrangement = Arrangement.spacedBy(16.dp)) {
            items(uiState.artists) { artist ->
                ArtistCard(artist = artist, onArtistSelected = onArtistSelected)
            }
        }
    }
}

@Composable
fun ArtistCard(artist: Artist, onArtistSelected: (Artist) -> Unit) {
    Card(
        colors = CardDefaults.cardColors(containerColor = GlassCardColor),
        shape = RoundedCornerShape(16.dp),
        modifier = Modifier.fillMaxWidth()
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Box(
                    modifier = Modifier
                        .size(64.dp)
                        .clip(CircleShape)
                        .background(Color.Gray)
                )
                Spacer(modifier = Modifier.width(16.dp))
                Column {
                    Text(artist.name, color = TextMain, fontSize = 18.sp, fontWeight = FontWeight.Bold)
                    Text("📍 ${artist.location}", color = TextMuted, fontSize = 14.sp)
                }
            }
            Spacer(modifier = Modifier.height(12.dp))
            Text(artist.bio, color = TextMuted, fontSize = 14.sp)
            Spacer(modifier = Modifier.height(12.dp))
            Button(
                onClick = { onArtistSelected(artist) },
                colors = ButtonDefaults.buttonColors(containerColor = ElectricPurple)
            ) {
                Text("View Portfolio & Hire")
            }
        }
    }
}

@Composable
fun WorkspaceScreen(
    viewModel: WorkspaceViewModel
) {
    val uiState by viewModel.uiState.collectAsState()
    val activeProject = uiState.activeProject
    
    if (activeProject == null) {
        Box(
            modifier = Modifier.fillMaxSize().background(ObsidianBg),
            contentAlignment = Alignment.Center
        ) {
            Text("No active mural projects.", color = TextMuted)
        }
        return
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(ObsidianBg)
            .padding(16.dp)
    ) {
        Text(activeProject.title, color = TextMain, fontSize = 24.sp, fontWeight = FontWeight.Bold)
        Text("Client: ${activeProject.businessName}", color = TextMuted, fontSize = 14.sp)
        
        Spacer(modifier = Modifier.height(16.dp))
        
        // Progress bar
        Card(
            colors = CardDefaults.cardColors(containerColor = GlassCardColor),
            shape = RoundedCornerShape(16.dp),
            modifier = Modifier.fillMaxWidth()
        ) {
            Column(modifier = Modifier.padding(16.dp)) {
                Row(
                    horizontalArrangement = Arrangement.SpaceBetween,
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Text("Current Progress", color = TextMain, fontWeight = FontWeight.Bold)
                    Text("${activeProject.progress}%", color = ElectricPurple, fontWeight = FontWeight.Bold)
                }
                Spacer(modifier = Modifier.height(8.dp))
                LinearProgressIndicator(
                    progress = activeProject.progress / 100f,
                    color = ElectricPurple,
                    trackColor = Color(0x33FFFFFF),
                    modifier = Modifier.fillMaxWidth()
                )
                
                // Artist progress range selector slider
                if (uiState.activeRole == "artist") {
                    var sliderValue by remember { mutableFloatStateOf(activeProject.progress.toFloat()) }
                    Slider(
                        value = sliderValue,
                        onValueChange = { sliderValue = it },
                        valueRange = 0f..100f
                    )
                    Button(
                        onClick = { 
                            // Update progress
                        },
                        colors = ButtonDefaults.buttonColors(containerColor = ElectricPurple),
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Text("Post Progress Update")
                    }
                } else {
                    // Milestone billing approvals
                    if (activeProject.progress == 100 && !activeProject.isFinalPaid) {
                        Button(
                            onClick = { viewModel.openStripeCheckout("final") },
                            colors = ButtonDefaults.buttonColors(containerColor = EmeraldGreen),
                            modifier = Modifier.fillMaxWidth()
                        ) {
                            Text("Release Milestone Final Payment ($${(activeProject.budget/2).toInt()})")
                        }
                    }
                }
            }
        }
        
        Spacer(modifier = Modifier.height(24.dp))
        
        // Timeline list
        Text("Milestone Timeline", color = TextMain, fontWeight = FontWeight.Bold)
        LazyColumn(verticalArrangement = Arrangement.spacedBy(8.dp)) {
            items(activeProject.timeline) { milestone ->
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    modifier = Modifier.padding(vertical = 4.dp)
                ) {
                    val color = when (milestone.status) {
                        MilestoneStatus.DONE -> EmeraldGreen
                        MilestoneStatus.CURRENT -> ElectricPurple
                        else -> TextMuted
                    }
                    Box(
                        modifier = Modifier
                            .size(16.dp)
                            .clip(CircleShape)
                            .background(color)
                    )
                    Spacer(modifier = Modifier.width(16.dp))
                    Column {
                        Text(milestone.name, color = TextMain, fontWeight = FontWeight.Bold)
                        Text(milestone.description, color = TextMuted, fontSize = 12.sp)
                    }
                }
            }
        }
    }
}
