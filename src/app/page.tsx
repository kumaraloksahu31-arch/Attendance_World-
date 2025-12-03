
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Briefcase, Users, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Logo } from '@/app/components/icons';

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur-sm">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-2xl font-bold text-primary">
            <Logo className="h-8 w-8" />
            <span className="font-headline">AttendEase Pro</span>
          </Link>
          <div className="flex items-center gap-2">
            <Button variant="ghost" asChild>
              <Link href="/login">Sign In</Link>
            </Button>
            <Button asChild>
              <Link href="/register">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="container py-16 text-center sm:py-24 lg:py-32">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl font-headline">
            Universal Attendance Management
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground sm:text-xl">
            One platform for all your attendance needs. Whether you're managing students or employees, AttendEase Pro offers a seamless and intuitive solution.
          </p>
          <div className="mt-8">
            <Button size="lg" asChild>
              <Link href="/register">
                Get Started for Free <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </section>

        <section className="container grid max-w-5xl gap-8 pb-16 sm:grid-cols-1 md:grid-cols-2 lg:pb-32">
          <Card className="flex flex-col">
            <CardHeader>
              <Users className="h-10 w-10 text-primary mb-2" />
              <CardTitle className="font-headline">Student Attendance</CardTitle>
              <CardDescription>Perfect for schools, colleges, and educational institutions.</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center"><CheckCircle className="h-4 w-4 mr-2 text-green-500" /> Track class attendance effortlessly.</li>
                <li className="flex items-center"><CheckCircle className="h-4 w-4 mr-2 text-green-500" /> Generate reports for parents and staff.</li>
                <li className="flex items-center"><CheckCircle className="h-4 w-4 mr-2 text-green-500" /> AI-powered insights on student patterns.</li>
              </ul>
            </CardContent>
            <CardFooter>
               <Button variant="outline" className="w-full" asChild>
                <Link href="/register">Choose Student Plan</Link>
              </Button>
            </CardFooter>
          </Card>

          <Card className="flex flex-col">
            <CardHeader>
              <Briefcase className="h-10 w-10 text-primary mb-2" />
              <CardTitle className="font-headline">Employee Attendance</CardTitle>
              <CardDescription>Ideal for small businesses, teams, and organizations.</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
               <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center"><CheckCircle className="h-4 w-4 mr-2 text-green-500" /> Monitor check-in and check-out times.</li>
                <li className="flex items-center"><CheckCircle className="h-4 w-4 mr-2 text-green-500" /> Manage schedules and shifts with ease.</li>
                <li className="flex items-center"><CheckCircle className="h-4 w-4 mr-2 text-green-500" /> Export data for payroll processing.</li>
              </ul>
            </CardContent>
             <CardFooter>
               <Button variant="outline" className="w-full" asChild>
                  <Link href="/register">Choose Employee Plan</Link>
               </Button>
            </CardFooter>
          </Card>
        </section>
      </main>

       <footer className="border-t">
        <div className="container py-6 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} AttendEase Pro. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
