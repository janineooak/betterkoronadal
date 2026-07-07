import Foundation
import Vision
import AppKit

guard CommandLine.arguments.count > 1 else { print("usage: ocr <image>"); exit(1) }
let path = CommandLine.arguments[1]
guard let img = NSImage(contentsOfFile: path),
      let cg = img.cgImage(forProposedRect: nil, context: nil, hints: nil) else {
    FileHandle.standardError.write("cannot load \(path)\n".data(using:.utf8)!); exit(2)
}
let req = VNRecognizeTextRequest()
req.recognitionLevel = .accurate
req.usesLanguageCorrection = false
let handler = VNImageRequestHandler(cgImage: cg, options: [:])
do {
    try handler.perform([req])
    let obs = req.results as? [VNRecognizedTextObservation] ?? []
    for o in obs { if let t = o.topCandidates(1).first { print(t.string) } }
} catch { FileHandle.standardError.write("ocr err\n".data(using:.utf8)!); exit(3) }
