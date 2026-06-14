// swift-tools-version: 5.9
import PackageDescription

// PadelScoreKit — the pure scoring engine shared by the iOS app and the watchOS
// app. No UIKit / SwiftUI / WatchKit here, so it builds and unit-tests on any
// Swift toolchain:  cd rally_watch && swift test
let package = Package(
    name: "PadelScoreKit",
    platforms: [.iOS(.v16), .watchOS(.v9), .macOS(.v13)],
    products: [
        .library(name: "PadelScoreKit", targets: ["PadelScoreKit"]),
    ],
    targets: [
        .target(name: "PadelScoreKit"),
        .testTarget(name: "PadelScoreKitTests", dependencies: ["PadelScoreKit"]),
    ]
)
