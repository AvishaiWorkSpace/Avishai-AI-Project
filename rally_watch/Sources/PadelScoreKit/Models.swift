import Foundation

/// One of the two sides on court. All score arrays in `MatchState` are indexed
/// `[Team.a, Team.b]` — `team.rawValue` is the index.
public enum Team: Int, Codable, Sendable, CaseIterable {
    case a = 0
    case b = 1

    public var other: Team { self == .a ? .b : .a }
}

/// How a match is scored. Defaults follow the common Israeli / FIP padel format:
/// golden point on, best-of-three, tiebreak to 7 at 6–6.
public struct MatchConfig: Codable, Equatable, Sendable {
    /// Display names, indexed `[a, b]`.
    public var teamNames: [String]
    /// `true` = sudden-death point at 40–40 (punto de oro). `false` = win-by-two advantage.
    public var goldenPoint: Bool
    /// Sets needed to win the match. `2` = best of three, `1` = single set.
    public var setsToWin: Int
    /// Games needed to take a set (win by two), normally `6`.
    public var gamesPerSet: Int
    /// Points to win a normal 6–6 tiebreak (win by two), normally `7`.
    public var tiebreakPoints: Int
    /// Replace the deciding set with a super tiebreak to `superTiebreakPoints`.
    public var finalSetSuperTiebreak: Bool
    public var superTiebreakPoints: Int
    /// Who serves the very first game.
    public var firstServer: Team

    public init(
        teamNames: [String] = ["אנחנו", "יריבים"],
        goldenPoint: Bool = true,
        setsToWin: Int = 2,
        gamesPerSet: Int = 6,
        tiebreakPoints: Int = 7,
        finalSetSuperTiebreak: Bool = false,
        superTiebreakPoints: Int = 10,
        firstServer: Team = .a
    ) {
        self.teamNames = teamNames
        self.goldenPoint = goldenPoint
        self.setsToWin = setsToWin
        self.gamesPerSet = gamesPerSet
        self.tiebreakPoints = tiebreakPoints
        self.finalSetSuperTiebreak = finalSetSuperTiebreak
        self.superTiebreakPoints = superTiebreakPoints
        self.firstServer = firstServer
    }
}

/// A finished set, kept for the scoreboard history. `games` is `[a, b]`
/// (for a super tiebreak it holds the tiebreak points, e.g. `[10, 8]`).
public struct CompletedSet: Codable, Equatable, Sendable {
    public var games: [Int]
    public var tiebreak: [Int]?
    public var isSuperTiebreak: Bool

    public init(games: [Int], tiebreak: [Int]? = nil, isSuperTiebreak: Bool = false) {
        self.games = games
        self.tiebreak = tiebreak
        self.isSuperTiebreak = isSuperTiebreak
    }
}

/// The complete, serializable state of a match. This is the single value that
/// gets passed between the watch and the phone — it is small and `Codable`, so
/// every change ships the whole thing and the higher `seq` wins.
public struct MatchState: Codable, Equatable, Sendable, Identifiable {
    public var id: UUID
    public var config: MatchConfig

    /// Raw point counts in the current game, `[a, b]` (0,1,2,3… — see `ScoreEngine.pointLabel`).
    public var points: [Int]
    /// Games in the current set, `[a, b]`.
    public var games: [Int]
    /// Sets won, `[a, b]`.
    public var sets: [Int]
    public var completedSets: [CompletedSet]

    public var server: Team
    public var inTiebreak: Bool
    public var superTiebreak: Bool
    public var tbFirstServer: Team
    public var tbPointsPlayed: Int

    public var finished: Bool
    public var winner: Team?

    /// Monotonic counter bumped on every awarded point — used to resolve
    /// races between the two paired devices (last writer wins).
    public var seq: Int

    public init(
        id: UUID = UUID(),
        config: MatchConfig,
        points: [Int] = [0, 0],
        games: [Int] = [0, 0],
        sets: [Int] = [0, 0],
        completedSets: [CompletedSet] = [],
        server: Team,
        inTiebreak: Bool = false,
        superTiebreak: Bool = false,
        tbFirstServer: Team,
        tbPointsPlayed: Int = 0,
        finished: Bool = false,
        winner: Team? = nil,
        seq: Int = 0
    ) {
        self.id = id
        self.config = config
        self.points = points
        self.games = games
        self.sets = sets
        self.completedSets = completedSets
        self.server = server
        self.inTiebreak = inTiebreak
        self.superTiebreak = superTiebreak
        self.tbFirstServer = tbFirstServer
        self.tbPointsPlayed = tbPointsPlayed
        self.finished = finished
        self.winner = winner
        self.seq = seq
    }
}
