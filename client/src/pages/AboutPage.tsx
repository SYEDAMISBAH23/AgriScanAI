import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Leaf,
  ShieldCheck,
  Camera,
  Hash,
  TrendingUp,
  CheckCircle,
  AlertTriangle,
  AlertCircle,
  Cpu,
  Scan,
} from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <div className="mx-auto max-w-5xl px-4 py-12 space-y-12">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="bg-primary text-primary-foreground p-4 rounded-full">
              <Leaf className="h-12 w-12" />
            </div>
          </div>
          <h1 className="text-5xl font-bold">AgriScan</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            AI-Powered Organic Produce Verification System
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">The Problem</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Organic food fraud is a growing concern in the agricultural industry. Studies
              estimate that <strong>10-30% of produce labeled as organic</strong> may not
              meet organic certification standards. This deception costs consumers billions
              annually and undermines trust in organic farming.
            </p>
            <p className="text-muted-foreground">
              Traditional verification methods rely on manual inspection and documentation,
              which can be time-consuming, expensive, and prone to human error.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Our Solution</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              AgriScan uses advanced AI technology to verify organic produce authenticity
              in seconds. By combining computer vision, PLU code recognition, and machine
              learning, we provide instant, reliable verification that anyone can use.
            </p>
            <div className="grid md:grid-cols-3 gap-4 mt-6">
              <div className="space-y-2">
                <Camera className="h-8 w-8 text-primary" />
                <h3 className="font-semibold">Instant Analysis</h3>
                <p className="text-sm text-muted-foreground">
                  Upload a photo and get results in seconds
                </p>
              </div>
              <div className="space-y-2">
                <ShieldCheck className="h-8 w-8 text-primary" />
                <h3 className="font-semibold">High Accuracy</h3>
                <p className="text-sm text-muted-foreground">
                  AI models trained on thousands of produce samples
                </p>
              </div>
              <div className="space-y-2">
                <Hash className="h-8 w-8 text-primary" />
                <h3 className="font-semibold">PLU Verification</h3>
                <p className="text-sm text-muted-foreground">
                  Cross-reference with standardized PLU codes
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">How It Works</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                  1
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Upload Image</h3>
                  <p className="text-sm text-muted-foreground">
                    Take a photo of your produce or upload an existing image
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                  2
                </div>
                <div>
                  <h3 className="font-semibold mb-1">AI Analysis</h3>
                  <p className="text-sm text-muted-foreground">
                    PyTorch MobileNetV2 model identifies the produce type and predicts
                    organic status
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                  3
                </div>
                <div>
                  <h3 className="font-semibold mb-1">PLU Code Detection</h3>
                  <p className="text-sm text-muted-foreground">
                    EasyOCR extracts PLU codes from stickers and labels
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                  4
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Verdict</h3>
                  <p className="text-sm text-muted-foreground">
                    Compare AI prediction with PLU code to determine organic authenticity
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Technology Stack</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Cpu className="h-5 w-5 text-primary" />
                  <span className="font-semibold">Backend</span>
                </div>
                <ul className="space-y-2 ml-7 text-sm">
                  <li>• Flask - Python web framework</li>
                  <li>• PyTorch - Deep learning framework</li>
                  <li>• MobileNetV2 - Lightweight CNN architecture</li>
                  <li>• EasyOCR - Optical character recognition</li>
                </ul>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Scan className="h-5 w-5 text-primary" />
                  <span className="font-semibold">Frontend</span>
                </div>
                <ul className="space-y-2 ml-7 text-sm">
                  <li>• React - UI framework</li>
                  <li>• TypeScript - Type safety</li>
                  <li>• Tailwind CSS - Styling</li>
                  <li>• Vite - Build tool</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Understanding Confidence Levels</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-4">
              <CheckCircle className="h-6 w-6 text-emerald-500 flex-shrink-0 mt-0.5" />
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold">Very High Reliability</span>
                  <Badge className="bg-emerald-500 text-white">90%+</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Both AI model and PLU code agree on organic status. Highly trustworthy
                  result.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <AlertTriangle className="h-6 w-6 text-amber-500 flex-shrink-0 mt-0.5" />
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold">High Reliability</span>
                  <Badge className="bg-amber-500 text-white">70-89%</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Strong confidence from AI model, but PLU code may be missing or unclear.
                  Generally reliable.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <AlertCircle className="h-6 w-6 text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold">Moderate Reliability</span>
                  <Badge className="bg-red-500 text-white">&lt;70%</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  AI model and PLU code disagree, or confidence is lower. Additional
                  verification recommended.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">PLU Code Standards</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Price Look-Up (PLU) codes are 4 or 5-digit numbers used to identify produce
              items at point of sale. They follow international standards:
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 border rounded-lg">
                <code className="text-lg font-mono font-semibold">4-digit codes</code>
                <p className="text-sm text-muted-foreground mt-2">
                  Conventionally grown produce (non-organic)
                </p>
                <p className="text-sm mt-1">Example: 4011 = Standard Banana</p>
              </div>
              <div className="p-4 border rounded-lg">
                <code className="text-lg font-mono font-semibold">5-digit codes (9xxxx)</code>
                <p className="text-sm text-muted-foreground mt-2">
                  Organically grown produce (starts with 9)
                </p>
                <p className="text-sm mt-1">Example: 94011 = Organic Banana</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Our Mission</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg">
              We believe everyone deserves access to authentic organic produce. AgriScan
              empowers consumers, retailers, and regulators with instant verification tools
              to combat fraud and promote transparency in the organic food industry.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
