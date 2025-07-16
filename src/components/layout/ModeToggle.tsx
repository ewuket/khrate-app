
import React from 'react';
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";

export const ModeToggle: React.FC = () => {
  const [isDark, setIsDark] = React.useState(false);

  const toggleMode = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <Button variant="outline" size="icon" onClick={toggleMode}>
      {isDark ? (
        <Sun className="h-4 w-4" />
      ) : (
        <Moon className="h-4 w-4" />
      )}
    </Button>
  );
};
