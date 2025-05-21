
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Index = () => {
  return (
    <div className="min-h-screen bg-background p-8">
      <header className="container mx-auto py-6">
        <nav className="flex items-center justify-between">
          <div className="responsive-h2">Blog Platform</div>
          <div className="space-x-4">
            <Link to="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link to="/signup">
              <Button>Sign Up</Button>
            </Link>
          </div>
        </nav>
      </header>
      
      <main className="container mx-auto py-12">
        <div className="text-center mb-12">
          <h1 className="responsive-h1 mb-4">Welcome to the Blog Platform</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Share your thoughts, ideas, and stories with our powerful and easy-to-use blogging platform.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className="border rounded-lg p-6">
            <h2 className="responsive-h2 mb-3">Getting Started with React</h2>
            <p className="text-muted-foreground mb-4">
              Learn the basics of React and start building modern web applications.
            </p>
            <Link to="/blog/getting-started-with-react">
              <Button variant="outline" className="w-full">Read Article</Button>
            </Link>
          </div>
          
          <div className="border rounded-lg p-6">
            <h2 className="responsive-h2 mb-3">Advanced JavaScript Techniques</h2>
            <p className="text-muted-foreground mb-4">
              Explore advanced patterns and techniques in JavaScript programming.
            </p>
            <Link to="/blog/advanced-javascript-techniques">
              <Button variant="outline" className="w-full">Read Article</Button>
            </Link>
          </div>
        </div>
      </main>
      
      <footer className="bg-muted py-6 mt-12">
        <div className="container mx-auto text-center text-muted-foreground">
          &copy; {new Date().getFullYear()} Blog Platform. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Index;
