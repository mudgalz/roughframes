import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useUser } from "@/hooks/use-user";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Identify() {
  const [name, setName] = useState("");

  const user = useUser((s) => s.user);
  const setUser = useUser((s) => s.setUser);

  const navigate = useNavigate();

  // Auto-redirect if user already exists
  useEffect(() => {
    if (user) {
      navigate("/workspace", { replace: true });
    }
  }, [user, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setUser({
      id: crypto.randomUUID(),
      name,
    });

    navigate("/workspace");
  };

  if (user) return null;

  return (
    <div className="flex flex-1 w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Card>
          <CardHeader className="text-center">
            <CardTitle>Enter your name </CardTitle>
            <CardDescription>
              This will be shown on your uploads & feedback.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <FieldGroup>
                <Input
                  id="name"
                  type="text"
                  autoFocus
                  placeholder="Your name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />

                <Button size={"lg"} type="submit" className="w-full">
                  Let&apos;s Start
                </Button>
              </FieldGroup>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
