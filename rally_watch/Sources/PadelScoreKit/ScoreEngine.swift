import Foundation

/// The padel scoring rules, as pure functions. `awardPoint` never mutates its
/// input — it returns a new `MatchState` — so the apps can keep a stack of past
/// states for undo simply by snapshotting before each call.
public enum ScoreEngine {

    // MARK: - Lifecycle

    public static func newMatch(_ config: MatchConfig) -> MatchState {
        MatchState(config: config, server: config.firstServer, tbFirstServer: config.firstServer)
    }

    /// Award one point to `team` and return the resulting state.
    public static func awardPoint(_ state: MatchState, to team: Team) -> MatchState {
        guard !state.finished else { return state }
        var s = state
        s.seq += 1

        if s.inTiebreak {
            awardTiebreakPoint(&s, to: team)
        } else {
            awardGamePoint(&s, to: team)
        }
        return s
    }

    // MARK: - Normal game

    private static func awardGamePoint(_ s: inout MatchState, to team: Team) {
        let t = team.rawValue, o = team.other.rawValue
        s.points[t] += 1

        if isGameWon(points: s.points, team: team, golden: s.config.goldenPoint) {
            winGame(&s, winner: team)
        } else if !s.config.goldenPoint,
                  s.points[t] >= 3, s.points[o] >= 3, s.points[t] == s.points[o] {
            // Advantage mode: collapse 4–4, 5–5… back to deuce (40–40).
            s.points = [3, 3]
        }
    }

    /// In golden-point mode any 4th point wins (the game can only reach 4–3 via the
    /// sudden-death point, or 4–x≤2 via a normal close-out). In advantage mode you
    /// need 4+ points and a two-point lead.
    static func isGameWon(points: [Int], team: Team, golden: Bool) -> Bool {
        let t = points[team.rawValue], o = points[team.other.rawValue]
        if golden { return t >= 4 }
        return t >= 4 && t - o >= 2
    }

    private static func winGame(_ s: inout MatchState, winner: Team) {
        let w = winner.rawValue, l = winner.other.rawValue
        s.games[w] += 1
        s.points = [0, 0]
        s.server = s.server.other

        if s.games[w] >= s.config.gamesPerSet && s.games[w] - s.games[l] >= 2 {
            winSet(&s, winner: winner, tbPoints: nil)
        } else if s.games[0] == s.config.gamesPerSet && s.games[1] == s.config.gamesPerSet {
            enterTiebreak(&s, superTB: false)
        }
    }

    // MARK: - Tiebreak

    private static func enterTiebreak(_ s: inout MatchState, superTB: Bool) {
        s.inTiebreak = true
        s.superTiebreak = superTB
        s.points = [0, 0]
        s.tbFirstServer = s.server
        s.tbPointsPlayed = 0
    }

    private static func awardTiebreakPoint(_ s: inout MatchState, to team: Team) {
        let t = team.rawValue, o = team.other.rawValue
        s.points[t] += 1
        s.tbPointsPlayed += 1
        updateTiebreakServer(&s)

        let target = s.superTiebreak ? s.config.superTiebreakPoints : s.config.tiebreakPoints
        if s.points[t] >= target && s.points[t] - s.points[o] >= 2 {
            winSet(&s, winner: team, tbPoints: s.points)
        }
    }

    /// First server serves point 1; thereafter serve alternates every two points.
    /// Sets `server` for the upcoming point.
    static func updateTiebreakServer(_ s: inout MatchState) {
        let k = s.tbPointsPlayed + 1               // 1-based index of the next point
        let group = k <= 1 ? 0 : ((k - 2) / 2 + 1) // 0 for point 1, then pairs
        s.server = (group % 2 == 0) ? s.tbFirstServer : s.tbFirstServer.other
    }

    // MARK: - Sets & match

    private static func winSet(_ s: inout MatchState, winner: Team, tbPoints: [Int]?) {
        let w = winner.rawValue, l = winner.other.rawValue

        var recordedGames = s.games
        var isSuper = false
        if let tb = tbPoints {
            if s.superTiebreak {
                recordedGames = tb                       // e.g. [10, 8]
                isSuper = true
            } else {
                recordedGames = [0, 0]
                recordedGames[w] = s.config.gamesPerSet + 1  // 7
                recordedGames[l] = s.config.gamesPerSet      // 6
            }
        }
        s.completedSets.append(CompletedSet(games: recordedGames, tiebreak: tbPoints, isSuperTiebreak: isSuper))
        s.sets[w] += 1

        let wasTiebreak = tbPoints != nil
        s.inTiebreak = false
        s.superTiebreak = false
        s.games = [0, 0]
        s.points = [0, 0]

        if s.sets[w] >= s.config.setsToWin {
            s.finished = true
            s.winner = winner
            return
        }

        // After a tiebreak the player who would have served the next game serves first.
        if wasTiebreak { s.server = s.tbFirstServer.other }

        // Deciding set played as a super tiebreak (best-of-three+ only).
        if s.config.finalSetSuperTiebreak,
           s.config.setsToWin >= 2,
           s.sets[0] == s.config.setsToWin - 1,
           s.sets[1] == s.config.setsToWin - 1 {
            enterTiebreak(&s, superTB: true)
        }
    }

    // MARK: - Display

    private static let pointNames = ["0", "15", "30", "40"]

    /// The label to show for a team's current-game score: tiebreak shows the raw
    /// count; otherwise 0/15/30/40, with "Ad" for advantage.
    public static func pointLabel(_ s: MatchState, _ team: Team) -> String {
        if s.inTiebreak { return "\(s.points[team.rawValue])" }
        let t = s.points[team.rawValue], o = s.points[team.other.rawValue]
        if t >= 3 && o >= 3 {
            if t == o { return "40" }
            return t > o ? "Ad" : "40"
        }
        return pointNames[min(t, 3)]
    }

    /// Compact one-line summary, e.g. "6-4 3-2 · 40-15" — handy for logs/tests.
    public static func summary(_ s: MatchState) -> String {
        var parts = s.completedSets.map { "\($0.games[0])-\($0.games[1])" }
        parts.append("\(s.games[0])-\(s.games[1])")
        let sets = parts.joined(separator: " ")
        if s.finished { return sets }
        let pts = "\(pointLabel(s, .a))-\(pointLabel(s, .b))"
        return "\(sets) · \(pts)"
    }
}
