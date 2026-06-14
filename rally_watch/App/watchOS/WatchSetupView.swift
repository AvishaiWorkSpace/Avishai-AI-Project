import SwiftUI
import PadelScoreKit

/// Minimal match setup that fits a watch: format + golden point + who serves.
/// (Full team-name editing lives on the phone; the watch keeps it quick.)
struct WatchSetupView: View {
    @EnvironmentObject var vm: MatchViewModel
    @Environment(\.dismiss) private var dismiss

    @State private var goldenPoint = true
    @State private var bestOfThree = true
    @State private var superTiebreak = false
    @State private var firstServer = Team.a

    var body: some View {
        Form {
            Toggle("נקודת זהב", isOn: $goldenPoint)
            Toggle("שלושה סטים", isOn: $bestOfThree)
            if bestOfThree {
                Toggle("סופר טייברייק בסט מכריע", isOn: $superTiebreak)
            }
            Picker("פתיחה", selection: $firstServer) {
                Text("אנחנו").tag(Team.a)
                Text("יריבים").tag(Team.b)
            }
            Button {
                vm.startNew(MatchConfig(
                    goldenPoint: goldenPoint,
                    setsToWin: bestOfThree ? 2 : 1,
                    finalSetSuperTiebreak: superTiebreak,
                    firstServer: firstServer
                ))
                dismiss()
            } label: {
                Text("התחל").frame(maxWidth: .infinity)
            }
            .tint(Color.rallyBrand)
        }
    }
}
