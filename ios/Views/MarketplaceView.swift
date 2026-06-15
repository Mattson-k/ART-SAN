import SwiftUI

struct MarketplaceView: View {
    @State private var viewModel = MarketplaceViewModel()
    @Environment(Router.self) private var router
    
    var body: some View {
        ScrollView {
            LazyVStack(spacing: 20) {
                // Header
                VStack(alignment: .leading, spacing: 8) {
                    Text("Discover Local Artists")
                        .font(.custom("Outfit-Bold", size: 30))
                        .fontWeight(.bold)
                        .foregroundColor(ThemeColors.textMain)
                    
                    Text("Commission statement art for storefront facades.")
                        .font(.subheadline)
                        .foregroundColor(ThemeColors.textMuted)
                }
                .frame(maxWidth: .infinity, alignment: .leading)
                .padding(.horizontal)
                
                // Search Box
                TextField("Search styles, cities, names...", text: $viewModel.searchText)
                    .padding(12)
                    .background(Color.white.opacity(0.05))
                    .cornerRadius(10)
                    .overlay(
                        RoundedRectangle(cornerRadius: 10)
                            .stroke(Color.white.opacity(0.1), lineWidth: 1)
                    )
                    .padding(.horizontal)
                
                if viewModel.isLoading {
                    ProgressView()
                        .padding()
                } else {
                    // Artist Cards
                    ForEach(viewModel.artists.filter { artist in
                        viewModel.searchText.isEmpty || 
                        artist.name.localizedCaseInsensitiveContains(viewModel.searchText) ||
                        artist.style.localizedCaseInsensitiveContains(viewModel.searchText)
                    }) { artist in
                        ArtistCardView(artist: artist)
                            .cardStyle() // Reusable card styling ViewModifier
                            .padding(.horizontal)
                    }
                }
            }
            .padding(.vertical)
        }
        .background(ThemeColors.obsidianBg.ignoresSafeArea())
    }
}

struct ArtistCardView: View {
    let artist: Artist
    
    var body: some View {
        VStack(alignment: .leading, spacing: 14) {
            HStack(spacing: 16) {
                // Avatar
                Circle()
                    .fill(ThemeColors.electricPurple.opacity(0.2))
                    .frame(width: 50, height: 50)
                    .overlay(Text(String(artist.name.prefix(1))).fontWeight(.bold))
                
                VStack(alignment: .leading, spacing: 4) {
                    Text(artist.name)
                        .font(.headline)
                        .foregroundColor(ThemeColors.textMain)
                    
                    Text("📍 \(artist.location)")
                        .font(.caption)
                        .foregroundColor(ThemeColors.textMuted)
                }
                
                Spacer()
                
                Text("★ \(String(format: "%.1f", artist.rating))")
                    .foregroundColor(ThemeColors.coralPink)
                    .font(.subheadline)
                    .fontWeight(.bold)
            }
            
            Text(artist.bio)
                .font(.footnote)
                .foregroundColor(ThemeColors.textMuted)
                .lineLimit(3)
            
            HStack {
                Text("Style: \(artist.style)")
                    .font(.caption2)
                    .fontWeight(.bold)
                    .padding(.horizontal, 10)
                    .padding(.vertical, 4)
                    .background(ThemeColors.electricPurple.opacity(0.2))
                    .cornerRadius(8)
                
                Spacer()
                
                Button("Hire Artist") {
                    // Navigate to commission form
                }
                .font(.caption)
                .fontWeight(.bold)
                .padding(.horizontal, 16)
                .padding(.vertical, 8)
                .background(ThemeColors.electricPurple)
                .foregroundColor(.white)
                .cornerRadius(20)
            }
        }
    }
}
