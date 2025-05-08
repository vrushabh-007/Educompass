import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { College } from '@/lib/types';
import { MapPin, Percent, BookOpen, Globe, DollarSign, CalendarDays, CheckCircle, XCircle } from 'lucide-react';

interface CollegeCardProps {
  college: College;
  isRecommendedByAI?: boolean; // Optional: if this card is from an AI recommendation list
  aiGoodFit?: boolean; // Optional: AI's assessment if it's a good fit
}

export function CollegeCard({ college, isRecommendedByAI, aiGoodFit }: CollegeCardProps) {
  return (
    <Card className="flex flex-col h-full overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-lg">
      {college.imageUrl && (
        <div className="relative w-full h-48">
          <Image
            src={college.imageUrl}
            alt={college.name}
            layout="fill"
            objectFit="cover"
            className="transition-transform duration-300 group-hover:scale-105"
            data-ai-hint="college campus students"
          />
        </div>
      )}
      <CardHeader className="pb-3">
        <CardTitle className="text-xl font-semibold text-primary">{college.name}</CardTitle>
        <CardDescription className="flex items-center text-sm text-muted-foreground">
          <MapPin className="mr-1 h-4 w-4" /> {college.location}, {college.country}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow space-y-3 text-sm">
        <p className="text-muted-foreground line-clamp-3">{college.description}</p>
        
        <div className="flex flex-wrap gap-2">
          {college.acceptanceRate && (
            <Badge variant="secondary" className="flex items-center">
              <Percent className="mr-1 h-3 w-3" /> Acceptance: {college.acceptanceRate}%
            </Badge>
          )}
          {college.popularPrograms && college.popularPrograms.length > 0 && (
            <Badge variant="secondary" className="flex items-center">
              <BookOpen className="mr-1 h-3 w-3" /> {college.popularPrograms[0]}
            </Badge>
          )}
           {isRecommendedByAI !== undefined && (
            <Badge variant={aiGoodFit ? "default" : "destructive"} className="bg-opacity-80 flex items-center">
              {aiGoodFit ? <CheckCircle className="mr-1 h-3 w-3" /> : <XCircle className="mr-1 h-3 w-3" />}
              AI: {aiGoodFit ? "Good Fit" : "May Not Fit"}
            </Badge>
          )}
        </div>
        
        <div className="space-y-1 pt-2">
          {college.tuitionFees && (
            <p className="flex items-center text-xs text-muted-foreground">
              <DollarSign className="mr-1.5 h-3.5 w-3.5 text-green-500" /> 
              Tuition: {college.tuitionFees.amount.toLocaleString()} {college.tuitionFees.currency} / {college.tuitionFees.period}
            </p>
          )}
          {college.admissionDeadline && (
            <p className="flex items-center text-xs text-muted-foreground">
              <CalendarDays className="mr-1.5 h-3.5 w-3.5 text-blue-500" /> 
              Deadline: {college.admissionDeadline}
            </p>
          )}
        </div>

      </CardContent>
      <CardFooter className="pt-4 border-t">
        <div className="flex w-full justify-between items-center">
          <Button variant="default" size="sm" asChild>
            <Link href={`/college-search/${college.id}`}>View Details</Link>
          </Button>
          {college.website && (
            <Button variant="outline" size="sm" asChild>
              <a href={college.website} target="_blank" rel="noopener noreferrer" className="flex items-center">
                <Globe className="mr-1.5 h-4 w-4" /> Website
              </a>
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
