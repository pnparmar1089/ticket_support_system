import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card";
  import { Label } from "@/components/ui/label";
  import { Input } from "@/components/ui/input";
  import { Button } from "@/components/ui/button";
  
  export default function page() {
    return (
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <Card className="w-[350px]">
          <CardHeader>
            <CardTitle>Log In</CardTitle>
            <CardDescription>Log in Admin Only</CardDescription>
          </CardHeader>
          <CardContent>
            <form>
              <div className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="username">Username</Label>
                  <Input id="username" placeholder="Enter Your Username" />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" type="password" placeholder="Enter Your Password" />
                </div>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col justify-between">
            <Button>Log In</Button>
            <Button variant="link">Forgot Password</Button>
  
          </CardFooter>
        </Card>
      </main>
    );
  }
  