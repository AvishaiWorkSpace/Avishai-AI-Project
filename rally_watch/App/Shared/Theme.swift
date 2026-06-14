import SwiftUI

// Rally brand palette — mirrors the web app's tokens (emerald + champagne gold).
public extension Color {
    static let rallyBrand = Color(rgb: 0x173A30)
    static let rallyBrandDeep = Color(rgb: 0x0B201A)
    static let rallyGold = Color(rgb: 0xC9A961)
    static let rallyGoldLight = Color(rgb: 0xE8D6B0)
    static let rallyIvory = Color(rgb: 0xFAF8F3)

    /// Build a color from a 24-bit hex value, e.g. `Color(rgb: 0x173A30)`.
    init(rgb: Int) {
        self.init(
            red: Double((rgb >> 16) & 0xFF) / 255,
            green: Double((rgb >> 8) & 0xFF) / 255,
            blue: Double(rgb & 0xFF) / 255
        )
    }
}
