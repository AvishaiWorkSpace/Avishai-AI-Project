import XCTest
@testable import PadelScoreKit

final class ScoreEngineTests: XCTestCase {

    /// Award a list of points and return the final state.
    private func play(_ config: MatchConfig, _ sequence: [Team]) -> MatchState {
        sequence.reduce(ScoreEngine.newMatch(config)) { ScoreEngine.awardPoint($0, to: $1) }
    }

    // MARK: - Points within a game

    func testPointLabels() {
        var s = ScoreEngine.newMatch(MatchConfig())
        XCTAssertEqual(ScoreEngine.pointLabel(s, .a), "0")
        s = ScoreEngine.awardPoint(s, to: .a); XCTAssertEqual(ScoreEngine.pointLabel(s, .a), "15")
        s = ScoreEngine.awardPoint(s, to: .a); XCTAssertEqual(ScoreEngine.pointLabel(s, .a), "30")
        s = ScoreEngine.awardPoint(s, to: .a); XCTAssertEqual(ScoreEngine.pointLabel(s, .a), "40")
    }

    func testGoldenPointWinsAtDeuce() {
        let cfg = MatchConfig(goldenPoint: true)
        // 40-40 then one golden point to A.
        let s = play(cfg, [.a, .a, .a, .b, .b, .b, .a])
        XCTAssertEqual(s.games, [1, 0], "golden point should close the game immediately")
        XCTAssertEqual(s.points, [0, 0])
    }

    func testAdvantageRequiresTwoPoints() {
        let cfg = MatchConfig(goldenPoint: false)
        // Reach deuce, A gets advantage, B pulls back to deuce, then A wins by two.
        var s = play(cfg, [.a, .a, .a, .b, .b, .b]) // 40-40
        XCTAssertEqual(s.points, [3, 3])
        s = ScoreEngine.awardPoint(s, to: .a)        // Ad A
        XCTAssertEqual(ScoreEngine.pointLabel(s, .a), "Ad")
        s = ScoreEngine.awardPoint(s, to: .b)        // back to deuce
        XCTAssertEqual(s.points, [3, 3])
        s = ScoreEngine.awardPoint(s, to: .a)        // Ad A
        s = ScoreEngine.awardPoint(s, to: .a)        // game A
        XCTAssertEqual(s.games, [1, 0])
    }

    // MARK: - Games & sets

    func testWinSetSixLove() {
        let cfg = MatchConfig(setsToWin: 1)
        // 24 straight points = 6 games to A.
        let s = play(cfg, Array(repeating: Team.a, count: 24))
        XCTAssertTrue(s.finished)
        XCTAssertEqual(s.winner, .a)
        XCTAssertEqual(s.completedSets.first?.games, [6, 0])
    }

    func testSetMustBeWonByTwoGames() {
        let cfg = MatchConfig(setsToWin: 1)
        var s = ScoreEngine.newMatch(cfg)
        // Drive to 5-5 by alternating whole games.
        for _ in 0..<5 { s = winGame(s, .a); s = winGame(s, .b) }
        XCTAssertEqual(s.games, [5, 5])
        s = winGame(s, .a) // 6-5 — not enough
        XCTAssertFalse(s.finished)
        s = winGame(s, .a) // 7-5 — set
        XCTAssertTrue(s.finished)
        XCTAssertEqual(s.completedSets.first?.games, [7, 5])
    }

    // MARK: - Tiebreak

    func testTiebreakTriggersAtSixAll() {
        let cfg = MatchConfig(setsToWin: 1)
        var s = ScoreEngine.newMatch(cfg)
        for _ in 0..<6 { s = winGame(s, .a); s = winGame(s, .b) } // 6-6
        XCTAssertTrue(s.inTiebreak)
        XCTAssertFalse(s.superTiebreak)
    }

    func testTiebreakToSevenWinsSet() {
        let cfg = MatchConfig(setsToWin: 1)
        var s = ScoreEngine.newMatch(cfg)
        for _ in 0..<6 { s = winGame(s, .a); s = winGame(s, .b) } // 6-6 → TB
        s = play7(s, .a)
        XCTAssertTrue(s.finished)
        XCTAssertEqual(s.completedSets.first?.games, [7, 6])
        XCTAssertEqual(s.completedSets.first?.tiebreak, [7, 0])
    }

