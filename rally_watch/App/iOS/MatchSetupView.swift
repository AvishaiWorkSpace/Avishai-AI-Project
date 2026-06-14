import SwiftUI
import PadelScoreKit

/// Full match setup on the phone: team names, format, golden point, super
/// tiebreak, and the opening server. "Start" creates the match and syncs it to
/// the watch.
struct MatchSetupView: View {
    @EnvironmentObject var vm: MatchViewModel
    var onStart: () -> Void

    @State private var teamA = "אנחנו"
    @State private var teamB = "יריבים"
    @State private var goldenPoint = true
    @State private var bestOfThree = true
    @State private var superTiebreak = false
    @State private var firstServer = Team.a

    var body: some View {
        Form {
            Section("קבוצות") {
                TextField("שם הקבוצה שלך", text: $teamA)
                TextField("שם היריבים", text: $teamB)
            }
            Section("פורמט") {
                Toggle("נקודת זהב (40-40 מכריע)", isOn: $goldenPoint)
                Picker("מספר סטים", selection: $bestOfThree) {
                    Text("סט אחד").tag(false)
                    Text("שלושה סטים").tag(true)
                }
                if bestOfThree {
                    Toggle("סופר טייברייק בסט מכריע", isOn: $superTiebreak)
                }
                Picker("מי פותח בהגשה", selection: $firstServer) {
                    Text(teamA).tag(Team.a)
                    Text(teamB).tag(Team.b)
                }
            }
            Section {
                Button(action: start) {
                    Text("התחל משחק")
                        .fontWeight(.bold)
                        .frame(maxWidth: .infinity)
                }
                .listRowBackground(Color.rallyBrand)
                .foregroundStyle(.white)
            }
        }
        .navigationTitle("Rally — ניקוד")
        .navigationBarTitleDisplayMode(.inline)
        .environment(\.layoutDirection, .rightToLeft)
    }

    private func start() {
        let names = [teamA.isEmpty ? "אנחנו" : teamA, teamB.isEmpty ? "יריבים" : teamB]
        vm.startNew(MatchConfig(
            teamNames: names,
            goldenPoint: goldenPoint,
            setsToWin: bestOfThree ? 2 : 1,
            finalSetSuperTiebreak: superTiebreak,
            firstServer: firstServer
        ))
        onStart()
    }
}
