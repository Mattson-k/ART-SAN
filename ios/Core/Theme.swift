import SwiftUI

struct ThemeColors {
    static let obsidianBg = Color(red: 8/255, green: 11/255, blue: 17/255)
    static let glassCard = Color(red: 17/255, green: 24/255, blue: 39/255).opacity(0.6)
    static let electricPurple = Color(red: 157/255, green: 110/255, blue: 255/255)
    static let coralPink = Color(red: 236/255, green: 72/255, blue: 153/255)
    static let emeraldGreen = Color(red: 16/255, green: 185/255, blue: 129/255)
    static let textMain = Color(red: 243/255, green: 244/255, blue: 246/255)
    static let textMuted = Color(red: 156/255, green: 163/255, blue: 175/255)
}

// Reusable custom modifier for premium glassmorphism card layouts
struct CardModifier: ViewModifier {
    func body(content: Content) -> some View {
        content
            .padding()
            .background(ThemeColors.glassCard)
            .clipShape(RoundedRectangle(cornerRadius: 16))
            .overlay(
                RoundedRectangle(cornerRadius: 16)
                    .stroke(Color.white.opacity(0.08), lineWidth: 1)
            )
            .shadow(color: Color.black.opacity(0.4), radius: 10, x: 0, y: 8)
    }
}

extension View {
    func cardStyle() -> some View {
        modifier(CardModifier())
    }
}