    func testTiebreakServerRotation() {
        let cfg = MatchConfig(setsToWin: 1, firstServer: .a)
        var s = ScoreEngine.newMatch(cfg)
        for _ in 0..<6 { s = winGame(s, .a); s = winGame(s, .b) } // 6-6, server back to A
        XCTAssertEqual(s.server, .a)
        s = ScoreEngine.awardPoint(s, to: .a) // point 1 served by A → next is B
        XCTAssertEqual(s.server, .b)
        s = ScoreEngine.awardPoint(s, to: .a) // point 2 served by B → next still B
        XCTAssertEqual(s.server, .b)
        s = ScoreEngine.awardPoint(s, to: .a) // point 3 served by B → next A
        XCTAssertEqual(s.server, .a)
    }

    // MARK: - Match formats

    func testBestOfThree() {
        let cfg = MatchConfig(setsToWin: 2)
        var s = ScoreEngine.newMatch(cfg)
        s = winSet6Love(s, .a)
        XCTAssertEqual(s.sets, [1, 0])
        XCTAssertFalse(s.finished)
        s = winSet6Love(s, .a)
        XCTAssertEqual(s.sets, [2, 0])
        XCTAssertTrue(s.finished)
        XCTAssertEqual(s.winner, .a)
    }

    func testDecidingSuperTiebreak() {
        let cfg = MatchConfig(setsToWin: 2, finalSetSuperTiebreak: true, superTiebreakPoints: 10)
        var s = ScoreEngine.newMatch(cfg)
        s = winSet6Love(s, .a) // 1-0
        s = winSet6Love(s, .b) // 1-1 → deciding super tiebreak
        XCTAssertTrue(s.inTiebreak)
        XCTAssertTrue(s.superTiebreak)
        for _ in 0..<10 { s = ScoreEngine.awardPoint(s, to: .a) }
        XCTAssertTrue(s.finished)
        XCTAssertEqual(s.winner, .a)
        XCTAssertEqual(s.completedSets.last?.games, [10, 0])
        XCTAssertEqual(s.completedSets.last?.isSuperTiebreak, true)
    }

    // MARK: - Purity & guards

    func testAwardPointDoesNotMutateInput() {
        let s0 = ScoreEngine.newMatch(MatchConfig())
        _ = ScoreEngine.awardPoint(s0, to: .a)
        XCTAssertEqual(s0.points, [0, 0], "awardPoint must be pure for undo to work")
        XCTAssertEqual(s0.seq, 0)
    }

    func testNoScoringAfterFinish() {
        let cfg = MatchConfig(setsToWin: 1)
        var s = play(cfg, Array(repeating: Team.a, count: 24)) // 6-0, finished
        let seqAtFinish = s.seq
        s = ScoreEngine.awardPoint(s, to: .b)
        XCTAssertEqual(s.seq, seqAtFinish, "points after the match ends are ignored")
    }

    func testSeqIsMonotonic() {
        var s = ScoreEngine.newMatch(MatchConfig())
        s = ScoreEngine.awardPoint(s, to: .a)
        s = ScoreEngine.awardPoint(s, to: .b)
        XCTAssertEqual(s.seq, 2)
    }

    // MARK: - Helpers

    private func winGame(_ state: MatchState, _ team: Team) -> MatchState {
        var s = state
        // Four straight points takes a game from any non-deuce position with golden on,
        // and from love in advantage mode too.
        while s.games == state.games && !s.inTiebreak && !s.finished {
            s = ScoreEngine.awardPoint(s, to: team)
        }
        return s
    }

    private func winSet6Love(_ state: MatchState, _ team: Team) -> MatchState {
        var s = state
        let targetSets = s.sets
        while s.sets == targetSets && !s.finished {
            s = ScoreEngine.awardPoint(s, to: team)
        }
        return s
    }

    private func play7(_ state: MatchState, _ team: Team) -> MatchState {
        var s = state
        for _ in 0..<7 { s = ScoreEngine.awardPoint(s, to: team) }
        return s
    }
}
