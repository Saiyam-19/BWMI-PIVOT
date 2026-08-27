import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function HomePage() {
  return (
    <main className="flex min-h-svh items-center justify-center p-6">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Government Outcome Navigator</CardTitle>
          <CardDescription>
            The web foundation is ready. Verified outcome discovery is available
            through the API.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild>
            <a href="/api/outcomes">Check outcome API readiness</a>
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
